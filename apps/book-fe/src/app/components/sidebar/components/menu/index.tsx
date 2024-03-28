import { Motion, Tooltip } from '@youknown/react-ui/src'
import type { DeepRequired } from '@youknown/utils/src'
import { cls, pick, storage } from '@youknown/utils/src'
import { Fragment, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'

import TransitionNavLink from '@/components/transition-nav-link'
import { RouteItem, routes } from '@/router/routes'
import { is_dark_theme_getter, useUIStore } from '@/stores'

const OPEN_MAP_KEY = 'sub-menu-open-map'

type MenuRouteItem = Omit<RouteItem, 'children'> & {
  meta: DeepRequired<RouteItem>['meta']
  children: MenuRouteItem[]
}
interface MenuProps {
  expand: boolean
}
export default function Menu({ expand }: MenuProps) {
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const set_menu_drawer_open = useUIStore(state => state.set_menu_drawer_open)
  const is_mobile = useUIStore(state => state.is_mobile)
  const close_sidebar = () => {
    if (is_mobile) {
      set_menu_drawer_open(false)
    }
  }

  const get_nav = (path: string) => {
    const route = routes.find(route => route.path === path)!
    return pick(route, 'path', 'meta')
  }
  const get_has_children_nav = useCallback((path: string) => {
    const route = routes.find(route => route.path === path)!
    return {
      ...pick(route, 'path', 'meta'),
      children: route.children?.length ? route.children.filter(child => !['*', '/', ''].includes(child.path)) : []
    }
  }, [])

  const nav_list = useMemo(
    () =>
      [
        get_nav('home'),
        get_nav('rich_text_editor'),
        get_has_children_nav('ui_components'),
        get_has_children_nav('hooks')
      ] as MenuRouteItem[],
    [get_has_children_nav]
  )

  const [open_map, set_open_map] = useState<Record<string, boolean>>(
    () => storage.local.get<Record<string, boolean>>(OPEN_MAP_KEY) ?? {}
  )
  useEffect(() => {
    storage.local.set(OPEN_MAP_KEY, open_map)
  }, [open_map])

  const set_open = (name: string, open: boolean) => {
    set_open_map(p => ({
      ...p,
      [name]: open
    }))
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden select-none p-12px">
      {nav_list.map(menu_item => {
        const { path, meta } = menu_item
        const { children = [] } = menu_item
        const has_sub_nav = children.length > 0

        const toggle_sub_menu = (e: MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          set_open(path, !open_map[path])
        }
        const chevron_down_icon = (
          <BiChevronDown
            className={cls('text-16px color-text-2 transition-all', open_map[path] ? 'rotate--90' : 'rotate-0')}
          />
        )
        const nav_content = (
          <>
            <div className="leading-0 text-18px color-primary">{meta.icon}</div>
            <Motion.Fade in={expand} mountOnEnter unmountOnExit>
              <div className="ml-8px flex-1 break-all ws-nowrap truncate">{meta.title()}</div>
            </Motion.Fade>
            {has_sub_nav && (
              <>
                {expand ? (
                  <div
                    className={cls(
                      'rd-radius-s w-22px h-22px flex items-center justify-center text-12px bg-inherit',
                      is_dark_theme
                        ? 'active-brightness-120 [@media(hover:hover)]-hover-brightness-110'
                        : 'active-brightness-90 [@media(hover:hover)]-hover-brightness-95'
                    )}
                    onClick={toggle_sub_menu}
                  >
                    {chevron_down_icon}
                  </div>
                ) : (
                  <div
                    className={cls(
                      'flex items-center text-12px bg-inherit h-100% rd-tr-radius-m rd-br-radius-m',
                      is_dark_theme
                        ? 'active-brightness-120 [@media(hover:hover)]-hover-brightness-110'
                        : 'active-brightness-90 [@media(hover:hover)]-hover-brightness-95'
                    )}
                    onClick={toggle_sub_menu}
                  >
                    {chevron_down_icon}
                  </div>
                )}
              </>
            )}
          </>
        )

        return (
          <Fragment key={path}>
            <Tooltip title={meta.title()} placement="right" spacing={20} disabled={expand}>
              <TransitionNavLink
                to={`/${path}`}
                end={open_map[path]}
                className={({ isActive }) =>
                  cls(
                    'w-100% h-28px flex items-center pl-12px pr-4px rd-radius-m mb-8px decoration-none color-inherit',
                    'active-bg-secondary-active [@media(hover:hover)]-hover-not-active-bg-secondary-hover',
                    {
                      'bg-secondary-hover': isActive
                    }
                  )
                }
                onClick={() => {
                  if (has_sub_nav) {
                    set_open(path, true)
                  } else {
                    close_sidebar()
                  }
                }}
              >
                {nav_content}
              </TransitionNavLink>
            </Tooltip>

            {has_sub_nav && (
              <Motion.Collapse in={open_map[path]} className="w-100% mt-0! mb-0!" mountOnEnter unmountOnExit>
                <Motion.Fade in={open_map[path]}>
                  <div
                    className={cls({
                      'ml-28px': expand
                    })}
                  >
                    {children.map(child => {
                      return (
                        <Tooltip
                          key={child.path}
                          title={child.meta.title()}
                          placement="right"
                          spacing={20}
                          disabled={expand}
                        >
                          <TransitionNavLink
                            to={`/${path}/${child.path}`}
                            className={({ isActive }) =>
                              cls(
                                'w-100% h-28px flex items-center pl-12px pr-4px rd-radius-m mb-8px decoration-none color-inherit',
                                'active-bg-secondary-active [@media(hover:hover)]-hover-not-active-bg-secondary-hover',
                                {
                                  'bg-secondary-hover': isActive
                                }
                              )
                            }
                            onClick={close_sidebar}
                          >
                            <div className="leading-0 text-18px color-primary">{child.meta.icon}</div>
                            <Motion.Fade in={expand} mountOnEnter unmountOnExit>
                              <div className="flex-1 break-all ws-nowrap truncate ml-8px">{child.meta.title()}</div>
                            </Motion.Fade>
                          </TransitionNavLink>
                        </Tooltip>
                      )
                    })}
                  </div>
                </Motion.Fade>
              </Motion.Collapse>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
