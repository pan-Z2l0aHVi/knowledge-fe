import { ContextMenu, Dialog, Dropdown, Toast } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiBookmarkAlt } from 'react-icons/bi'
import { FcFolder } from 'react-icons/fc'
import { LuSettings2 } from 'react-icons/lu'
import { PiTrashSimpleBold } from 'react-icons/pi'

import type { DocSpace } from '@/apis/space'
import More from '@/components/more'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { is_dark_theme_getter, useSpaceStore, useUIStore } from '@/stores'
import { with_api } from '@/utils/request'

interface SpaceCardProps {
  info: DocSpace
  on_edit: () => void
}
export default function SpaceCard(props: SpaceCardProps) {
  const { info, on_edit } = props
  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const delete_spaces = useSpaceStore(state => state.delete_spaces)
  const navigate = useTransitionNavigate()
  const [more_open, set_more_open] = useState(false)
  const [deleting, set_deleting] = useState(false)

  const go_space_docs = () => {
    navigate(`${info.space_id}`)
  }
  const handle_show_desc = () => {
    Dialog.confirm({
      content: info.desc,
      footer: null,
      header: null,
      closeIcon: null,
      overlayClassName: cls('backdrop-blur-xl', is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]')
    })
  }

  const remove_spaces = async () => {
    if (deleting) return
    set_deleting(true)
    const [err] = await with_api(delete_spaces)(info.space_id)
    set_deleting(false)
    if (err) {
      return
    }
    Toast.success(t('delete.success'))
  }

  const show_delete_dialog = () => {
    Dialog.confirm({
      title: t('heading.delete_space', { name: info.name }),
      content: t('space.if_delete'),
      overlayClassName: cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      ),
      okDanger: true,
      okText: t('delete.text'),
      cancelText: t('cancel.text'),
      okLoading: deleting,
      onOk: remove_spaces
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
        onClick={e => e.stopPropagation()}
      >
        <Dropdown.Item prefix={<BiBookmarkAlt className="text-16px" />} onClick={handle_show_desc}>
          {t('view.introduction')}
        </Dropdown.Item>
        <Dropdown.Item prefix={<LuSettings2 className="text-16px" />} onClick={on_edit}>
          {t('space.manage')}
        </Dropdown.Item>
        <Dropdown.Item prefix={<PiTrashSimpleBold className="color-danger text-16px" />} onClick={show_delete_dialog}>
          <span className="color-danger">{t('delete.text')}</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    )
  }

  return (
    <>
      <div
        className={cls(
          'flex items-center p-16px b-solid b-1 b-divider rd-radius-m bg-bg-1 cursor-pointer',
          '[@media(hover:hover)]-hover-b-primary [@media(hover:hover)]-hover-shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]',
          {
            'b-primary shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]': menu_open || more_open
          }
        )}
        onClick={go_space_docs}
        onContextMenu={ctx_menu.onContextMenu}
      >
        <FcFolder className="text-36px" />
        <div className="flex-1 w-0 ml-16px mr-16px">
          <div className="line-clamp-1">{info.name}</div>
        </div>
        <Dropdown trigger="click" placement="bottom-start" content={get_dropdown_menu()} onOpenChange={set_more_open}>
          <More active={more_open} onClick={e => e.stopPropagation()} />
        </Dropdown>
      </div>
      <ContextMenu {...ctx_menu.contextMenuProps}>{get_dropdown_menu(true)}</ContextMenu>
    </>
  )
}
