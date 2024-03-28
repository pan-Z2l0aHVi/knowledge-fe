import './index.scss'

import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { TbX } from 'react-icons/tb'

import { UI_PREFIX } from '../../constants'

const _CloseIcon = (props: HTMLAttributes<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, ...rest } = props
  const prefixCls = `${UI_PREFIX}-close-icon`
  return (
    <div ref={ref} className={cls(className, prefixCls)} {...rest}>
      <TbX />
    </div>
  )
}
_CloseIcon.displayName = 'CloseIcon'
export const CloseIcon = forwardRef(_CloseIcon)
