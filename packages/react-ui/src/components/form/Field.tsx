import './field.scss'

import { FormInstance, useUpdate } from '@youknown/react-hook/src'
import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes, LabelHTMLAttributes } from 'react'
import { Children, cloneElement, forwardRef, isValidElement, useContext, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'

import { UI_PREFIX } from '../../constants'
import { Motion } from '../motion'
import { FormContext, FormCtx } from './FormCtx'

export interface FieldProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement> & HTMLAttributes<HTMLDivElement>, 'form'>,
    Partial<FormContext> {
  label?: string
  labelText?: string | number
  form?: FormInstance
  validators?: ((value: any) => Promise<string | void>)[]
}

const _Field = (props: FieldProps, propRef: ForwardedRef<HTMLLabelElement & HTMLDivElement>) => {
  const { className, children, form, label, labelText, labelWidth, labelAlign, labelSuffix, validators, ...rest } =
    props

  const formCtx = useContext(FormCtx)
  const update = useUpdate()
  const [explains, setExplains] = useState<string[]>([])

  const labelAttrs = {
    width: labelWidth ?? formCtx.labelWidth ?? 200,
    align: labelAlign ?? formCtx.labelAlign ?? 'left',
    suffix: labelSuffix ?? formCtx.labelSuffix ?? ''
  }
  const prefixCls = `${UI_PREFIX}-field`
  const wrapCls = cls(className, prefixCls, `${prefixCls}-align-${labelAttrs.align}`)

  const _form = form ?? formCtx.form
  if (!_form || !label)
    return (
      <div ref={propRef} className={wrapCls} {...rest}>
        {labelText && (
          <label className={`${prefixCls}-label`} style={{ width: labelAttrs.width }}>
            {labelText}
            {labelAttrs.suffix}
          </label>
        )}
        <div className={`${prefixCls}-control`}>
          <div className={`${prefixCls}-control-inner`}>{children}</div>
        </div>
      </div>
    )

  const controllerProps = _form.subscribe(label, {
    validators,
    onChange: update,
    onExplainsChange: setExplains
  })

  return (
    <div ref={propRef} className={wrapCls} {...rest}>
      {labelText && (
        <label className={`${prefixCls}-label`} style={{ width: labelAttrs.width }}>
          {labelText}
          {labelAttrs.suffix}
        </label>
      )}
      <div className={`${prefixCls}-control`}>
        <div className={`${prefixCls}-control-inner`}>
          {Children.map(children, child => (isValidElement(child) ? cloneElement(child, controllerProps) : child))}
        </div>
        <TransitionGroup component={null}>
          {Array.from(new Set(explains)).map(explain => (
            <Motion.Stretch key={explain} direction="bottom" mountOnEnter unmountOnExit>
              <div className={`${prefixCls}-explain`}>{explain}</div>
            </Motion.Stretch>
          ))}
        </TransitionGroup>
      </div>
    </div>
  )
}
_Field.displayName = 'Field'
export const Field = forwardRef(_Field)
