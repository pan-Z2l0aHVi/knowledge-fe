import type { MutableRefObject } from 'react'
import { useEffect, useState } from 'react'

type Target = Element | (() => Element) | Document | MutableRefObject<Element>
interface Position {
  left: number
  top: number
}
export function useScroll(
  tar: Target = document,
  conditionFn: (pos: Position) => boolean = () => true
): [number, number] {
  const [{ left, top }, setPos] = useState<Position>({ left: 0, top: 0 })

  useEffect(() => {
    function getElem(tar: Target): Element {
      if (tar instanceof Document) return tar.body
      if (typeof tar === 'function') return tar()
      if ('current' in tar) return tar.current
      return tar
    }
    const el = getElem(tar)
    function getScrollPos() {
      const pos = {
        left: el.scrollLeft,
        top: el.scrollTop
      }
      if (conditionFn(pos)) setPos(pos)
    }
    el.addEventListener('scroll', getScrollPos, {
      passive: true
    })
    return () => {
      el.removeEventListener('scroll', getScrollPos)
    }
  }, [conditionFn, tar])

  return [left, top]
}
