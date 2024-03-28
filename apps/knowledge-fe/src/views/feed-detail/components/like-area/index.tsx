import { useBoolean, useHover } from '@youknown/react-hook/src'
import { Avatar, Button, Dialog, Tooltip } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa6'
import { TbDots } from 'react-icons/tb'

import type { Feed } from '@/apis/feed'
import { useFeedLike } from '@/hooks/use-feed-like'
import { is_dark_theme_getter, useUIStore } from '@/stores'

interface LikeAreaProps {
  feed: Feed
}
export default function LikeArea(props: LikeAreaProps) {
  const { feed } = props

  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const is_mobile = useUIStore(state => state.is_mobile)
  const { like_list, like_count, toggle_like, liked } = useFeedLike(feed)
  const [open, { setTrue: show, setFalse: hide }] = useBoolean(false)

  const like_list_modal = (
    <Dialog
      open={open}
      onCancel={hide}
      header={null}
      footer={null}
      closeIcon={null}
      overlayClassName={cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      )}
    >
      <div className="flex flex-wrap p-16px select-none">
        {like_list.map(user => (
          <Tooltip key={user.user_id} trigger={is_mobile ? 'click' : 'hover'} placement="bottom" title={user.nickname}>
            <Avatar className="m-4px" round src={user.avatar} />
          </Tooltip>
        ))}
      </div>
    </Dialog>
  )

  const [like_action_btn] = useHover(hovered => {
    const icon_cls = hovered ? 'text-20px' : 'text-20px color-primary'
    return (
      <Button className="b-primary! b-2!" size="large" circle primary={hovered} onClick={toggle_like}>
        {liked ? <FaThumbsUp className={icon_cls} /> : <FaRegThumbsUp className={icon_cls} />}
      </Button>
    )
  })

  return (
    <>
      <div className="flex flex-col items-center w-max p-8px m-[0_auto] select-none">
        {like_action_btn}
        <div className="color-text-3 mt-8px">{`${like_count} ${t('like.people_num')}`}</div>
      </div>

      {like_list.length > 0 && (
        <>
          <div className="flex items-center w-max m-[0_auto] mt-16px">
            <Avatar.Group size={36}>
              {like_list.slice(0, 10).map(user => (
                <Tooltip key={user.user_id} trigger={is_mobile ? 'click' : 'hover'} title={user.nickname}>
                  <Avatar round src={user.avatar} />
                </Tooltip>
              ))}
            </Avatar.Group>
            <Button className="p-0! ml-4px" circle onClick={show}>
              <TbDots className="text-16px" />
            </Button>
          </div>
          {like_list_modal}
        </>
      )}
    </>
  )
}
