import './card.scss'

import { cls, is } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, isValidElement } from 'react'

import { UI_PREFIX } from '../../constants'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  bordered?: boolean
  shadow?: boolean
  header?: ReactNode
  footer?: ReactNode
  cover?: ReactNode
}

const _Card = (props: CardProps, propRef: ForwardedRef<HTMLDivElement>) => {
  const { children, className, bordered = false, shadow = false, header, footer, cover, ...rest } = props

  const prefixCls = `${UI_PREFIX}-card`

  const checkNeedWrap = (ele: ReactNode): boolean => {
    if (ele == null) {
      return false
    }
    if (is.array(ele)) {
      return ele.every(checkNeedWrap)
    }
    return !isValidElement(ele)
  }

  return (
    <div
      ref={propRef}
      className={cls(className, prefixCls, {
        [`${prefixCls}-bordered`]: bordered,
        [`${prefixCls}-shadow`]: shadow
      })}
      {...rest}
    >
      {cover && <div className={`${prefixCls}-cover`}>{cover}</div>}
      {checkNeedWrap(header) ? <div className={`${prefixCls}-header`}>{header}</div> : header}
      {checkNeedWrap(children) ? <div className={`${prefixCls}-content`}>{children}</div> : children}
      {checkNeedWrap(footer) ? <div className={`${prefixCls}-footer`}>{footer}</div> : footer}
    </div>
  )
}
_Card.displayName = 'Card'
export const Card = forwardRef(_Card)
