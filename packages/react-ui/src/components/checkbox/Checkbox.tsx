import './checkbox.scss'

import { useComposeRef, useControllable } from '@youknown/react-hook/src'
import { cls, omit } from '@youknown/utils/src'
import type { ChangeEventHandler, ForwardedRef, LabelHTMLAttributes } from 'react'
import { forwardRef, useRef } from 'react'
import { HiCheck } from 'react-icons/hi'

import { UI_PREFIX } from '../../constants'

export interface CheckboxProps extends Omit<LabelHTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange'> {
  size?: 'small' | 'medium' | 'large'
  label?: string | number
  disabled?: boolean
  defaultValue?: boolean
  value?: boolean
  onChange?: (value: boolean) => void
}

const _Checkbox = (props: CheckboxProps, propRef: ForwardedRef<HTMLInputElement>) => {
  const {
    className,
    children,
    size = 'medium',
    disabled = false,
    ...rest
  } = omit(props, 'defaultValue', 'value', 'onChange')

  const innerRef = useRef<HTMLInputElement>(null)
  const checkboxRef = useComposeRef(innerRef, propRef)
  const [checked, setChecked] = useControllable<boolean>(props, {
    defaultValue: false
  })

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    setChecked(event.target.checked)
  }

  const prefixCls = `${UI_PREFIX}-checkbox`

  return (
    <label
      className={cls(className, prefixCls, `${prefixCls}-${size}`, {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-checked`]: checked
      })}
      {...rest}
    >
      <input
        disabled={disabled}
        className={`${prefixCls}-input`}
        ref={checkboxRef}
        type="checkbox"
        aria-checked={checked}
        checked={checked}
        onChange={handleChange}
      />
      <div className={`${prefixCls}-icon`}>
        <HiCheck className={cls(`${prefixCls}-icon-inner`)} />
      </div>
      {children}
    </label>
  )
}
_Checkbox.displayName = 'Checkbox'

export const Checkbox = forwardRef(_Checkbox)
