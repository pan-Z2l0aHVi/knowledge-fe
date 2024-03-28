import './input.scss'

import { useBoolean, useComposeRef, useControllable } from '@youknown/react-hook/src'
import { cls, omit } from '@youknown/utils/src'
import type {
  ChangeEventHandler,
  FocusEventHandler,
  ForwardedRef,
  InputHTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode
} from 'react'
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react'
import { IoMdCloseCircle } from 'react-icons/io'

import { UI_PREFIX } from '../../constants'
import { Textarea } from './Textarea'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'prefix' | 'size'> {
  type?: string
  value?: string
  size?: 'small' | 'medium' | 'large'
  round?: boolean
  bordered?: boolean
  outline?: boolean
  disabled?: boolean
  prefix?: ReactNode
  suffix?: ReactNode
  allowClear?: boolean
  autoFocus?: boolean
  onChange?: (value: string) => void
  onEnter?: (value: string) => void
}

const _Input = (props: InputProps, propRef: ForwardedRef<HTMLInputElement>) => {
  const {
    className,
    prefix,
    suffix,
    type = 'text',
    size = 'medium',
    round = false,
    disabled = false,
    allowClear = false,
    autoFocus = false,
    bordered = true,
    outline = true,
    onFocus,
    onBlur,
    onEnter,
    onKeyDown,
    ...rest
  } = omit(props, 'defaultValue', 'value', 'onChange')

  const ref = useRef<HTMLInputElement>(null)
  const inputRef = useComposeRef(ref, propRef)
  useLayoutEffect(() => {
    if (autoFocus) {
      ref.current?.focus()
    }
  }, [autoFocus])

  const [focus, { setTrue: setFocus, setFalse: setBlur }] = useBoolean(false)
  const [clearVisible, { setTrue: showClear, setFalse: hideClear, setBool: setClearVisible }] = useBoolean(false)
  const [value, setValue] = useControllable(props, {
    defaultValue: ''
  })
  useEffect(() => {
    if (value) {
      showClear()
    }
  }, [value, showClear])

  const handleFocus: FocusEventHandler<HTMLInputElement> = event => {
    onFocus?.(event)
    setFocus()
  }

  const handleBlur: FocusEventHandler<HTMLInputElement> = event => {
    onBlur?.(event)
    setBlur()
  }

  const handleKeydown: KeyboardEventHandler<HTMLInputElement> = event => {
    onKeyDown?.(event)
    if (event.key === 'Enter') {
      onEnter?.(value)
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { value } = event.target
    setValue(value)
    setClearVisible(!!value)
  }

  const handleClear = () => {
    setValue('')
    hideClear()
  }

  const handleMouseDown: MouseEventHandler<SVGElement> = event => {
    if (event.target instanceof Element) {
      if (event.target.tagName !== 'INPUT') event.preventDefault()
    }
  }

  const prefixCls = `${UI_PREFIX}-input`

  return (
    <label
      className={cls(className, prefixCls, `${prefixCls}-${size}`, {
        [`${prefixCls}-focus`]: focus,
        [`${prefixCls}-round`]: round,
        [`${prefixCls}-bordered`]: bordered,
        [`${prefixCls}-outline`]: outline,
        [`${prefixCls}-disabled`]: disabled
      })}
    >
      {prefix}
      <input
        {...rest}
        disabled={disabled}
        className={`${prefixCls}-inner`}
        ref={inputRef}
        // 去除 size=20 最小宽度
        size={1}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeydown}
      />
      {allowClear && (
        <IoMdCloseCircle
          className={`${prefixCls}-clear-icon`}
          style={{ visibility: focus && clearVisible ? 'initial' : 'hidden' }}
          onClick={handleClear}
          onMouseDown={handleMouseDown}
        />
      )}
      {suffix}
    </label>
  )
}
_Input.displayName = 'Input'

const RefInput = forwardRef(_Input)
export const Input = RefInput as typeof RefInput & {
  Textarea: typeof Textarea
}
Input.Textarea = Textarea
