import { is } from '@youknown/utils/src'
import type { MutableRefObject } from 'react'
import { useLayoutEffect, useState } from 'react'

export function useIntersection(
  target?: MutableRefObject<HTMLElement | null>,
  observerInit?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const enabled = !is.undefined(target)

  useLayoutEffect(() => {
    if (!enabled) return
    if (!target.current) return

    const observe = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setIsIntersecting(entry.isIntersecting)
      })
    }, observerInit)
    observe.observe(target.current)

    return () => {
      observe.disconnect()
    }
  }, [observerInit, target, enabled])

  return isIntersecting
}
