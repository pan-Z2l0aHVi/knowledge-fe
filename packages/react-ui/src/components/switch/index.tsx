import './switch.scss'

import { useComposeRef, useControllable } from '@youknown/react-hook/src'
import { cls, omit } from '@youknown/utils/src'
import type { ChangeEventHandler, ForwardedRef, LabelHTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'

import { UI_PREFIX } from '../../constants'

export interface SwitchProps extends Omit<LabelHTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange'> {
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  defaultValue?: boolean
  value?: boolean
  onChange?: (value: boolean) => void
}

const _Switch = (props: SwitchProps, propRef: ForwardedRef<HTMLInputElement>) => {
  const { className, size = 'medium', disabled = false, ...rest } = omit(props, 'defaultValue', 'value', 'onChange')

  const [checked, setChecked] = useControllable(props, {
    defaultValue: false
  })
  const innerRef = useRef<HTMLInputElement>(null)
  const switchRef = useComposeRef(innerRef, propRef)

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    setChecked(event.target.checked)
  }

  const prefixCls = `${UI_PREFIX}-switch`

  return (
    <label
      className={cls(className, prefixCls, `${prefixCls}-${size}`, {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-checked`]: checked
      })}
      {...rest}
    >
      <input
        className={`${prefixCls}-inner`}
        ref={switchRef}
        type="checkbox"
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={handleChange}
      />
    </label>
  )
}
_Switch.displayName = 'Switch'
export const Switch = forwardRef(_Switch)
