import { useInfinity } from '@youknown/react-hook/src'
import { Button, Dialog, Drawer, Form, Loading, Motion, Space, Toast, Tooltip } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbChecks, TbPlus, TbTrashX, TbX } from 'react-icons/tb'

import type { Doc } from '@/apis/doc'
import { create_doc, delete_doc, search_docs } from '@/apis/doc'
import MoreLoading from '@/components/more-loading'
import NoMore from '@/components/no-more'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { is_dark_theme_getter, useModalStore, useRecordStore, useUIStore, useUserStore } from '@/stores'
import { with_api } from '@/utils/request'

import DocCard from '../doc-card'
import DocFilter from '../doc-filter'

interface DocListProps {
  space_id: string
  filter_open: boolean
  close_filter: () => void
  choosing: boolean
  cancel_choosing: () => void
}
export default function DocList(props: DocListProps) {
  const { space_id, filter_open, close_filter, choosing, cancel_choosing } = props

  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const has_login = useUserStore(state => state.has_login)
  const recording = useRecordStore(state => state.recording)
  const navigate = useTransitionNavigate()
  const loading_ref = useRef(null)
  const [deleting, set_deleting] = useState(false)

  const form = Form.useForm({
    defaultState: {
      keywords: '',
      sort_by: 'update_time',
      sort_type: 'desc'
    },
    async onFulfilled() {
      if (!has_login) {
        open_login_modal()
        return
      }
      await reload()
      close_filter()
    }
  })

  const docs_fetcher = async () => {
    const { keywords, sort_by, sort_type } = form.getState()
    const { list } = await search_docs({
      page,
      page_size,
      space_id,
      keywords,
      sort_by,
      sort_type
    })
    return list
  }

  const {
    page,
    pageSize: page_size,
    data: doc_list,
    noMore: no_more,
    loading,
    mutate: set_doc_list,
    reload
  } = useInfinity(docs_fetcher, {
    initialPageSize: 20,
    target: loading_ref,
    observerInit: {
      root: null,
      rootMargin: '0px 0px 200px 0px'
    },
    ready: has_login
  })

  const [create_loading, set_create_loading] = useState(false)
  const [selection, set_selection] = useState<typeof doc_list>([])
  const has_selection = selection.length > 0

  useEffect(() => {
    if (!choosing) set_selection([])
  }, [choosing])

  const is_all_selected = doc_list.every(doc => selection.some(item => item.doc_id === doc.doc_id))
  const toggle_select_all = () => {
    set_selection(is_all_selected ? [] : doc_list)
  }

  const create_new_doc = async () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    set_create_loading(true)
    const [err, new_doc] = await with_api(create_doc)({
      space_id,
      title: t('unnamed')
    })
    set_create_loading(false)
    if (err) {
      return
    }
    Toast.success(t('doc.create.success'))
    navigate(
      QS.stringify({
        base: `editor`,
        query: {
          doc_id: new_doc.doc_id
        }
      }),
      { state: new_doc }
    )
  }

  const selected_ids = selection.map(item => item.doc_id)

  const record_batching_delete_doc = () => {
    selection.forEach(item => {
      recording({
        action: 'record.batching_delete',
        target: '',
        target_id: '',
        obj_type: 'record.doc',
        obj: item.title,
        obj_id: item.doc_id,
        obj_ext: {
          space_id
        }
      })
    })
  }

  const record_delete_doc = (doc_info: Doc) => {
    recording({
      action: 'record.delete',
      target: '',
      target_id: '',
      obj_type: 'record.doc',
      obj: doc_info.title,
      obj_id: doc_info.doc_id,
      obj_ext: {
        space_id
      }
    })
  }

  const record_update_doc = (doc_info: Doc) => {
    recording({
      action: doc_info.public ? 'record.update_and_delete' : 'record.update',
      target: '',
      target_id: '',
      obj_type: 'record.doc',
      obj: doc_info.title,
      obj_id: doc_info.doc_id,
      obj_ext: {
        space_id
      }
    })
  }

  const remove_doc = async () => {
    if (deleting) return
    set_deleting(true)
    const [err] = await with_api(delete_doc)({ doc_ids: selected_ids })
    set_deleting(false)
    if (err) {
      return
    }
    Toast.success(t('doc.delete.success'))
    set_doc_list(p => p.filter(item => !selected_ids.includes(item.doc_id)))
    cancel_choosing()
    record_batching_delete_doc()
  }

  const show_doc_delete_dialog = () => {
    Dialog.confirm({
      title: t('heading.batching_delete_doc'),
      content: t('doc.delete_tip'),
      overlayClassName: cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      ),
      okDanger: true,
      okText: t('delete.text'),
      cancelText: t('cancel.text'),
      closeIcon: null,
      unmountOnExit: true,
      okLoading: deleting,
      onOk: remove_doc
    })
  }

  const filter_drawer = (
    <Drawer
      className="w-440px max-w-100% shadow-shadow-l"
      overlayClassName={cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      )}
      open={filter_open}
      onCancel={close_filter}
    >
      <DocFilter form={form} loading={loading} on_cancel={close_filter} />
    </Drawer>
  )

  const choosing_bar = (
    <Motion.Slide in={choosing} direction="up" mountOnEnter unmountOnExit>
      <div
        className={cls(
          'z-2 fixed sm:bottom-40px <sm:bottom-80px p-8px bg-bg-1 b-1 b-solid b-divider rd-radius-l shadow-shadow-l',
          'sm:left-[calc(50%-120px)] <sm:left-[calc(50%-140px)]'
        )}
      >
        <Space align="center">
          <Tooltip disabled={!has_selection} spacing={12} placement="top" title={t('delete.batching')}>
            <Button circle text disabled={!has_selection} onClick={show_doc_delete_dialog}>
              <TbTrashX className={cls('text-16px', has_selection && 'color-danger')} />
            </Button>
          </Tooltip>

          <div className="pl-16px pr-16px b-l-1 b-r-1 b-l-solid b-r-solid b-divider select-none color-text-2">
            {t('select.choosing')}
            <span className="inline-block min-w-32px font-600 color-primary">{selection.length}</span>
          </div>

          <Tooltip spacing={12} placement="top" title={is_all_selected ? t('select.cancel_all') : t('select.all')}>
            <Button circle text onClick={toggle_select_all}>
              <TbChecks className={cls('text-16px', is_all_selected && 'color-primary')} />
            </Button>
          </Tooltip>
          <Tooltip spacing={12} placement="top" title={t('select.cancel')}>
            <Button circle text onClick={cancel_choosing}>
              <TbX className="text-16px" />
            </Button>
          </Tooltip>
        </Space>
      </div>
    </Motion.Slide>
  )

  const doc_card_list = (
    <div
      className={cls(
        'grid grid-gap-[32px_24px] justify-center',
        'sm:grid-cols-[repeat(auto-fill,184px)] <sm:grid-cols-[184px]'
      )}
    >
      {choosing || (
        <Loading className="w-100%!" spinning={create_loading} size="large">
          <div
            className={cls(
              'flex justify-center items-center h-224px bg-bg-2 rd-radius-l b-1 b-dashed b-divider cursor-pointer',
              'group active-bg-active [@media(hover:hover)]-hover-not-active-bg-hover [@media(hover:hover)]-hover-b-primary [@media(hover:hover)]-hover-b-2px'
            )}
            onClick={create_new_doc}
          >
            <TbPlus className="text-28px color-text-3 [@media(hover:hover)]-group-hover-color-primary" />
          </div>
        </Loading>
      )}

      {doc_list.map(doc => {
        const is_selected = selection.some(item => item.doc_id === doc.doc_id)
        const on_choose = () => {
          if (is_selected) {
            set_selection(p => p.filter(item => item.doc_id !== doc.doc_id))
          } else {
            set_selection(p => [...p, doc])
          }
        }
        const on_deleted = () => {
          set_doc_list(p => p.filter(item => item.doc_id !== doc.doc_id))
          record_delete_doc(doc)
        }
        const on_updated = (doc: Doc) => {
          set_doc_list(p => {
            const result = p.slice()
            const index = p.findIndex(item => item.doc_id === doc.doc_id)
            result.splice(index, 1, doc)
            return result
          })
          record_update_doc(doc)
        }
        return (
          <DocCard
            key={doc.doc_id}
            choosing={choosing}
            selected={is_selected}
            info={doc}
            on_choose={on_choose}
            on_deleted={on_deleted}
            on_updated={on_updated}
          />
        )
      })}
    </div>
  )

  return (
    <>
      <div className="sm:p-32px <sm:p-16px">{doc_card_list}</div>
      {has_login && <>{no_more ? <NoMore /> : <MoreLoading ref={loading_ref} />}</>}
      {choosing_bar}
      {filter_drawer}
    </>
  )
}
