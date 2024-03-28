import { debounce } from 'lodash-es'
import { useMemo } from 'react'

import { useLatestRef } from './useLatestRef'
import { useUnmount } from './useUnmount'

type noop = (...args: any[]) => any
export interface DebounceOptions {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}
export function useDebounce<T extends noop>(fn: T, wait = 1000, options?: DebounceOptions) {
  const fnRef = useLatestRef(fn)

  const debounced = useMemo(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => {
          return fnRef.current(...args)
        },
        wait,
        options
      ),
    []
  )

  useUnmount(() => {
    debounced.cancel()
  })

  return debounced
}
