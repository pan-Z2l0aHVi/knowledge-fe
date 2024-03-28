import './progress.scss'

import { cls, is } from '@youknown/utils/src'
import type { CSSProperties, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import type { RenderCounterProps } from 'react-countup/build/types'

import { UI_PREFIX } from '../../constants'
import { ProgressCircle } from './ProgressCircle'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large'
  defaultPercent?: number
  percent?: number
  direction?: 'horizontal' | 'vertical'
  trackColor?: string
  suffix?: ReactNode
  format?: ((ref: RenderCounterProps) => ReactNode) | null
}

const _Progress = (props: ProgressProps, propRef: ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    size = 'medium',
    defaultPercent = 0,
    percent = 0,
    direction = 'horizontal',
    trackColor,
    suffix = '%',
    format,
    ...rest
  } = props

  const prePercentRef = useRef(defaultPercent)
  useEffect(() => {
    prePercentRef.current = percent
  }, [percent])

  const prefixCls = `${UI_PREFIX}-progress`

  let rectStyle: CSSProperties
  switch (direction) {
    case 'horizontal':
      rectStyle = {
        width: `${percent}%`
      }
      break
    case 'vertical':
      rectStyle = {
        height: `${percent}%`
      }
      break
  }

  return (
    <div
      ref={propRef}
      className={cls(className, prefixCls, `${prefixCls}-${size}`, `${prefixCls}-${direction}`)}
      {...rest}
    >
      <div
        className={cls(`${prefixCls}-track`, {
          [`${prefixCls}-track-spacing`]: !is.null(format)
        })}
        style={{
          backgroundColor: trackColor
        }}
      >
        <div className={`${prefixCls}-inset`} style={rectStyle}></div>
      </div>
      {is.null(format) || (
        <span className={`${prefixCls}-text`}>
          <CountUp start={prePercentRef.current} end={percent}>
            {format}
          </CountUp>
          {suffix}
        </span>
      )}
    </div>
  )
}
_Progress.displayName = 'Progress'

const RefProgress = forwardRef(_Progress)
export const Progress = RefProgress as typeof RefProgress & {
  Circle: typeof ProgressCircle
}
Progress.Circle = ProgressCircle
