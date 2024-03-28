import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

export function useHoverRef(ref: RefObject<Element>): boolean {
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    const onMouseEnter = () => {
      setHovered(true)
    }
    const onMouseLeave = () => {
      setHovered(false)
    }
    const { current } = ref
    current?.addEventListener('mouseenter', onMouseEnter)
    current?.addEventListener('mouseenter', onMouseLeave)
    return () => {
      current?.removeEventListener('mouseenter', onMouseEnter)
      current?.removeEventListener('mouseenter', onMouseLeave)
    }
  }, [ref])
  return hovered
}
