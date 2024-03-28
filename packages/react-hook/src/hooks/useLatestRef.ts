import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

export function useLatestRef<S>(state: S): MutableRefObject<S> {
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])
  return stateRef
}
