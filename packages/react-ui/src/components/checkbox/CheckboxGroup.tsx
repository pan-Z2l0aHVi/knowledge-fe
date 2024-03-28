import './checkbox-group.scss'

import { useControllable } from '@youknown/react-hook/src'
import { cls, is, omit } from '@youknown/utils/src'
import type { ComponentProps, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'

import { UI_PREFIX } from '../../constants'
import { Space } from '../space'
import { Checkbox } from './'

export interface CheckboxGroupProps<T> extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  defaultValue?: T[]
  value?: T[]
  options?: {
    label: T
    child: ReactNode
    disabled?: boolean
  }[]
  size?: 'small' | 'medium' | 'large'
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
  onChange?: (value: T[]) => void
}

const _CheckboxGroup = <T extends string | number>(
  props: CheckboxGroupProps<T>,
  propRef: ForwardedRef<HTMLDivElement>
) => {
  const {
    children,
    className,
    direction = 'horizontal',
    size = 'medium',
    options = [],
    disabled = false,
    ...rest
  } = omit(props, 'defaultValue', 'value', 'onChange')

  const [value, setValue] = useControllable<T[]>(props, {
    defaultValue: []
  })

  const getHandleSubChange = (label?: T) => (subChecked: boolean) => {
    if (is.undefined(label)) {
      return
    }
    setValue?.(p => {
      const hasChecked = p.includes(label)

      if (subChecked) {
        if (!hasChecked) {
          return [...p, label]
        }
      } else {
        if (hasChecked) {
          return p.filter(item => item !== label)
        }
      }
      return p
    })
  }

  const prefixCls = `${UI_PREFIX}-checkbox-group`

  return (
    <div
      ref={propRef}
      className={cls(className, prefixCls, {
        [`${prefixCls}-disabled`]: disabled
      })}
      {...rest}
    >
      <Space direction={direction}>
        {options.map(option => {
          return (
            <Checkbox
              key={option.label}
              label={option.label}
              size={size}
              disabled={disabled || option.disabled}
              value={value.includes(option.label)}
              onChange={getHandleSubChange(option.label)}
            >
              {option.child}
            </Checkbox>
          )
        })}
        {Children.map(children, child =>
          isValidElement<ComponentProps<typeof Checkbox>>(child)
            ? cloneElement(child, {
                size,
                disabled: disabled || child.props.disabled,
                value: child.props.label != null && value.includes(child.props.label as T),
                onChange: getHandleSubChange(child.props.label as T)
              })
            : child
        )}
      </Space>
    </div>
  )
}
_CheckboxGroup.displayName = 'CheckboxGroup'
export const CheckboxGroup = forwardRef(_CheckboxGroup)
