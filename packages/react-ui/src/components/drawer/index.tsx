import './drawer.scss'

import { cls } from '@youknown/utils/src'
import type { CSSProperties, FC, HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'

import { UI_PREFIX } from '../../constants'
import { useEscape } from '../../hooks/useEscape'
import { useZIndex } from '../../hooks/useZIndex'
import { CloseIcon } from '../close-icon'
import { Motion } from '../motion'
import { Overlay } from '../overlay'

export interface DrawerProps extends HTMLAttributes<HTMLElement> {
  open?: boolean
  placement?: 'left' | 'top' | 'right' | 'bottom'
  width?: number | string
  height?: number | string
  overlayStyle?: CSSProperties
  overlayClassName?: string
  overlayClosable?: boolean
  escClosable?: boolean
  closable?: boolean
  appendTo?: HTMLElement | null
  unmountOnExit?: boolean
  onCancel?: () => void
}

export const Drawer: FC<DrawerProps> = props => {
  const {
    children,
    className,
    open = false,
    placement = 'right',
    width,
    height,
    overlayClassName,
    overlayClosable = true,
    escClosable = true,
    overlayStyle,
    closable = false,
    appendTo = document.body,
    unmountOnExit,
    onCancel,
    style,
    ...rest
  } = props

  useEscape(open && escClosable, onCancel)
  const zIndex = useZIndex('popup', open)

  const prefixCls = `${UI_PREFIX}-drawer`

  const directionMap: Record<string, 'left' | 'right' | 'down' | 'up'> = {
    top: 'down',
    bottom: 'up',
    left: 'right',
    right: 'left'
  }
  const direction = directionMap[placement]

  const ele = (
    <>
      <Overlay
        open={open}
        onCancel={onCancel}
        unmountOnExit={unmountOnExit}
        overlayClosable={overlayClosable}
        className={overlayClassName}
        style={overlayStyle}
      />
      <Motion.Slide in={open} mountOnEnter direction={direction}>
        <div
          className={cls(className, `${prefixCls}-wrap`, `${prefixCls}-wrap-${placement}`)}
          style={{ zIndex, ...style, width, height }}
          {...rest}
        >
          {closable && <CloseIcon className={`${prefixCls}-close-icon`} onClick={onCancel} />}
          {children}
        </div>
      </Motion.Slide>
    </>
  )

  return appendTo ? createPortal(ele, appendTo) : ele
}
Drawer.displayName = 'Drawer'
