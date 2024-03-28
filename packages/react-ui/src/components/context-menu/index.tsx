import './context-menu.scss'

import { useContextMenu, useControllable } from '@youknown/react-hook/src'
import { cls, getViewportHeight, getViewportWidth, omit } from '@youknown/utils/src'
import type { HTMLAttributes } from 'react'
import { useEffect, useRef, useState } from 'react'

import { UI_PREFIX } from '../../constants'
import { Overlay } from '../overlay'

export interface ContextMenuProps extends HTMLAttributes<HTMLElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  x?: number
  y?: number
  overlayClosable?: boolean
  escClosable?: boolean
  appendTo?: HTMLElement | null
  afterClose?: () => void
}
export function _ContextMenu(props: ContextMenuProps) {
  const {
    children,
    className,
    x = 0,
    y = 0,
    overlayClosable,
    escClosable,
    afterClose,
    appendTo,
    style,
    ...rest
  } = omit(props, 'defaultOpen', 'open', 'onOpenChange')

  const [open, setOpen] = useControllable(props, {
    defaultValue: false,
    defaultValuePropName: 'defaultOpen',
    valuePropName: 'open',
    trigger: 'onOpenChange'
  })

  const [left, setLeft] = useState(x)
  const [top, setTop] = useState(y)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (open && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      if (x + width < getViewportWidth()) {
        setLeft(x)
      } else {
        setLeft(x - width)
      }
      if (y + height < getViewportHeight()) {
        setTop(y)
      } else {
        setTop(y - height)
      }
    }
  }, [open, x, y])

  const prefixCls = `${UI_PREFIX}-content-menu`
  return (
    <Overlay
      className={`${prefixCls}-overlay`}
      afterClose={afterClose}
      open={open}
      onCancel={() => setOpen(false)}
      overlayClosable={overlayClosable}
      escClosable={escClosable}
      appendTo={appendTo}
      unmountOnExit
      onContextMenu={event => {
        event.preventDefault()
        setOpen(false)
      }}
    >
      <div ref={containerRef} className={cls(className, prefixCls)} style={{ ...style, left, top }} {...rest}>
        {children}
      </div>
    </Overlay>
  )
}
_ContextMenu.displayName = 'ContextMenu'

export const ContextMenu = _ContextMenu as typeof _ContextMenu & {
  useContextMenu: typeof useContextMenu
}
ContextMenu.useContextMenu = useContextMenu
