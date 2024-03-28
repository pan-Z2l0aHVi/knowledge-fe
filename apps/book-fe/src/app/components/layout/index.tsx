import { Drawer, Loading } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { Suspense } from 'react'

import { useUIStore } from '@/stores'

import Banner from '../banner'
import KeepAliveOutlet from '../keep-alive-outlet'
import Sidebar from '../sidebar'

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
  const menu_drawer_open = useUIStore(state => state.menu_drawer_open)
  const set_menu_drawer_open = useUIStore(state => state.set_menu_drawer_open)
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center">
          <Loading spinning size="large" />
        </div>
      }
    >
      <div className="min-h-screen">
        <Banner />
        <KeepAliveOutlet />
      </div>

      <Drawer
        placement="left"
        open={menu_drawer_open}
        onCancel={() => {
          set_menu_drawer_open(false)
        }}
      >
        <Sidebar />
      </Drawer>
    </Suspense>
  )
}
