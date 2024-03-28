import { Avatar } from '@youknown/react-ui/src'
import { QS } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'

import type { Feed } from '@/apis/feed'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { format_time } from '@/utils'

interface DescAreaProps {
  feed: Feed
}
export default function DescArea(props: DescAreaProps) {
  const { feed } = props

  const { t } = useTranslation()
  const navigate = useTransitionNavigate()

  const go_user_center = () => {
    navigate(
      QS.stringify({
        base: '/user-center',
        query: {
          target_user_id: feed.subject.author_id
        }
      })
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-center whitespace-pre-wrap color-text-3 mt-32px mb-32px">
      <span>{t('author')}</span>
      <Avatar className="mr-4px" size={20} round src={feed.subject.author.avatar} onClick={go_user_center} />
      <span className="max-w-120px truncate mr-24px color-text-2 cursor-pointer" onClick={go_user_center}>
        {feed.creator.nickname}
      </span>
      <span>{t('created_in')}</span>
      <span className="color-text-2 mr-24px">{format_time(feed.subject.creation_time)}</span>
      <span>{t('last_update_at')}</span>
      <span className="color-text-2">{format_time(feed.subject.update_time)}</span>
    </div>
  )
}
