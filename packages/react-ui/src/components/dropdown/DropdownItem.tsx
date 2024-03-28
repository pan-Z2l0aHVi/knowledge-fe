import './dropdown-item.scss'

import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'

import { UI_PREFIX } from '../../constants'
import { MenuCtx } from './MenuCtx'

export interface DropdownItemProps extends Omit<HTMLAttributes<HTMLElement>, 'prefix'> {
  prefix?: ReactNode
  suffix?: ReactNode
  closeAfterItemClick?: boolean
  disabled?: boolean
}

const _DropdownItem = (props: DropdownItemProps, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    children,
    prefix = null,
    suffix = null,
    closeAfterItemClick,
    disabled = false,
    onClick,
    ...rest
  } = props

  const menuCtx = useContext(MenuCtx)
  const closeAfterClick = closeAfterItemClick ?? menuCtx.closeAfterItemClick ?? false

  const handleItemClick: MouseEventHandler<HTMLElement> = e => {
    if (disabled) return

    onClick?.(e)
    if (closeAfterClick) {
      menuCtx.closeDropdown?.()
    }
  }
  const prefixCls = `${UI_PREFIX}-dropdown-item`

  return (
    <div
      ref={ref}
      className={cls(className, prefixCls, {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-with-prefix`]: Boolean(prefix),
        [`${prefixCls}-with-suffix`]: Boolean(suffix)
      })}
      role="option"
      aria-disabled={disabled}
      onClick={handleItemClick}
      {...rest}
    >
      {prefix && <div className={`${prefixCls}-prefix-wrap`}>{prefix}</div>}
      <div className={`${prefixCls}-children-wrap`}>{children}</div>
      {suffix && <div className={`${prefixCls}-suffix-wrap`}>{suffix}</div>}
    </div>
  )
}
_DropdownItem.displayName = 'DropdownItem'
export const DropdownItem = forwardRef(_DropdownItem)
