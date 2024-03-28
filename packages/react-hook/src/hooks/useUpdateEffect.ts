import type { DependencyList, EffectCallback } from 'react'
import { useEffect, useRef } from 'react'

export function useUpdateEffect(effect: EffectCallback, deps: DependencyList) {
  const isMounted = useRef(false)

  useEffect(
    () => () => {
      isMounted.current = false
    },
    []
  )

  useEffect(() => {
    if (isMounted.current) {
      return effect()
    } else {
      isMounted.current = true
    }
  }, deps)
}
