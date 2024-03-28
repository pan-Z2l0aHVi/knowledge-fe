import './form.scss'

import type { FormInstance } from '@youknown/react-hook/src'
import { useForm } from '@youknown/react-hook/src'
import { cls, omit } from '@youknown/utils/src'
import type { FormEvent, FormHTMLAttributes, ForwardedRef } from 'react'
import { forwardRef } from 'react'

import { UI_PREFIX } from '../../constants'
import { Field } from './Field'
import type { FormContext } from './FormCtx'
import { FormCtx } from './FormCtx'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement>, Omit<Partial<FormContext>, 'labelAlign'> {
  form: FormInstance
  layout?: 'horizontal' | 'vertical' | 'inline'
}

const _Form = (props: FormProps, propRef: ForwardedRef<HTMLFormElement>) => {
  const { className, children, layout = 'horizontal', form, labelSuffix, onSubmit, ...rest } = omit(props, 'labelWidth')
  let { labelWidth } = props

  const prefixCls = `${UI_PREFIX}-form`

  let labelAlign: FormContext['labelAlign'] | undefined
  if (layout === 'horizontal') {
    labelAlign = 'right'
  } else if (layout === 'vertical') {
    labelAlign = 'top'
  } else if (layout === 'inline') {
    labelWidth = 'unset'
    labelAlign = 'left'
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    onSubmit?.(e)
    form.onSubmit(e)
  }

  return (
    <FormCtx.Provider
      value={{
        form,
        labelWidth,
        labelSuffix,
        labelAlign
      }}
    >
      <form
        ref={propRef}
        className={cls(className, prefixCls, `${prefixCls}-${layout}`)}
        onSubmit={handleSubmit}
        {...rest}
      >
        {children}
      </form>
    </FormCtx.Provider>
  )
}
_Form.displayName = 'Form'

const RefForm = forwardRef(_Form)
export const Form = RefForm as typeof RefForm & {
  Field: typeof Field
  useForm: typeof useForm
}
Form.Field = Field
Form.useForm = useForm
