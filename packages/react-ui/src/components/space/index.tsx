import './space.scss'

import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { UI_PREFIX } from '../../constants'

export interface SpaceProps extends HTMLAttributes<HTMLElement> {
  size?: 'small' | 'medium' | 'large'
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'horizontal' | 'vertical'
  wrap?: boolean
}

const _Space = (props: SpaceProps, propRef: ForwardedRef<HTMLDivElement>) => {
  const {
    children,
    className,
    size = 'medium',
    align = 'start',
    direction = 'horizontal',
    wrap = true,
    style,
    ...rest
  } = props

  function toAlignItems(align: string) {
    if (['start', 'end'].includes(align)) {
      return `flex-${align}`
    }
    return align
  }
  function toFlexDirection(direction: string) {
    if (direction === 'horizontal') return 'row'
    if (direction === 'vertical') return 'column'
    return 'row'
  }

  const prefixCls = `${UI_PREFIX}-space`
  const wrapCls = cls(className, prefixCls, `${prefixCls}-${direction}-${size}`, wrap && `${prefixCls}-wrap`)

  return (
    <div
      ref={propRef}
      className={wrapCls}
      style={{
        display: 'flex',
        alignItems: toAlignItems(align),
        flexDirection: toFlexDirection(direction),
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
_Space.displayName = 'Space'
export const Space = forwardRef(_Space)
