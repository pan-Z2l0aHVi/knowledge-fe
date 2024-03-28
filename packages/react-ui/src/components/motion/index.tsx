import { Collapse, Fade, Grow, Slide, Zoom } from '@mui/material'
import { useComposeRef } from '@youknown/react-hook/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { cloneElement, forwardRef, isValidElement, useRef } from 'react'
import { Transition } from 'react-transition-group'
import type { TransitionProps } from 'react-transition-group/Transition'

export interface StretchProps
  extends Pick<
      TransitionProps,
      | 'in'
      | 'timeout'
      | 'mountOnEnter'
      | 'unmountOnExit'
      | 'onEnter'
      | 'onEntering'
      | 'onEntered'
      | 'onExit'
      | 'onExiting'
      | 'onExited'
      | 'nodeRef'
    >,
    HTMLAttributes<HTMLElement> {
  direction?: 'top' | 'bottom' | 'left' | 'right'
}

const Stretch = (props: StretchProps, ref: ForwardedRef<HTMLElement>) => {
  const { children, direction = 'bottom', in: inProp, timeout = 225, style, ...rest } = props

  const getTransformStyle = () => {
    switch (direction) {
      case 'top':
      case 'bottom':
        return 'scaleY(0.8)'
      case 'left':
      case 'right':
        return 'scaleX(0.8)'
    }
  }

  const getTransformOrigin = () => {
    switch (direction) {
      case 'top':
        return 'bottom'
      case 'bottom':
        return 'top'
      case 'left':
        return 'right'
      case 'right':
        return 'left'
      default:
        return 'center'
    }
  }
  const nodeRef = useRef(null)
  const handleRef = useComposeRef(ref, nodeRef, (children as any).ref)

  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={timeout} {...rest}>
      {(state, childProps) =>
        isValidElement<any>(children)
          ? cloneElement(children, {
              style: {
                visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
                opacity: state === 'entering' || state === 'entered' ? 1 : 0,
                transformOrigin: getTransformOrigin(),
                transform: state === 'entering' || state === 'entered' ? 'scale(1)' : getTransformStyle(),
                transition:
                  'opacity 0.225s cubic-bezier(0.075, 0.82, 0.165, 1), transform 0.225s cubic-bezier(0.075, 0.82, 0.165, 1)',
                ...style,
                ...children.props.style
              },
              ref: handleRef,
              ...childProps
            })
          : children
      }
    </Transition>
  )
}
Stretch.displayName = 'Stretch'

type DisappearanceProps = Pick<
  TransitionProps,
  | 'in'
  | 'timeout'
  | 'mountOnEnter'
  | 'unmountOnExit'
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited'
  | 'nodeRef'
> &
  HTMLAttributes<HTMLElement>
const Disappearance = (props: DisappearanceProps, ref: ForwardedRef<HTMLElement>) => {
  const { children, in: inProp, style, timeout = 225, ...rest } = props
  const nodeRef = useRef(null)
  const handleRef = useComposeRef(ref, nodeRef, (children as any).ref)

  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={timeout} {...rest}>
      {(state, childProps) => {
        return isValidElement<any>(children)
          ? cloneElement(children, {
              style: {
                display: state === 'exited' && !inProp ? 'none' : undefined,
                ...style,
                ...children.props.style
              },
              ref: handleRef,
              ...childProps
            })
          : children
      }}
    </Transition>
  )
}
Disappearance.displayName = 'Disappearance'

export const Motion = {
  Fade,
  Grow,
  Slide,
  Zoom,
  Collapse,
  Stretch: forwardRef(Stretch),
  Disappearance: forwardRef(Disappearance)
}
