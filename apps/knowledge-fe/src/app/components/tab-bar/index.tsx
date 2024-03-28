import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbBook2, TbInnerShadowBottom, TbSmartHome, TbVersions } from 'react-icons/tb'
import { useMatches } from 'react-router-dom'

import TransitionNavLink from '@/components/transition-nav-link'
import { is_dark_theme_getter, useUIStore } from '@/stores'

export default function TabBar() {
  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const matches = useMatches()

  const tab_list = [
    {
      Icon: TbSmartHome,
      title: t('tab.browse'),
      path: '/browse'
    },
    {
      Icon: TbBook2,
      title: t('tab.library'),
      path: '/library'
    },
    {
      Icon: TbVersions,
      title: t('tab.wallpaper'),
      path: '/wallpapers'
    },
    {
      Icon: TbInnerShadowBottom,
      title: t('tab.mine'),
      path: '/user-center'
    }
  ]
  return (
    <>
      <div className="h-48px"></div>
      <div
        className={cls(
          'z-20 fixed bottom-0 w-100% h-48px flex items-center justify-around',
          is_dark_theme ? 'bg-[rgba(40,40,40,0.7)]' : '!bg-[rgba(240,240,240,0.7)]',
          'backdrop-blur-lg'
        )}
      >
        {tab_list.map(tab => {
          const is_active = matches.some(match => match.pathname === tab.path)
          return (
            <TransitionNavLink
              key={tab.path}
              to={tab.path}
              className={cls('flex flex-col items-center decoration-none select-none')}
            >
              <tab.Icon
                className={cls(
                  is_active ? 'box-content bg-primary rd-full p-4px text-20px mt--8px' : 'text-20px',
                  is_dark_theme ? (is_active ? 'color-#fff' : 'color-#fff') : is_active ? 'color-#fff' : 'color-#414647'
                )}
              />
              <div
                className={cls(
                  'min-w-80px text-center text-12px scale-80',
                  is_dark_theme
                    ? is_active
                      ? 'color-#fff'
                      : 'color-#ccc'
                    : is_active
                      ? 'color-#1f2329'
                      : 'color-#414647'
                )}
              >
                {tab.title}
              </div>
            </TransitionNavLink>
          )
        })}
      </div>
    </>
  )
}
