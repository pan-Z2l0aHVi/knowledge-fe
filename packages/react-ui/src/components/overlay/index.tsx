import './overlay.scss'

import { FloatingOverlay } from '@floating-ui/react'
import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'
import { createPortal } from 'react-dom'

import { UI_PREFIX } from '../../constants'
import { useEscape } from '../../hooks/useEscape'
import { useZIndex } from '../../hooks/useZIndex'
import { Motion } from '../motion'

export interface OverlayProps extends HTMLAttributes<HTMLElement> {
  open?: boolean
  overlayClosable?: boolean
  escClosable?: boolean
  timeout?: number
  unmountOnExit?: boolean
  appendTo?: HTMLElement | null
  onCancel?: () => void
  afterClose?: () => void
}

const _Overlay = (props: OverlayProps, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    children,
    className,
    overlayClosable = true,
    escClosable = true,
    timeout,
    unmountOnExit,
    appendTo = document.body,
    open = false,
    onCancel,
    afterClose,
    onClick,
    onMouseDown,
    style,
    ...rest
  } = props

  useEscape(open && escClosable, onCancel)

  const zIndex = useZIndex('popup', open)
  const maskClickRef = useRef(false)

  const prefixCls = `${UI_PREFIX}-overlay`
  const ele = (
    <Motion.Fade
      in={open}
      timeout={timeout}
      mountOnEnter
      unmountOnExit={unmountOnExit}
      onExited={() => {
        afterClose?.()
      }}
    >
      <FloatingOverlay
        ref={ref}
        className={cls(className, prefixCls)}
        lockScroll={open}
        onMouseDown={event => {
          onMouseDown?.(event)
          maskClickRef.current = event.target === event.currentTarget
        }}
        onClick={event => {
          if (!maskClickRef.current) return
          maskClickRef.current = false
          if (event.target === event.currentTarget) {
            onClick?.(event)
            if (overlayClosable) {
              onCancel?.()
            }
          }
        }}
        style={{
          zIndex,
          ...style
        }}
        {...rest}
      >
        {children}
      </FloatingOverlay>
    </Motion.Fade>
  )

  return appendTo ? createPortal(ele, appendTo) : ele
}
_Overlay.displayName = 'Overlay'
export const Overlay = forwardRef(_Overlay)
