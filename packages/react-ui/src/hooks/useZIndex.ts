import { useEffect, useState } from 'react'

// Zero Level (1级)：默认层级，用于大多数组件。通常不需要特别设置 z-index 值的组件都属于这一级别。
// Pop Level (2级)：用于弹出（Tooltip、Popover、Modal、Drawer）组件，通常位于一般层级之上。
// Message Level (3级)：用于通知（Message）组件，通常位于所有其他层级之上。
export class ZIndexManager {
  public zero: number
  public popup: number
  public message: number
  constructor() {
    this.zero = 0
    this.popup = 1000
    this.message = 9000
  }
}

export type ZIndexLevel = keyof ZIndexManager

const zIndexInst = new ZIndexManager()

export function useZIndex(level: ZIndexLevel = 'zero', open = false) {
  const [zIndex, setZIndex] = useState(zIndexInst[level])
  useEffect(() => {
    if (open) {
      setZIndex(++zIndexInst[level])
    }
  }, [level, open])
  return zIndex
}
