import { useBoolean } from '@youknown/react-hook/src'
import { ContextMenu, Dialog, Dropdown, Toast } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiEdit3 } from 'react-icons/fi'
import { GoCheck } from 'react-icons/go'
import { LuSettings2 } from 'react-icons/lu'
import { PiTrashSimpleBold } from 'react-icons/pi'
import { RiHistoryFill } from 'react-icons/ri'
import { TbWorld } from 'react-icons/tb'

import type { Doc } from '@/apis/doc'
import { delete_doc } from '@/apis/doc'
import DocOptionsModal from '@/components/doc-options-modal'
import More from '@/components/more'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { is_dark_theme_getter, useModalStore, useUIStore, useUserStore } from '@/stores'
import { format_time } from '@/utils'
import { with_api } from '@/utils/request'

interface DocCardProps {
  choosing: boolean
  selected: boolean
  info: Doc
  on_choose: () => void
  on_deleted: () => void
  on_updated: (doc: Doc) => void
}
export default function DocCard(props: DocCardProps) {
  const { choosing, selected, info, on_choose, on_deleted, on_updated } = props

  const { t } = useTranslation()
  const navigate = useTransitionNavigate()
  const has_login = useUserStore(state => state.has_login)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const [more_open, { setBool: set_more_open }] = useBoolean(false)
  const [doc_options_modal_open, { setTrue: show_doc_options_modal, setFalse: hide_doc_options_modal }] =
    useBoolean(false)
  const [deleting, set_deleting] = useState(false)

  const select_doc = () => {
    if (choosing) {
      on_choose?.()
    } else {
      navigate(
        QS.stringify({
          base: 'editor',
          query: {
            doc_id: info.doc_id
          }
        }),
        {
          state: info
        }
      )
    }
  }
  const edit_doc_options = () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    show_doc_options_modal()
  }

  const remove_doc = async () => {
    if (deleting) return
    set_deleting(true)
    const [err] = await with_api(delete_doc)({ doc_ids: [info.doc_id] })
    set_deleting(false)
    if (err) {
      return
    }
    Toast.success(t('doc.delete.success'))
    on_deleted()
  }

  const handle_delete_doc = () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    Dialog.confirm({
      title: t('heading.delete_doc'),
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

  const [menu_open, set_menu_open] = useState(false)
  const ctx_menu = ContextMenu.useContextMenu(menu_open, set_menu_open)

  const get_dropdown_menu = (is_context_menu = false) => {
    return (
      <Dropdown.Menu
        className="min-w-120px"
        closeAfterItemClick
        closeDropdown={is_context_menu ? ctx_menu.closeContextMenu : undefined}
      >
        <Dropdown.Item prefix={<FiEdit3 className="text-16px" />} onClick={select_doc}>
          {t('edit.text')}
        </Dropdown.Item>
        <Dropdown.Item prefix={<LuSettings2 className="text-16px" />} onClick={edit_doc_options}>
          {t('doc.setting')}
        </Dropdown.Item>
        <Dropdown.Item prefix={<PiTrashSimpleBold className="color-danger text-16px" />} onClick={handle_delete_doc}>
          <span className="color-danger">{t('delete.text')}</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    )
  }

  const footer = (
    <div className="flex items-center justify-between min-h-46px p-12px bg-bg-1 b-t-divider b-t-1 b-t-solid cursor-default">
      <div className="flex items-center color-text-3">
        <RiHistoryFill className="mr-4px text-14px" />
        <span className="text-12px">{format_time(info.update_time)}</span>
      </div>

      {!choosing && (
        <Dropdown trigger="click" content={get_dropdown_menu()} onOpenChange={set_more_open}>
          <More active={more_open} />
        </Dropdown>
      )}
    </div>
  )
  return (
    <>
      <div
        className={cls(
          'relative flex flex-col h-224px b-1 b-solid b-divider rd-radius-l',
          'cursor-pointer overflow-hidden select-none',
          selected
            ? 'b-primary shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]'
            : '[@media(hover:hover)]-hover-b-primary [@media(hover:hover)]-hover-shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]',
          {
            'b-primary shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]': menu_open || more_open
          }
        )}
        onContextMenu={event => {
          if (choosing) return
          ctx_menu.onContextMenu(event)
        }}
      >
        {info.public && (
          <div
            className="absolute top-0 left-12px w-20px h-24px bg-primary text-center"
            style={{ clipPath: 'polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0% 75%)' }}
          >
            <TbWorld className="color-#fff text-16px mt-2px" />
          </div>
        )}
        {choosing && selected && (
          <div
            className={cls(
              'absolute top-8px right-8px flex items-center justify-center w-24px h-24px',
              'rd-full b-4px b-solid b-[rgba(255,255,255,0.8)] bg-primary'
            )}
          >
            <GoCheck className="text-14px color-#fff" />
          </div>
        )}

        <div
          className="flex-1 flex flex-col justify-end bg-cover bg-center"
          style={{ backgroundImage: `url("${info.cover}")` }}
          onClick={select_doc}
        >
          <div
            className={cls('flex items-end min-h-60% max-h-100% p-[0_8px_8px_12px]', {
              'bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.5)]': info.cover
            })}
          >
            <span
              className={cls(
                'font-600 select-none',
                info.cover ? 'color-#fff text-shadow-[0px_0px_4px_#000]' : 'color-text-1'
              )}
            >
              {info.title}
            </span>
          </div>
        </div>

        {footer}
      </div>

      <ContextMenu {...ctx_menu.contextMenuProps}>{get_dropdown_menu(true)}</ContextMenu>

      <DocOptionsModal
        open={doc_options_modal_open}
        hide_modal={hide_doc_options_modal}
        doc_info={info}
        on_updated={on_updated}
      />
    </>
  )
}
