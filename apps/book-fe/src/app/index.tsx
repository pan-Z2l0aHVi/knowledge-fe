import { lazy, Suspense } from 'react'

import { useInitApp } from '@/hooks/use-init-app'
import { useRouteScrollTop } from '@/hooks/use-route-scroll-top'
import { useUIStore } from '@/stores'

import FabBar from './components/fab-bar'
import { DesktopLayout, MobileLayout } from './components/layout'
import PageProgress from './components/page-progress'

const PreferencesModal = lazy(() => import('./components/preferences-modal'))

export default function App() {
  const is_mobile = useUIStore(state => state.is_mobile)
  useRouteScrollTop()
  useInitApp()

  const global_els = (
    <>
      <PageProgress />
      <Suspense>
        <PreferencesModal />
      </Suspense>
    </>
  )

  return (
    <>
      {global_els}

      {is_mobile ? <MobileLayout /> : <DesktopLayout />}
      <FabBar />
    </>
  )
}
