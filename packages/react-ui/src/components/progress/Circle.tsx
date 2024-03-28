import './circle.scss'

import { cls, is } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useEffect, useRef } from 'react'

import { UI_PREFIX } from '../../constants'

export interface CircleProps extends HTMLAttributes<HTMLElement> {
  size?: 'small' | 'medium' | 'large'
  defaultMolecule?: number
  molecule?: number
  denominator?: number
  round?: boolean
  strokeWidth?: number
  duration?: number
}
interface SizeData {
  width: number
  height: number
  cx: number
  cy: number
  r: number
  strokeWidth: number
}

const _Circle = (props: CircleProps, propRef: ForwardedRef<HTMLDivElement>) => {
  const {
    children,
    className,
    size = 'medium',
    defaultMolecule = 0,
    molecule = 0,
    denominator = 100,
    round = true,
    strokeWidth,
    duration = 0.4,
    ...rest
  } = props

  const circleRef = useRef<SVGCircleElement>(null)

  let sizeData: SizeData
  const getStrokeWidth = (width: number) => (is.undefined(strokeWidth) ? width : strokeWidth)
  switch (size) {
    case 'small':
      sizeData = {
        width: 24,
        height: 24,
        cx: 12,
        cy: 12,
        r: 12 - getStrokeWidth(2),
        strokeWidth: getStrokeWidth(2)
      }
      break
    case 'medium':
      sizeData = {
        width: 80,
        height: 80,
        cx: 40,
        cy: 40,
        r: 40 - getStrokeWidth(4),
        strokeWidth: getStrokeWidth(4)
      }
      break
    case 'large':
      sizeData = {
        width: 120,
        height: 120,
        cx: 60,
        cy: 60,
        r: 60 - getStrokeWidth(6),
        strokeWidth: getStrokeWidth(6)
      }
      break
  }
  const progressLen = 2 * Math.PI * sizeData.r

  useEffect(() => {
    const num = Math.max(0, Math.min(molecule, denominator))
    if (circleRef.current)
      circleRef.current.style.setProperty('stroke-dashoffset', String(progressLen - (progressLen / denominator) * num))
  }, [denominator, molecule, progressLen])

  const prefixCls = `${UI_PREFIX}-circle`

  return (
    <div ref={propRef} className={cls(className, prefixCls, `${prefixCls}-${size}`)} {...rest}>
      {children}
      <svg width={sizeData.width} height={sizeData.height}>
        <circle
          ref={circleRef}
          className={cls(`${prefixCls}-circle`, {
            [`${prefixCls}-circle-round`]: round
          })}
          cx={sizeData.cx}
          cy={sizeData.cy}
          r={sizeData.r}
          strokeWidth={sizeData.strokeWidth}
          strokeDasharray={progressLen}
          strokeDashoffset={progressLen * (1 - defaultMolecule / denominator)}
          style={{ transitionDuration: `${duration}s` }}
        ></circle>
      </svg>
    </div>
  )
}
_Circle.displayName = 'Circle'

export const Circle = forwardRef(_Circle)
