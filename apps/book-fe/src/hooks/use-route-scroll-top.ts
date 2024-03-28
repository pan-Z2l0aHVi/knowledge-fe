import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useRouteKeepAlive } from './use-route-keep-alive'

const BLOCK_LIST: string[] = []

export function useRouteScrollTop() {
  const is_keep_alive = useRouteKeepAlive()
  const location = useLocation()
  useLayoutEffect(() => {
    if (is_keep_alive) {
      return
    }
    if (BLOCK_LIST.includes(location.pathname)) {
      return
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  }, [is_keep_alive, location])
}
