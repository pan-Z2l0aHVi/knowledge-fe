import { useLayoutEffect } from 'react'

import { useLatestRef } from './useLatestRef'

export function useUnmount(fn: () => void) {
  const fnRef = useLatestRef(fn)
  useLayoutEffect(
    () => () => {
      fnRef.current()
    },
    [fnRef]
  )
}
