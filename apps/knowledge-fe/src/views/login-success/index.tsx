import { Loading } from '@youknown/react-ui/src'
import { storage } from '@youknown/utils/src'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { login } from '@/apis/user'
import { LOGIN_TYPE } from '@/consts'
import { send_to_opener_window_cancel, send_to_opener_window_ok } from '@/utils/correspond'
import { set_local_token } from '@/utils/local'

export default function LoginSuccess() {
  const { t } = useTranslation()
  const [search_params, set_search_params] = useSearchParams()

  useEffect(() => {
    const beforeunload_handler = () => {
      send_to_opener_window_cancel()
    }
    window.addEventListener('beforeunload', beforeunload_handler)
    return () => {
      window.removeEventListener('beforeunload', beforeunload_handler)
    }
  }, [])

  useEffect(() => {
    const state = search_params.get('state')
    if (state) {
      set_search_params(pre => {
        pre.delete('state')
        return pre
      })
      if (state !== storage.session.get('state')) {
        send_to_opener_window_cancel()
        return
      }
    }
    const code = search_params.get('code')
    if (code) {
      set_search_params(pre => {
        pre.delete('code')
        return pre
      })
      login({ type: LOGIN_TYPE.GITHUB, code })
        .then(({ token }) => {
          set_local_token(token)
          send_to_opener_window_ok(token)
        })
        .catch(() => {
          send_to_opener_window_cancel()
        })
        .finally(() => {
          window.close()
        })
    }
  }, [search_params, set_search_params])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Loading spinning size="large" />
      <h2 className="mt-24px">{t('login.ing')}</h2>
    </div>
  )
}
