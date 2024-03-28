import { List } from '@youknown/react-ui/src'
import { useTranslation } from 'react-i18next'
import { LuSettings2 } from 'react-icons/lu'
import { TbChevronRight, TbLogin, TbLogout } from 'react-icons/tb'

import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { useModalStore, useUserStore } from '@/stores'

export default function MyOptions() {
  const { t } = useTranslation()
  const has_login = useUserStore(state => state.has_login)
  const do_logout = useUserStore(state => state.do_logout)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const open_preferences_modal = useModalStore(state => state.open_preferences_modal)
  const navigate = useTransitionNavigate()

  return (
    <List className="overflow-hidden bg-bg-0!" bordered={false}>
      <List.Item
        className="active-bg-active"
        bordered
        prefix={<LuSettings2 className="text-16px" />}
        suffix={<TbChevronRight className="color-text-2" />}
        onClick={open_preferences_modal}
      >
        {t('setting.text')}
      </List.Item>

      {has_login ? (
        <List.Item
          className="active-bg-active"
          bordered
          prefix={<TbLogout className="text-16px color-danger" />}
          suffix={<TbChevronRight className="color-text-2" />}
          onClick={() => {
            do_logout()
            navigate('/')
          }}
        >
          <span className="color-danger">{t('login.exit')}</span>
        </List.Item>
      ) : (
        <List.Item
          className="active-bg-active"
          bordered
          prefix={<TbLogin className="text-16px color-primary" />}
          suffix={<TbChevronRight className="color-text-2" />}
          onClick={open_login_modal}
        >
          <span className="color-primary">{t('login.go')}</span>
        </List.Item>
      )}
    </List>
  )
}
