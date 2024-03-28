import { useBoolean, useFetch, useHover, useUnmount } from '@youknown/react-hook/src'
import { Loading, Toast } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { RiWechatFill } from 'react-icons/ri'

import { check_yd_login_status, get_yd_qrcode, login as login_api } from '@/apis/user'
import { LOGIN_TYPE } from '@/consts'
import { useModalStore, useUserStore } from '@/stores'
import { set_local_token } from '@/utils/local'

const POLLING_INTERVAL = 1500
export default function WeChatCard() {
  const { t } = useTranslation()
  const close_login_modal = useModalStore(state => state.close_login_modal)
  const login = useUserStore(state => state.login)
  const has_user_login = useUserStore(state => state.has_login)
  const set_profile = useUserStore(state => state.set_profile)
  const [loading, { setTrue: start_loading, setFalse: stop_loading }] = useBoolean(false)
  const timer = useRef(0)
  const { data: yd_res, run: fetch_qrcode } = useFetch(get_yd_qrcode, {
    async onBefore() {
      start_loading()
    }
  })
  const { qrcode_url, temp_user_id = '' } = yd_res ?? {}
  const { run: check_status } = useFetch(check_yd_login_status, {
    params: [
      {
        temp_user_id
      }
    ],
    ready: !!temp_user_id,
    onSuccess({ has_login }) {
      if (has_login) {
        login_api({
          type: LOGIN_TYPE.WECHAT,
          code: temp_user_id
        }).then(({ token, ...rest }) => {
          set_local_token(token)
          login()
          set_profile({ ...rest })
          close_login_modal()
          Toast.success(t('login.success'))
        })
        return
      }
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        if (!has_user_login) {
          check_status()
        }
      }, POLLING_INTERVAL)
    }
  })

  useUnmount(() => {
    clearTimeout(timer.current)
  })

  const [ele] = useHover(hovering => (
    <div
      className={cls(
        'flex flex-col items-center justify-center rd-radius-m bg-bg-0 b-1 b-solid b-divider',
        'cursor-pointer select-none [@media(hover:hover)]-hover-bg-hover active-bg-active'
      )}
      onClick={fetch_qrcode}
    >
      {hovering ? (
        <Loading spinning={loading}>
          {qrcode_url && (
            <img
              className={cls('w-120px h-120px', {
                'cursor-none': !loading
              })}
              src={qrcode_url}
              onLoad={stop_loading}
              onError={stop_loading}
              alt="WeChat QR code"
            />
          )}
        </Loading>
      ) : (
        <>
          <RiWechatFill className="text-40px color-#55B837" />
          <div className="color-text-2 mt-8px">{t('login.wechat')}</div>
        </>
      )}
    </div>
  ))
  return ele
}
