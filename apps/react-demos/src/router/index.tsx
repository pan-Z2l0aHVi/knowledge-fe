import type { ReactNode } from 'react'
import { createElement, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import App from '@/app'

export interface RouteItem {
  name?: string
  path: string
  element?: ReactNode
  children?: RouteItem[]
}

export const componentRoutes: RouteItem[] = [
  {
    name: 'Anchor',
    path: 'anchor',
    element: createElement(lazy(() => import('@/ui-views/AnchorExample')))
  },
  {
    name: 'Button',
    path: 'button',
    element: createElement(lazy(() => import('@/ui-views/ButtonExample')))
  },
  {
    name: 'Switch',
    path: 'switch',
    element: createElement(lazy(() => import('@/ui-views/SwitchExample')))
  },
  {
    name: 'Radio',
    path: 'radio',
    element: createElement(lazy(() => import('@/ui-views/RadioExample')))
  },
  {
    name: 'Checkbox',
    path: 'checkbox',
    element: createElement(lazy(() => import('@/ui-views/CheckboxExample')))
  },
  {
    name: 'Input',
    path: 'input',
    element: createElement(lazy(() => import('@/ui-views/InputExample')))
  },
  {
    name: 'Tooltip',
    path: 'tooltip',
    element: createElement(lazy(() => import('@/ui-views/TooltipExample')))
  },
  {
    name: 'Collapse',
    path: 'collapse',
    element: createElement(lazy(() => import('@/ui-views/CollapseExample')))
  },
  {
    name: 'Loading',
    path: 'loading',
    element: createElement(lazy(() => import('@/ui-views/LoadingExample')))
  },
  {
    name: 'List',
    path: 'list',
    element: createElement(lazy(() => import('@/ui-views/ListExample')))
  },
  {
    name: 'Overlay',
    path: 'overlay',
    element: createElement(lazy(() => import('@/ui-views/OverlayExample')))
  },
  {
    name: 'Card',
    path: 'card',
    element: createElement(lazy(() => import('@/ui-views/CardExample')))
  },
  {
    name: 'Progress',
    path: 'progress',
    element: createElement(lazy(() => import('@/ui-views/ProgressExample')))
  },
  {
    name: 'Avatar',
    path: 'avatar',
    element: createElement(lazy(() => import('@/ui-views/AvatarExample')))
  },
  {
    name: 'Image',
    path: 'image',
    element: createElement(lazy(() => import('@/ui-views/ImageExample')))
  },
  {
    name: 'Form',
    path: 'form',
    element: createElement(lazy(() => import('@/ui-views/FormExample')))
  },
  {
    name: 'Dialog',
    path: 'dialog',
    element: createElement(lazy(() => import('@/ui-views/DialogExample')))
  },
  {
    name: 'Popover',
    path: 'popover',
    element: createElement(lazy(() => import('@/ui-views/PopoverExample')))
  },
  {
    name: 'Tabs',
    path: 'tabs',
    element: createElement(lazy(() => import('@/ui-views/TabsExample')))
  },
  {
    name: 'Select',
    path: 'select',
    element: createElement(lazy(() => import('@/ui-views/SelectExample')))
  },
  {
    name: 'Slider',
    path: 'slider',
    element: createElement(lazy(() => import('@/ui-views/SliderExample')))
  },
  {
    name: 'Toast',
    path: 'toast',
    element: createElement(lazy(() => import('@/ui-views/ToastExample')))
  },
  {
    name: 'Tag',
    path: 'tag',
    element: createElement(lazy(() => import('@/ui-views/TagExample')))
  },
  {
    name: 'Drawer',
    path: 'drawer',
    element: createElement(lazy(() => import('@/ui-views/DrawerExample')))
  },
  {
    name: 'DatePicker',
    path: 'date_picker',
    element: createElement(lazy(() => import('@/ui-views/DatePickerExample')))
  },
  {
    name: 'Dropdown',
    path: 'dropdown',
    element: createElement(lazy(() => import('@/ui-views/DropdownExample')))
  },
  {
    name: 'Trigger',
    path: 'trigger',
    element: createElement(lazy(() => import('@/ui-views/TriggerExample')))
  },
  {
    name: 'ContextMenu',
    path: 'context_menu',
    element: createElement(lazy(() => import('@/ui-views/ContextMenuExample')))
  },
  {
    name: 'Upload',
    path: 'upload',
    element: createElement(lazy(() => import('@/ui-views/UploadExample')))
  },
  {
    name: 'RichTextEditor',
    path: 'rich_text_editor',
    element: createElement(lazy(() => import('@/editor-views/RichTextEditorExample')))
  },
  {
    name: 'UseLatestRef',
    path: 'use_latest_ref',
    element: createElement(lazy(() => import('@/hook-views/UseLatestRefExample')))
  },
  {
    name: 'UseFetch',
    path: 'use_fetch',
    element: createElement(lazy(() => import('@/hook-views/UseFetchExample')))
  },
  {
    name: 'UsePagination',
    path: 'use_pagination',
    element: createElement(lazy(() => import('@/hook-views/UsePaginationExample')))
  },
  {
    name: 'UseInfinity',
    path: 'use_infinity',
    element: createElement(lazy(() => import('@/hook-views/UseInfinityExample')))
  },
  {
    name: 'HTMLDiff',
    path: 'html_diff',
    element: createElement(lazy(() => import('@/other-views/HTMLDiffExample')))
  },
  {
    name: 'KeepAlive',
    path: 'keep_alive',
    element: createElement(lazy(() => import('@/other-views/KeepAliveExample')))
  },
  {
    name: 'ImageCompress',
    path: 'image_compress',
    element: createElement(lazy(() => import('@/other-views/ImageCompressExample')))
  },
  {
    name: 'ViewTransitions',
    path: 'view_transitions',
    element: createElement(lazy(() => import('@/other-views/view-transitions-example'))),
    children: [
      {
        path: '',
        element: <Navigate to="thumb" replace />
      },
      {
        path: 'thumb',
        element: createElement(lazy(() => import('@/other-views/view-transitions-example/ThumbView')))
      },
      {
        path: 'detail/:id',
        element: createElement(lazy(() => import('@/other-views/view-transitions-example/DetailView')))
      }
    ]
  },
  {
    name: 'VirtualList',
    path: 'virtual_list',
    element: createElement(lazy(() => import('@/other-views/VirtualListExample')))
  },
  {
    name: 'GIF',
    path: 'gif',
    element: createElement(lazy(() => import('@/other-views/GIFExample')))
  },
  {
    name: 'MDX',
    path: 'mdx',
    element: createElement(lazy(() => import('@/other-views/mdx-example')))
  }
]

const routes = [
  {
    path: 'component',
    children: componentRoutes
  },
  {
    path: '*',
    element: <Navigate to={`component/${componentRoutes[0].path}`} replace />
  }
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes
  }
])

export default router
