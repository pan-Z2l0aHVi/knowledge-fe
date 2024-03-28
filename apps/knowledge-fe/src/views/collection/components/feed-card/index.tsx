import { ContextMenu, Dropdown, Image } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LuHeartOff } from 'react-icons/lu'
import { RiHistoryFill } from 'react-icons/ri'
import { TbUser } from 'react-icons/tb'

import type { Feed } from '@/apis/feed'
import { cancel_collect_feed } from '@/apis/user'
import More from '@/components/more'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { format_time } from '@/utils'
import { with_api } from '@/utils/request'

interface FeedCardProps {
  className?: string
  feed: Feed
  on_removed?: () => void
}
export default function FeedCard(props: FeedCardProps) {
  const { className, feed, on_removed } = props
  const { t } = useTranslation()
  const navigate = useTransitionNavigate()
  const [more_open, set_more_open] = useState(false)
  const go_feed_detail = () => {
    navigate(
      QS.stringify({
        base: '/browse/feed-detail',
        query: { feed_id: feed.id }
      }),
      { state: feed }
    )
  }

  const handle_cancel_collect_feed = async () => {
    const [err] = await with_api(cancel_collect_feed)({
      feed_id: feed.id
    })
    if (err) {
      return
    }
    on_removed?.()
  }

  const [menu_open, set_menu_open] = useState(false)
  const ctx_menu = ContextMenu.useContextMenu(menu_open, set_menu_open)

  const get_dropdown_menu = (is_context_menu = false) => {
    return (
      <Dropdown.Menu
        className="min-w-120px"
        closeAfterItemClick
        closeDropdown={is_context_menu ? ctx_menu.closeContextMenu : undefined}
        onClick={e => {
          e.stopPropagation()
          handle_cancel_collect_feed()
        }}
      >
        <Dropdown.Item prefix={<LuHeartOff className="color-danger text-16px" />}>
          <span className="color-danger">{t('collect.cancel.text')}</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    )
  }

  const more = (
    <Dropdown trigger="click" placement="bottom-start" content={get_dropdown_menu()} onOpenChange={set_more_open}>
      <More className="" active={more_open} onClick={e => e.stopPropagation()} />
    </Dropdown>
  )

  return (
    <>
      <div
        className={cls(
          className,
          'relative flex items-start sm:w-424px <sm:w-100% h-120px bg-bg-1 b-solid b-1 b-divider rd-radius-m cursor-pointer overflow-hidden',
          '[@media(hover:hover)]-hover-b-primary [@media(hover:hover)]-hover-shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]',
          {
            'b-primary shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]': menu_open || more_open
          }
        )}
        onClick={go_feed_detail}
        onContextMenu={ctx_menu.onContextMenu}
      >
        <Image className="w-160px h-100%" loading="lazy" src={feed.subject.cover} alt="Cover" />
        <div className="flex-1 flex flex-col justify-between w-0 h-100% p-[16px]">
          <div>
            <div className="flex items-center">
              <div className="flex-1 line-clamp-1 text-16px font-700">{feed.subject.title}</div>
              {more}
            </div>
            <div className="truncate color-text-2 mt-4px">{feed.subject.summary}</div>
          </div>
          <div className="p-[4px_8px] line-clamp-1 text-12px color-text-3 whitespace-nowrap bg-bg-2 rd-radius-m">
            <div className="flex items-center w-max max-w-100%">
              <TbUser className="mr-2px" />
              <div className="flex-1 truncate">{feed.creator.nickname}</div>
              <RiHistoryFill className="ml-8px mr-2px" />
              {format_time(feed.update_time)}
            </div>
          </div>
        </div>
      </div>

      <ContextMenu {...ctx_menu.contextMenuProps}>{get_dropdown_menu(true)}</ContextMenu>
    </>
  )
}
