import { useHover } from '@youknown/react-hook/src'
import { Avatar, Button, Toast } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Profile } from '@/apis/user'
import { unfollow_user } from '@/apis/user'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { with_api } from '@/utils/request'

interface UserCardProps {
  className?: string
  user_info: Profile
  on_removed?: () => void
}
export default function UserCard(props: UserCardProps) {
  const { className, user_info, on_removed } = props
  const { t } = useTranslation()
  const navigate = useTransitionNavigate()
  const [unfollow_loading, set_unfollow_loading] = useState(false)

  const handle_unfollow_user = async () => {
    const target_user_id = user_info?.user_id
    if (!target_user_id) {
      return
    }
    set_unfollow_loading(true)
    const [err] = await with_api(unfollow_user)({
      user_id: target_user_id
    })
    set_unfollow_loading(false)
    if (err) {
      return
    }
    Toast.success(t('follow.cancel.success'))
    on_removed?.()
  }

  const go_user_center = () => {
    navigate(
      QS.stringify({
        base: '/user-center',
        query: {
          target_user_id: user_info.user_id
        }
      })
    )
  }

  const [follow_btn] = useHover(hovering =>
    hovering ? (
      <Button
        className="min-w-80px"
        round
        danger
        loading={unfollow_loading}
        onClick={e => {
          e.stopPropagation()
          handle_unfollow_user()
        }}
      >
        <span className="text-12px">{t('follow.cancel.text')}</span>
      </Button>
    ) : (
      <Button className="min-w-80px" round>
        <span className="text-12px">{t('follow.ok.text')}</span>
      </Button>
    )
  )
  return (
    <div
      className={cls(
        'relative w-144px',
        'bg-bg-1 b-solid b-1 b-divider rd-radius-m cursor-pointer select-none overflow-hidden',
        '[@media(hover:hover)]-hover-b-primary [@media(hover:hover)]-hover-shadow-[var(--ui-shadow-m),0_0_0_1px_var(--ui-color-primary)]',
        className
      )}
      onClick={go_user_center}
    >
      <div className="relative flex flex-col items-center p-[16px_8px]">
        <Avatar className="b-1 b-solid b-divider mb-4px" size="large" round src={user_info.avatar} />
        <div className="color-text-1 font-600 truncate mb-12px">{user_info.nickname}</div>
        {follow_btn}
      </div>
    </div>
  )
}
