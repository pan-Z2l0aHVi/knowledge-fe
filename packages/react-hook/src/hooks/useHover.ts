import type { ReactElement } from 'react'
import { cloneElement, useState } from 'react'

export function useHover(tar: ReactElement | ((hovering: boolean) => ReactElement)): [ReactElement, boolean] {
  const [hovered, setHovered] = useState(false)
  const elem = typeof tar === 'function' ? tar(hovered) : tar
  const result = cloneElement(elem, {
    onMouseEnter(event: MouseEvent) {
      elem.props?.onMouseEnter?.(event)
      setHovered(true)
    },
    onMouseLeave(event: MouseEvent) {
      elem.props?.onMouseLeave?.(event)
      setHovered(false)
    }
  })
  return [result, hovered]
}
