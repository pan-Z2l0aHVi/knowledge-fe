import { throttle } from 'lodash-es'
import { useMemo } from 'react'

import { useLatestRef } from './useLatestRef'
import { useUnmount } from './useUnmount'

type noop = (...args: any[]) => any
export interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}
export function useThrottle<T extends noop>(fn: T, wait = 1000, options?: ThrottleOptions) {
  const fnRef = useLatestRef(fn)

  const throttled = useMemo(
    () =>
      throttle(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args)
        },
        wait,
        options
      ),
    []
  )

  useUnmount(() => {
    throttled.cancel()
  })

  return throttled
}
