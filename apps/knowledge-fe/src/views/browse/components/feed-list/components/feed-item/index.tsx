import { Avatar, Button, Image, Tooltip } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa6'
import { FiArrowRightCircle } from 'react-icons/fi'

import type { Feed } from '@/apis/feed'
import TransitionLink from '@/components/transition-link'
import { useFeedLike } from '@/hooks/use-feed-like'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { format_time } from '@/utils'

interface FeedItemProps {
  feed: Feed
}
export default function FeedItem(props: FeedItemProps) {
  const { feed } = props
  const { id, subject } = feed
  const { title, cover, summary } = subject
  const { t } = useTranslation()
  const navigate = useTransitionNavigate()
  const { like_count, toggle_like, liked } = useFeedLike(feed)

  const doc_detail_url = useMemo(
    () =>
      QS.stringify({
        base: '/browse/feed-detail',
        query: {
          feed_id: id
        }
      }),
    [id]
  )

  const go_user_center = () => {
    navigate(
      QS.stringify({
        base: '/user-center',
        query: {
          target_user_id: feed.creator_id
        }
      })
    )
  }

  return (
    <div key={feed.id} className="b-b-divider b-b b-b-solid mb-32px">
      <div className="flex items-center mb-16px">
        <Avatar className=" cursor-pointer" size="small" round src={feed.creator.avatar} onClick={go_user_center} />

        <div className="flex items-center">
          <div
            className={cls(
              'ml-12px color-text-2 max-w-160px',
              'truncate rd-radius-s cursor-pointer [@media(hover:hover)]-hover-bg-hover'
            )}
            onClick={go_user_center}
          >
            {feed.creator.nickname}
          </div>
          <div className="ml-8px color-text-3 text-12px">{format_time(feed.subject.update_time)}</div>
        </div>
      </div>

      <div className="flex-1 flex pl-36px mb-8px">
        <div className="flex-1 w-0">
          <TransitionLink to={doc_detail_url} state={feed} className="group block w-[fit-content] mb-12px">
            <div
              className={cls(
                'inline text-16px font-600 cursor-pointer',
                'transition-property-[background-size] transition-duration-300ms ease-out',
                'bg-gradient-to-tr from-primary to-primary bg-no-repeat bg-right-bottom bg-[length:0%_2px]',
                '[@media(hover:hover)]-group-hover-bg-left-bottom [@media(hover:hover)]-group-hover-bg-[length:100%_2px]'
              )}
            >
              {title}
            </div>
          </TransitionLink>

          <TransitionLink to={doc_detail_url} state={feed}>
            <div className="sm:line-clamp-3 <sm:line-clamp-2 color-text-2 [@media(hover:hover)]-hover-color-text-3 transition-colors">
              {summary}
            </div>
          </TransitionLink>
        </div>

        {cover && (
          <TransitionLink className="sm:ml-48px <sm:ml-8px" to={doc_detail_url} state={feed}>
            <Image
              className={cls('b-divider b-1 b-solid rd-radius-m', 'sm:w-160px sm:h-108px <sm:w-80px <sm:h-60px ')}
              src={cover}
              loading="lazy"
              alt="Cover"
            />
          </TransitionLink>
        )}
      </div>

      <div className="flex items-center pl-28px mb-16px">
        <Tooltip title={liked ? t('like.ok') : t('like.text')} placement="bottom">
          <Button text circle onClick={toggle_like}>
            {liked ? (
              <FaThumbsUp className="text-16px color-primary" />
            ) : (
              <FaRegThumbsUp className="text-16px color-primary" />
            )}
          </Button>
        </Tooltip>
        <span className={cls('min-w-24px', liked ? 'color-primary' : 'color-text-3')}>{like_count}</span>
        <TransitionLink to={doc_detail_url} state={feed}>
          <Button className="color-text-3!" text round prefixIcon={<FiArrowRightCircle className="text-16px" />}>
            {t('view.full_text')}
          </Button>
        </TransitionLink>
      </div>
    </div>
  )
}
