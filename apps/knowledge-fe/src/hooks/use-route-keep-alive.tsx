import { useMemo } from 'react'
import { matchPath, useLocation, useOutlet } from 'react-router-dom'

const KEEP_ALIVE_PATHS: string[] = []

export const outlet_cache = new Map<string, ReturnType<typeof useOutlet>>()

export const check_keep_alive = (pathname: string) =>
  KEEP_ALIVE_PATHS.some(path => matchPath({ path, end: true }, pathname))

export function useRouteKeepAlive() {
  const { pathname } = useLocation()
  return useMemo(() => check_keep_alive(pathname), [pathname])
}
