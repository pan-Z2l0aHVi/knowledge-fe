import { Avatar, Divider, Dropdown, Motion, Tooltip } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { LuSettings2 } from 'react-icons/lu'
import { TbLogin, TbLogout, TbUser } from 'react-icons/tb'

import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { useModalStore, useUserStore } from '@/stores'

interface MyProps {
  expand: boolean
}

export default function My({ expand }: MyProps) {
  const { t } = useTranslation()
  const has_login = useUserStore(state => state.has_login)
  const profile = useUserStore(state => state.profile)
  const do_logout = useUserStore(state => state.do_logout)
  const open_preferences_modal = useModalStore(state => state.open_preferences_modal)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const navigate = useTransitionNavigate()
  const go_my_user_center = () => {
    navigate('/user-center')
  }

  return (
    <>
      <Tooltip
        title={has_login ? profile?.nickname : t('login.immediately')}
        placement="right"
        spacing={20}
        disabled={expand}
      >
        <Dropdown
          placement="top-start"
          trigger="click"
          content={
            <Dropdown.Menu className="min-w-208px" closeAfterItemClick>
              <Dropdown.Item prefix={<LuSettings2 className="text-16px" />} onClick={open_preferences_modal}>
                {t('setting.text')}
              </Dropdown.Item>
              {has_login && (
                <Dropdown.Item prefix={<TbUser className="text-16px" />} onClick={go_my_user_center}>
                  {t('page.title.personal')}
                </Dropdown.Item>
              )}
              <Divider size="small" />
              {has_login ? (
                <Dropdown.Item
                  prefix={<TbLogout className="text-16px color-danger" />}
                  onClick={() => {
                    do_logout()
                    navigate('/')
                  }}
                >
                  <span className="color-danger">{t('login.exit')}</span>
                </Dropdown.Item>
              ) : (
                <Dropdown.Item prefix={<TbLogin className="text-16px color-primary" />} onClick={open_login_modal}>
                  <span className="color-primary">{t('login.go')}</span>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          }
        >
          <button
            className={cls(
              'border-0 bg-transparent w-100% h-44px flex items-center p-4px rd-radius-m cursor-pointer select-none custom-focus-outline',
              'active-bg-secondary-active [@media(hover:hover)]-hover-not-active-bg-secondary-hover'
            )}
          >
            {has_login ? (
              <Avatar round size={36} src={profile?.avatar} />
            ) : (
              <div className="flex justify-center items-center w-36px min-w-36px h-36px rd-full bg-primary color-#fff text-13px font-500">
                {t('login.shortcut')}
              </div>
            )}
            <Motion.Fade in={expand} mountOnEnter unmountOnExit>
              <div className="flex-1 break-all ws-nowrap ml-8px">
                {has_login ? profile?.nickname : t('login.immediately')}
              </div>
            </Motion.Fade>
          </button>
        </Dropdown>
      </Tooltip>
    </>
  )
}
