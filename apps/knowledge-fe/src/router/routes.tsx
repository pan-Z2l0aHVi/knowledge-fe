import type { ReactNode } from 'react'
import { createElement, lazy } from 'react'
import { TbBook2, TbFolderHeart, TbHistory, TbSmartHome, TbVersions } from 'react-icons/tb'
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
    path: 'browse',
    meta: {
      title: () => t('page.title.browse'),
      icon: <TbSmartHome />
    },
    children: [
      {
        path: '',
        element: createElement(lazy(() => import('@/views/browse')))
      },
      {
        path: 'feed-detail',
        element: createElement(lazy(() => import('@/views/feed-detail')))
      }
    ]
  },
  {
    path: 'library',
    meta: {
      title: () => t('page.title.library'),
      icon: <TbBook2 />
    },
    element: createElement(lazy(() => import('@/views/library'))),
    children: [
      {
        path: ':space_id',
        children: [
          {
            path: '',
            element: createElement(lazy(() => import('@/views/space-detail')))
          },
          {
            path: 'editor',
            element: createElement(lazy(() => import('@/views/doc-editor')))
          }
        ]
      }
    ]
  },
  {
    path: 'wallpapers',
    element: createElement(lazy(() => import('@/views/wallpapers'))),
    meta: {
      title: () => t('page.title.wallpapers'),
      icon: <TbVersions />
    }
  },
  {
    path: 'collection',
    element: createElement(lazy(() => import('@/views/collection'))),
    meta: {
      title: () => t('page.title.collection'),
      icon: <TbFolderHeart />
    }
  },
  {
    path: 'history',
    element: createElement(lazy(() => import('@/views/history'))),
    meta: {
      title: () => t('page.title.history'),
      icon: <TbHistory />
    }
  },
  {
    path: 'user-center',
    element: createElement(lazy(() => import('@/views/user-center'))),
    meta: {
      title: () => t('page.title.personal')
    }
  },
  {
    path: 'login-success',
    element: createElement(lazy(() => import('@/views/login-success')))
  },
  {
    path: '*',
    element: <Navigate to="browse" replace />
  }
]
