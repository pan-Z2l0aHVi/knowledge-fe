import type { ReactNode } from 'react'
import { createElement, lazy } from 'react'
import {
  TbAdjustmentsHorizontal,
  TbAnchor,
  TbArrowAutofitDown,
  TbArrowAutofitLeft,
  TbArrowBarDown,
  TbBallpen,
  TbCalendar,
  TbChalkboard,
  TbCheckbox,
  TbCircleCheck,
  TbClick,
  TbCloudUpload,
  TbComponents,
  TbFishHook,
  TbFreezeRowColumn,
  TbInputCheck,
  TbLayoutNavbar,
  TbList,
  TbLoader2,
  TbMenu2,
  TbMessage2,
  TbMessageCircleCheck,
  TbNotes,
  TbPhoto,
  TbProgress,
  TbRectangle,
  TbSelect,
  TbSmartHome,
  TbSquare,
  TbTag,
  TbToggleLeft,
  TbTooltip,
  TbUserCircle,
  TbWebhook
} from 'react-icons/tb'
import { Navigate } from 'react-router-dom'

const { t } = await import('i18next')

export interface RouteItem {
  path: string
  element?: ReactNode
  children?: RouteItem[]
  meta?: {
    title?: () => string
    icon?: ReactNode
  }
}

export const routes: RouteItem[] = [
  {
    path: 'home',
    meta: {
      title: () => t('page.title.home'),
      icon: <TbSmartHome />
    },
    children: [
      {
        path: '',
        element: createElement(lazy(() => import('@/views/home')))
      }
    ]
  },
  {
    path: 'rich_text_editor',
    element: createElement(lazy(() => import('@/views/rich-text-editor-demo'))),
    meta: {
      title: () => t('page.title.rte'),
      icon: <TbBallpen />
    }
  },
  {
    path: 'ui_components',
    meta: {
      title: () => t('page.title.ui_components'),
      icon: <TbComponents />
    },
    element: createElement(lazy(() => import('@/views/ui-components'))),
    children: [
      {
        path: 'anchor',
        element: createElement(lazy(() => import('@/views/anchor-demo'))),
        meta: {
          title: () => t('page.title.anchor'),
          icon: <TbAnchor />
        }
      },
      {
        path: 'avatar',
        element: createElement(lazy(() => import('@/views/avatar-demo'))),
        meta: {
          title: () => t('page.title.avatar'),
          icon: <TbUserCircle />
        }
      },
      {
        path: 'button',
        element: createElement(lazy(() => import('@/views/button-demo'))),
        meta: {
          title: () => t('page.title.button'),
          icon: <TbRectangle />
        }
      },
      {
        path: 'card',
        element: createElement(lazy(() => import('@/views/card-demo'))),
        meta: {
          title: () => t('page.title.card'),
          icon: <TbSquare />
        }
      },
      {
        path: 'checkbox',
        element: createElement(lazy(() => import('@/views/checkbox-demo'))),
        meta: {
          title: () => t('page.title.checkbox'),
          icon: <TbCheckbox />
        }
      },
      {
        path: 'collapse',
        element: createElement(lazy(() => import('@/views/collapse-demo'))),
        meta: {
          title: () => t('page.title.collapse'),
          icon: <TbArrowBarDown />
        }
      },
      {
        path: 'context-menu',
        element: createElement(lazy(() => import('@/views/context-menu-demo'))),
        meta: {
          title: () => t('page.title.context_menu'),
          icon: <TbMenu2 />
        }
      },
      {
        path: 'date-picker',
        element: createElement(lazy(() => import('@/views/date-picker-demo'))),
        meta: {
          title: () => t('page.title.date_picker'),
          icon: <TbCalendar />
        }
      },
      {
        path: 'dialog',
        element: createElement(lazy(() => import('@/views/dialog-demo'))),
        meta: {
          title: () => t('page.title.dialog'),
          icon: <TbMessageCircleCheck />
        }
      },
      {
        path: 'drawer',
        element: createElement(lazy(() => import('@/views/drawer-demo'))),
        meta: {
          title: () => t('page.title.drawer'),
          icon: <TbArrowAutofitLeft />
        }
      },
      {
        path: 'dropdown',
        element: createElement(lazy(() => import('@/views/dropdown-demo'))),
        meta: {
          title: () => t('page.title.dropdown'),
          icon: <TbArrowAutofitDown />
        }
      },
      {
        path: 'form',
        element: createElement(lazy(() => import('@/views/form-demo'))),
        meta: {
          title: () => t('page.title.form'),
          icon: <TbNotes />
        }
      },
      {
        path: 'image',
        element: createElement(lazy(() => import('@/views/image-demo'))),
        meta: {
          title: () => t('page.title.image'),
          icon: <TbPhoto />
        }
      },
      {
        path: 'input',
        element: createElement(lazy(() => import('@/views/input-demo'))),
        meta: {
          title: () => t('page.title.input'),
          icon: <TbInputCheck />
        }
      },
      {
        path: 'list',
        element: createElement(lazy(() => import('@/views/list-demo'))),
        meta: {
          title: () => t('page.title.list'),
          icon: <TbList />
        }
      },
      {
        path: 'loading',
        element: createElement(lazy(() => import('@/views/loading-demo'))),
        meta: {
          title: () => t('page.title.loading'),
          icon: <TbLoader2 />
        }
      },
      {
        path: 'overlay',
        element: createElement(lazy(() => import('@/views/overlay-demo'))),
        meta: {
          title: () => t('page.title.overlay'),
          icon: <TbFreezeRowColumn />
        }
      },
      {
        path: 'popover',
        element: createElement(lazy(() => import('@/views/popover-demo'))),
        meta: {
          title: () => t('page.title.popover'),
          icon: <TbChalkboard />
        }
      },
      {
        path: 'progress',
        element: createElement(lazy(() => import('@/views/progress-demo'))),
        meta: {
          title: () => t('page.title.progress'),
          icon: <TbProgress />
        }
      },
      {
        path: 'radio',
        element: createElement(lazy(() => import('@/views/radio-demo'))),
        meta: {
          title: () => t('page.title.radio'),
          icon: <TbCircleCheck />
        }
      },
      {
        path: 'select',
        element: createElement(lazy(() => import('@/views/select-demo'))),
        meta: {
          title: () => t('page.title.select'),
          icon: <TbSelect />
        }
      },
      {
        path: 'slider',
        element: createElement(lazy(() => import('@/views/slider-demo'))),
        meta: {
          title: () => t('page.title.slider'),
          icon: <TbAdjustmentsHorizontal />
        }
      },
      {
        path: 'switch',
        element: createElement(lazy(() => import('@/views/switch-demo'))),
        meta: {
          title: () => t('page.title.switch'),
          icon: <TbToggleLeft />
        }
      },
      {
        path: 'tabs',
        element: createElement(lazy(() => import('@/views/tabs-demo'))),
        meta: {
          title: () => t('page.title.tabs'),
          icon: <TbLayoutNavbar />
        }
      },
      {
        path: 'tag',
        element: createElement(lazy(() => import('@/views/tag-demo'))),
        meta: {
          title: () => t('page.title.tag'),
          icon: <TbTag />
        }
      },
      {
        path: 'toast',
        element: createElement(lazy(() => import('@/views/toast-demo'))),
        meta: {
          title: () => t('page.title.toast'),
          icon: <TbMessage2 />
        }
      },
      {
        path: 'tooltip',
        element: createElement(lazy(() => import('@/views/tooltip-demo'))),
        meta: {
          title: () => t('page.title.tooltip'),
          icon: <TbTooltip />
        }
      },
      {
        path: 'trigger',
        element: createElement(lazy(() => import('@/views/trigger-demo'))),
        meta: {
          title: () => t('page.title.trigger'),
          icon: <TbClick />
        }
      },
      {
        path: 'upload',
        element: createElement(lazy(() => import('@/views/upload-demo'))),
        meta: {
          title: () => t('page.title.upload'),
          icon: <TbCloudUpload />
        }
      },
      {
        path: '*',
        element: <Navigate to="anchor" replace />
      }
    ]
  },
  {
    path: 'hooks',
    meta: {
      title: () => 'Hooks',
      icon: <TbWebhook />
    },
    element: createElement(lazy(() => import('@/views/hooks'))),
    children: [
      {
        path: 'use_boolean',
        element: createElement(lazy(() => import('@/views/use-boolean-demo'))),
        meta: {
          title: () => 'useBoolean',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_compose_ref',
        element: createElement(lazy(() => import('@/views/use-compose-ref-demo'))),
        meta: {
          title: () => 'useComposeRef',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_controllable',
        element: createElement(lazy(() => import('@/views/use-controllable-demo'))),
        meta: {
          title: () => 'useControllable',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_debounce',
        element: createElement(lazy(() => import('@/views/use-debounce-demo'))),
        meta: {
          title: () => 'useDebounce',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_event',
        element: createElement(lazy(() => import('@/views/use-event-demo'))),
        meta: {
          title: () => 'useEvent',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_fetch',
        element: createElement(lazy(() => import('@/views/use-fetch-demo'))),
        meta: {
          title: () => 'useFetch',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_hover',
        element: createElement(lazy(() => import('@/views/use-hover-demo'))),
        meta: {
          title: () => 'useHover',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_infinity',
        element: createElement(lazy(() => import('@/views/use-infinity-demo'))),
        meta: {
          title: () => 'useInfinity',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_intersection',
        element: createElement(lazy(() => import('@/views/use-intersection-demo'))),
        meta: {
          title: () => 'useIntersection',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_latest_ref',
        element: createElement(lazy(() => import('@/views/use-latest-ref-demo'))),
        meta: {
          title: () => 'useLatestRef',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_pagination',
        element: createElement(lazy(() => import('@/views/use-pagination-demo'))),
        meta: {
          title: () => 'usePagination',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_throttle',
        element: createElement(lazy(() => import('@/views/use-throttle-demo'))),
        meta: {
          title: () => 'useThrottle',
          icon: <TbFishHook />
        }
      },
      {
        path: 'use_update',
        element: createElement(lazy(() => import('@/views/use-update-demo'))),
        meta: {
          title: () => 'useUpdate',
          icon: <TbFishHook />
        }
      },
      {
        path: '*',
        element: <Navigate to="use_boolean" replace />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="home" replace />
  }
]
