import './radio.scss'

import { useComposeRef, useControllable } from '@youknown/react-hook/src'
import { cls, omit } from '@youknown/utils/src'
import type { ChangeEventHandler, ForwardedRef, LabelHTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'

import { UI_PREFIX } from '../../constants'

export interface RadioProps extends Omit<LabelHTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange'> {
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  label?: string | number
  defaultValue?: boolean
  value?: boolean
  onChange?: (value: boolean) => void
}

const _Radio = (props: RadioProps, propRef: ForwardedRef<HTMLInputElement>) => {
  const {
    className,
    children,
    size = 'medium',
    disabled = false,
    ...rest
  } = omit(props, 'defaultValue', 'value', 'onChange')

  const innerRef = useRef<HTMLInputElement>(null)
  const radioRef = useComposeRef(innerRef, propRef)
  const [checked, setChecked] = useControllable<boolean>(props, {
    defaultValue: false
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    setChecked(event.target.checked)
  }

  const prefixCls = `${UI_PREFIX}-radio`

  const radioCls = cls(className, prefixCls, `${prefixCls}-${size}`, {
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-checked`]: checked
  })

  return (
    <label className={radioCls} {...rest}>
      <input
        disabled={disabled}
        className={`${prefixCls}-inner`}
        ref={radioRef}
        type="radio"
        aria-checked={checked}
        checked={checked}
        onChange={handleChange}
      />
      <div className={`${prefixCls}-icon`}></div>
      {children}
    </label>
  )
}

_Radio.displayName = 'Radio'
export const Radio = forwardRef(_Radio)
