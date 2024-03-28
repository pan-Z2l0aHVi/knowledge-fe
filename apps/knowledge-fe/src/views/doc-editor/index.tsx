import { useBoolean, useDebounce, useFetch } from '@youknown/react-hook/src'
import type { Editor } from '@youknown/react-rte/src'
import { RTEMenuBar } from '@youknown/react-rte/src/components/menu-bar'
import { RTEContent } from '@youknown/react-rte/src/components/rich-text-content'
import Blockquote from '@youknown/react-rte/src/extensions/blockquote'
import Bold from '@youknown/react-rte/src/extensions/bold'
import BulletList from '@youknown/react-rte/src/extensions/bullet-list'
import Code from '@youknown/react-rte/src/extensions/code'
import CodeBlock from '@youknown/react-rte/src/extensions/code-block'
import Heading from '@youknown/react-rte/src/extensions/heading'
import Highlight from '@youknown/react-rte/src/extensions/highlight'
import HorizontalRule from '@youknown/react-rte/src/extensions/horizontal-rule'
import Image from '@youknown/react-rte/src/extensions/image'
import Italic from '@youknown/react-rte/src/extensions/italic'
import Link from '@youknown/react-rte/src/extensions/link'
import OrderedList from '@youknown/react-rte/src/extensions/ordered-list'
import Strike from '@youknown/react-rte/src/extensions/strike'
import Table from '@youknown/react-rte/src/extensions/table'
import TextAlign from '@youknown/react-rte/src/extensions/text-align'
import TextColor from '@youknown/react-rte/src/extensions/text-color'
import Underline from '@youknown/react-rte/src/extensions/underline'
import { useRTE } from '@youknown/react-rte/src/hooks/useRTE'
import { Button, Image as ImageUI, Loading, Space, Toast } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbChecklist, TbCloudCheck } from 'react-icons/tb'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

import type { Doc } from '@/apis/doc'
import { get_doc_drafts, get_doc_info, update_doc, update_doc_drafts } from '@/apis/doc'
import Header from '@/app/components/header'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { useRecordStore, useUIStore } from '@/stores'
import { format_time } from '@/utils'
import { upload_cloudflare_r2 } from '@/utils/cloudflare-r2'
import { NetFetchError, with_api } from '@/utils/request'

import CoverUpload from './components/cover-upload'
import DocHistoryDrawer from './components/doc-history-drawer'
import DocOptionsDropdown from './components/doc-options-dropdown'
import DocTitle from './components/doc-title'
import PublicSwitch from './components/public-switch'

export default function Doc() {
  const { t } = useTranslation()
  const navigate = useTransitionNavigate()
  const { space_id } = useParams()
  if (!space_id) {
    throw new Error('Space ID not found.')
  }
  const [search_params] = useSearchParams()
  const doc_id = search_params.get('doc_id') as string
  const recording = useRecordStore(state => state.recording)
  const is_mobile = useUIStore(state => state.is_mobile)

  const [history_drawer_open, { setTrue: show_history_drawer, setFalse: hide_history_drawer }] = useBoolean(false)
  const [saving, set_saving] = useState(false)

  const editor = useRTE({
    extensions: [
      Heading,
      Bold,
      Strike,
      Italic,
      Underline,
      Code,
      Link,
      TextColor,
      Highlight,
      TextAlign,
      Blockquote,
      Table,
      BulletList,
      OrderedList,
      CodeBlock,
      HorizontalRule,
      Image.configure({
        onCustomUpload: file =>
          new Promise((resolve, reject) => {
            ImageUI.crop({
              file,
              fileTypeExcludes: ['image/gif'],
              onCancel: reject,
              async onCrop(result) {
                try {
                  const { compressImage } = await import('@youknown/img-wasm/src')
                  const compressed_file = await compressImage(result, 1600, 1200)
                  const toast = Toast.info({
                    content: t('file.uploading'),
                    duration: Infinity
                  })
                  upload_cloudflare_r2(compressed_file, {
                    progress(progress) {
                      toast.update({
                        duration: Infinity,
                        content: (
                          <>
                            <span className="color-primary">{`(${Math.floor(progress.percent)}%)`}</span>
                            {t('file.uploading')}
                          </>
                        )
                      })
                    },
                    complete(url) {
                      toast.close()
                      resolve({
                        src: url
                      })
                    },
                    error(err) {
                      toast.close()
                      Toast.error(t('upload.img.fail'))
                      reject(err)
                    }
                  })
                } catch (err) {
                  Toast.error(t('upload.img.fail'))
                  reject(err)
                }
              }
            })
          })
      })
    ],
    autofocus: 'end',
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return t('placeholder.title')
      }
      return t('placeholder.more')
    },
    onUpdate({ editor }) {
      debounced_update(editor)
    }
  })

  const update_drafts = async (content: string) => {
    const [err, res] = await with_api(update_doc_drafts)({
      doc_id,
      content
    })
    if (err) {
      return
    }
    if (doc_info?.content === content) {
      return
    }
    set_draft([res])
  }

  const debounced_update = useDebounce(async (editor: Editor) => {
    update_drafts(editor?.getHTML())
  }, 1000)

  const { state: doc_state }: { state: Doc } = useLocation()
  useEffect(() => {
    if (editor && doc_state) {
      editor.commands.setContent(doc_state.content)
    }
  }, [doc_state, editor])

  const doc_ready = !!doc_id && !!editor
  const {
    data: doc_info,
    loading,
    mutate: set_doc_info
  } = useFetch(get_doc_info, {
    initialData: doc_state,
    ready: doc_ready,
    params: [
      {
        doc_id
      }
    ],
    refreshDeps: [doc_id],
    onSuccess(res) {
      editor?.commands.setContent(res.content)
    }
  })
  const { data: [draft] = [], mutate: set_draft } = useFetch(get_doc_drafts, {
    ready: doc_ready,
    params: [
      {
        doc_id,
        page: 1,
        page_size: 1
      }
    ],
    refreshDeps: [doc_id],
    onError(err: NetFetchError) {
      Toast.error(err.cause.msg)
    }
  })
  useEffect(() => {
    if (doc_state) {
      set_doc_info(doc_state)
    }
  }, [doc_state, set_doc_info])

  if (!editor) return null

  if (!doc_id) {
    return null
  }
  const record_update_doc = (new_doc: Doc) => {
    recording({
      action: 'record.update',
      target: '',
      target_id: '',
      obj_type: 'record.doc',
      obj: new_doc.title,
      obj_id: new_doc.doc_id,
      obj_ext: {
        space_id
      }
    })
  }

  const save_doc = async () => {
    set_saving(true)
    const payload = {
      doc_id,
      content: editor.getHTML(),
      summary: editor.getText()
    }
    const [err, res] = await with_api(update_doc)(payload)
    set_saving(false)
    if (err) {
      return
    }
    set_doc_info(res)
    editor.commands.setContent(res.content)
    record_update_doc(res)
    Toast.success(t('update.success'))
    navigate(`/library/${space_id}`)
  }

  const recovery_doc = (doc_content: string) => {
    editor.commands.setContent(doc_content)
    // 应用的内容与最新草稿不相同才更新草稿
    if (doc_content != draft.content) {
      update_drafts(doc_content)
    }
  }

  const doc_tips = (
    <>
      {draft && (
        <div className="text-text-3 text-12px">
          {t('doc.draft_auto_save')} {format_time(draft.creation_time)}
        </div>
      )}
    </>
  )

  const header = (
    <Header heading={t('heading.doc')} bordered="visible">
      {is_mobile || (
        <div className="flex-1 flex items-center ml-24px mr-24px">
          <PublicSwitch doc_id={doc_id} doc_info={doc_info} on_updated={set_doc_info} />
          <DocTitle doc_id={doc_id} doc_info={doc_info} on_updated={set_doc_info} />
        </div>
      )}

      <Space align="center">
        {is_mobile ? (
          <>
            <Button square onClick={show_history_drawer}>
              <TbCloudCheck className="color-primary text-16px" />
            </Button>
            <Button square disabled={editor.isEmpty} loading={saving} primary onClick={save_doc}>
              <TbChecklist className="text-16px" />
            </Button>
          </>
        ) : (
          <>
            {doc_tips}
            <Button onClick={show_history_drawer} prefixIcon={<TbCloudCheck className="color-primary text-16px" />}>
              {t('draft.text')}
            </Button>
            <Button disabled={editor.isEmpty} loading={saving} primary onClick={save_doc}>
              {t('save.text')}
            </Button>
          </>
        )}

        <DocOptionsDropdown editor={editor} doc_id={doc_id} doc_info={doc_info} on_updated={set_doc_info} />
      </Space>
    </Header>
  )

  return (
    <>
      {header}

      <DocHistoryDrawer
        open={history_drawer_open}
        on_close={hide_history_drawer}
        doc_id={doc_id}
        doc_content={doc_info?.content ?? ''}
        on_recovery={recovery_doc}
      />
      <div
        className={cls(
          'z-10 sticky sm:top-56px <sm:top-48px right-0',
          'w-100% flex justify-center sm:p-[12px_32px] <sm:p-[8px_12px] bg-bg-0',
          'after:content-empty after:absolute after:bottom-0 after:left-50% after:translate-x--50% after:w-100% after:h-1px after:bg-divider'
        )}
      >
        <RTEMenuBar editor={editor} />
      </div>

      <Loading
        className="can-print w-720px! max-w-100% pt-24px pb-24px <sm:pl-16px <sm-pr-16px sm:m-[0_auto]"
        spinning={!doc_state && loading}
        size="large"
      >
        {doc_info && <CoverUpload doc_id={doc_id} cover={doc_info.cover} on_updated={set_doc_info} />}
        <RTEContent className="pl-0! pr-0!" editor={editor} floating={!is_mobile} />
      </Loading>
    </>
  )
}
