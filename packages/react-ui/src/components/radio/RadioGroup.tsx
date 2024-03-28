import './radio-group.scss'

import { useControllable } from '@youknown/react-hook/src'
import { cls, is, omit } from '@youknown/utils/src'
import type { ComponentProps, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'

import { UI_PREFIX } from '../../constants'
import { Space } from '../space'
import { Radio } from './'

export interface RadioGroupProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  size?: 'small' | 'medium' | 'large'
  defaultValue?: T
  value?: T
  options?: {
    label: T
    child: ReactNode
    disabled?: boolean
  }[]
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
  onChange?: (value: T) => void
}

const _RadioGroup = <T extends string | number>(props: RadioGroupProps<T>, propRef: ForwardedRef<HTMLDivElement>) => {
  const {
    children,
    className,
    direction = 'horizontal',
    size = 'medium',
    options = [],
    disabled = false,
    ...rest
  } = omit(props, 'defaultValue', 'value', 'onChange')

  const [value, setValue] = useControllable<T>(props)

  const getHandleSubChange = (label?: T) => (subChecked: boolean) => {
    if (is.undefined(label)) {
      return
    }
    if (subChecked) {
      setValue?.(label)
    }
  }

  const prefixCls = `${UI_PREFIX}-radio-group`

  const radiosEle = (
    <>
      {options.map(option => {
        return (
          <Radio
            key={option.label}
            label={option.label}
            size={size}
            disabled={disabled || option.disabled}
            value={value === option.label}
            onChange={getHandleSubChange(option.label)}
          >
            {option.child}
          </Radio>
        )
      })}
      {Children.map(children, child =>
        isValidElement<ComponentProps<typeof Radio>>(child)
          ? cloneElement(child, {
              size,
              disabled: disabled || child.props.disabled,
              value: value === child.props.label,
              onChange: getHandleSubChange(child.props.label as T)
            })
          : child
      )}
    </>
  )

  return (
    <div
      ref={propRef}
      className={cls(className, prefixCls, {
        [`${prefixCls}-disabled`]: disabled
      })}
      {...rest}
    >
      <Space direction={direction}>{radiosEle}</Space>
    </div>
  )
}
_RadioGroup.displayName = 'RadioGroup'
export const RadioGroup = forwardRef(_RadioGroup)
