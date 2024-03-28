import { useHover } from '@youknown/react-hook/src'
import { Button, Toast } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { GrGithub } from 'react-icons/gr'

import { useModalStore, useUserStore } from '@/stores'
import { go_github_login } from '@/utils'

export default function GithubCard() {
  const { t } = useTranslation()
  const close_login_modal = useModalStore(state => state.close_login_modal)
  const login = useUserStore(state => state.login)
  const fetch_profile = useUserStore(state => state.fetch_profile)

  const handle_github_login = () => {
    go_github_login()
      .then(() => {
        login()
        fetch_profile()
        close_login_modal()
        Toast.success(t('login.success'))
      })
      .catch(() => {
        Toast.error(t('login.fail'))
      })
  }

  const [ele] = useHover(hovering => (
    <div
      className={cls(
        'flex flex-col items-center justify-center rd-radius-m bg-bg-0 b-1 b-solid b-divider',
        'cursor-pointer select-none',
        '[@media(hover:hover)]-hover-bg-hover active-bg-active'
      )}
      onClick={handle_github_login}
    >
      {hovering ? (
        <Button primary>{t('login.auth')}</Button>
      ) : (
        <>
          <GrGithub className="text-40px" />
          <div className="color-text-2 mt-8px">{t('login.github')}</div>
        </>
      )}
    </div>
  ))
  return ele
}
