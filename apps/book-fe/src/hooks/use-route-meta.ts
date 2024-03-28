import { useMemo } from 'react'
import { matchRoutes, useLocation } from 'react-router-dom'

import { routes } from '@/router/routes'

export function useRouteMeta() {
  const location = useLocation()
  const matched = useMemo(() => matchRoutes(routes, location), [location])
  if (!matched) {
    return {}
  }
  return matched[0].route?.meta ?? {}
}
