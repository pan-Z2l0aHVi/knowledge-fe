import './aspect-ratio.scss'

import { cls } from '@youknown/utils/src'
import type { FC, HTMLAttributes } from 'react'

import { UI_PREFIX } from '../../constants'

export interface AspectRatioProps extends HTMLAttributes<HTMLElement> {
  ratio: number
}

export const AspectRatio: FC<AspectRatioProps> = props => {
  const { className, ratio = 1, children, style, ...rest } = props

  const prefixCls = `${UI_PREFIX}-aspect-ratio`

  return (
    <div className={cls(className, prefixCls)} style={{ ...style, paddingBottom: `calc(${ratio} * 100%)` }} {...rest}>
      <div className={`${prefixCls}-content`}>{children}</div>
    </div>
  )
}
AspectRatio.displayName = 'AspectRatio'
