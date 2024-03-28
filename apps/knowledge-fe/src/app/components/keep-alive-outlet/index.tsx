import { useUpdate } from '@youknown/react-hook/src'
import { KeepAlive } from '@youknown/react-ui/src'
import { useLayoutEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

import { outlet_cache, useRouteKeepAlive } from '@/hooks/use-route-keep-alive'

export default function KeepAliveOutlet() {
  const outlet = useOutlet()
  const update = useUpdate()
  const { pathname } = useLocation()
  const is_keep_alive = useRouteKeepAlive()

  useLayoutEffect(() => {
    console.log('is_keep_alive: ', pathname, is_keep_alive)
    if (is_keep_alive) {
      if (!outlet_cache.has(pathname)) {
        outlet_cache.set(pathname, outlet)
        update()
      }
    }
  }, [is_keep_alive, outlet, pathname, update])

  return (
    <>
      {!is_keep_alive && outlet}
      {Array.from(outlet_cache).map(([key, component]) => (
        <KeepAlive key={key} show={pathname === key}>
          {component}
        </KeepAlive>
      ))}
    </>
  )
}
