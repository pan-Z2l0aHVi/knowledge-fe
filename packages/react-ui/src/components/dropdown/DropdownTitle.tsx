import './dropdown-title.scss'

import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { UI_PREFIX } from '../../constants'

type DropdownTitleProps = HTMLAttributes<HTMLElement>

const _DropdownTitle = (props: DropdownTitleProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, children, ...rest } = props

  const prefixCls = `${UI_PREFIX}-dropdown-title`

  return (
    <div ref={ref} className={cls(className, prefixCls)} {...rest}>
      {children}
    </div>
  )
}
_DropdownTitle.displayName = 'DropdownTitle'
export const DropdownTitle = forwardRef(_DropdownTitle)
