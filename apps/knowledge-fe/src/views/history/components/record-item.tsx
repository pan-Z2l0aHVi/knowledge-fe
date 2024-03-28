import { ContextMenu, Dropdown } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiHistoryFill } from 'react-icons/ri'

import More from '@/components/more'
import TransitionLink from '@/components/transition-link'
import { useRecordStore } from '@/stores'
import { format_time } from '@/utils'
import { RecordValue } from '@/utils/idb'

interface RecordItemProps {
  record: RecordValue
}
export default function RecordItem(props: RecordItemProps) {
  const { record } = props

  const { t } = useTranslation()
  const delete_record = useRecordStore(state => state.delete_record)
  const [more_open, set_more_open] = useState(false)
  const timing_desc = format_time(record.creation_time.getTime())
  const target_user_center_url = QS.stringify({
    base: '/user-center',
    query: {
      target_user_id: record.target_id
    }
  })

  let obj_url = ''
  if ('record.doc' === record.obj_type) {
    const { space_id } = record.obj_ext ?? {}
    obj_url = QS.stringify({
      base: `/library/${space_id}/editor`,
      query: {
        doc_id: record.obj_id
      }
    })
  } else if ('record.public_doc' === record.obj_type) {
    obj_url = QS.stringify({
      base: '/user-center',
      query: {
        target_user_id: record.obj_id
      }
    })
  } else if ('record.user' === record.obj_type) {
    obj_url = QS.stringify({
      base: '/user-center',
      query: {
        target_user_id: record.obj_id
      }
    })
  } else if ('record.wallpaper' === record.obj_type) {
    obj_url = QS.stringify({
      base: '/wallpapers',
      query: {
        keywords: `id:${record.obj_id}`
      }
    })
  }

  const [menu_open, set_menu_open] = useState(false)
  const ctx_menu = ContextMenu.useContextMenu(menu_open, set_menu_open)

  const get_dropdown_menu = (is_context_menu = false) => {
    return (
      <Dropdown.Menu closeAfterItemClick closeDropdown={is_context_menu ? ctx_menu.closeContextMenu : undefined}>
        <Dropdown.Item
          onClick={() => {
            delete_record(record.id)
          }}
        >
          {t('delete.from_history')}
        </Dropdown.Item>
      </Dropdown.Menu>
    )
  }

  return (
    <>
      <div
        key={record.id}
        className={cls(
          'group flex [@media(hover:hover)]-hover-bg-hover sm:rd-radius-l p-[0_16px]',
          'sm:max-w-960px sm:min-w-800px',
          {
            'bg-hover': menu_open || more_open
          }
        )}
        onContextMenu={ctx_menu.onContextMenu}
      >
        <div className="flex items-center justify-end sm:w-160px <sm:w-120px text-12px color-text-3 [@media(hover:hover)]-group-hover-text-text-2">
          <RiHistoryFill className="mr-4px text-14px" />
          {timing_desc}
        </div>
        <div className="group relative flex-1 flex items-center sm:pl-32px sm:ml-32px <sm:pl-16px <sm:ml-16px min-h-80px b-l-2 b-l-solid b-l-divider">
          <div
            className={cls('absolute left--8px w-14px h-14px bg-primary rd-full b-4 b-solid b-[rgba(255,255,255,0.8)]')}
          ></div>
          <div className="flex-1 flex flex-wrap items-center text-text-2 whitespace-nowrap [@media(hover:hover)]-group-hover-text-text-1 transition-colors">
            你<span className="color-orange">{t(record.action)}</span>了
            {record.target && (
              <>
                <TransitionLink
                  className="inline-block sm:max-w-200px <sm:max-w-80px truncate color-purple! [@media(hover:hover)]-hover-underline!"
                  to={target_user_center_url}
                >
                  {record.target}
                </TransitionLink>
                的
              </>
            )}
            {record.obj && (
              <>
                {t(record.obj_type)}
                <TransitionLink
                  className="inline-block sm:max-w-200px <sm:max-w-80px truncate color-blue! [@media(hover:hover)]-hover-underline!"
                  to={obj_url}
                >
                  {record.obj}
                </TransitionLink>
              </>
            )}
            。
          </div>
          <Dropdown trigger="click" placement="bottom-end" content={get_dropdown_menu()} onOpenChange={set_more_open}>
            <More className="ml-24px" active={more_open} />
          </Dropdown>
        </div>
      </div>

      <ContextMenu {...ctx_menu.contextMenuProps}>{get_dropdown_menu(true)}</ContextMenu>
    </>
  )
}
