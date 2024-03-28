import type { RouteRecordRaw } from 'vue-router'

export const navTabRoutes: (RouteRecordRaw & {
  meta: {
    title: string
  }
})[] = [
  {
    path: '/use_fetch',
    name: 'use_fetch',
    component: () => import('@/views/use-fetch/index.vue'),
    meta: {
      title: 'Use fetch hook'
    }
  },
  {
    path: '/use_infinity',
    name: 'use_infinity',
    component: () => import('@/views/use-infinity/index.vue'),
    meta: {
      title: 'Use infinity hook'
    }
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/upload/index.vue'),
    meta: {
      title: 'Upload'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('@/views/rich-text-editor/index.vue'),
    meta: {
      title: 'Editor'
    }
  },
  {
    path: '/crypto',
    name: 'crypto',
    component: () => import('@/views/crypto/index.vue'),
    meta: {
      title: 'Crypto'
    }
  },
  {
    path: '/tab_bar',
    name: 'tab_bar',
    component: () => import('@/views/tab-bar/index.vue'),
    meta: {
      title: 'TabBar'
    }
  }
]

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: navTabRoutes[0].path
  },
  ...navTabRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
