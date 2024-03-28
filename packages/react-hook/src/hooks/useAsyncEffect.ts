import type { DependencyList } from 'react'
import { useEffect } from 'react'

export function useAsyncEffect(effect: () => void, deps: DependencyList): void {
  useEffect(() => {
    effect?.()
  }, deps)
}
