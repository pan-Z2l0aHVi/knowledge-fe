import './divider.scss'

import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { UI_PREFIX } from '../../constants'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large'
  direction?: 'horizontal' | 'vertical'
}

export const _Divider = (props: DividerProps, propRef: ForwardedRef<HTMLDivElement>) => {
  const { children, className, size = 'medium', direction = 'horizontal', ...rest } = props
  const prefixCls = `${UI_PREFIX}-divider`
  return (
    <div
      ref={propRef}
      className={cls(className, prefixCls, `${prefixCls}-${direction}`, `${prefixCls}-${direction}-${size}`)}
      {...rest}
    >
      {children}
    </div>
  )
}
_Divider.displayName = 'Divider'

export const Divider = forwardRef(_Divider)
