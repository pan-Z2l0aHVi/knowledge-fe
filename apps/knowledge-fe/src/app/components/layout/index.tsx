import { Loading } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { Suspense } from 'react'
import { Outlet, useOutlet } from 'react-router-dom'

import Banner from '../banner'
import KeepAliveOutlet from '../keep-alive-outlet'
import Sidebar from '../sidebar'
import TransitionView from '../transition-view'

export function DesktopLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <div className="flex-1 flex">
        {/* 外层 relative 撑起容器高度 */}
        <div className="relative">
          <Sidebar />
        </div>

        <Suspense
          fallback={
            <div className="flex-1 flex justify-center items-center">
              <Loading spinning size="large" />
            </div>
          }
        >
          <div className={cls('flex-1 sm:flex sm:flex-col')}>
            <KeepAliveOutlet />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

export function MobileLayout() {
  const outlet = useOutlet()
  return (
    <TransitionView>
      <Suspense
        fallback={
          <div className="min-h-screen flex justify-center items-center bg-bg-0">
            <Loading spinning size="large" />
          </div>
        }
      >
        <div className="min-h-screen bg-bg-0">
          <Banner />
          {outlet}
        </div>
      </Suspense>
    </TransitionView>
  )
}

export function NoLayout() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <Loading spinning size="large" />
        </div>
      }
    >
      <div className={cls('min-h-screen')}>
        <Outlet />
      </div>
    </Suspense>
  )
}
