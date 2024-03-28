import type { FormInstance } from '@youknown/react-hook/src'
import { createContext } from 'react'

export interface FormContext {
  form: FormInstance
  labelWidth: string | number
  labelAlign: 'top' | 'left' | 'right'
  labelSuffix: string
}
export const FormCtx = createContext<Partial<FormContext>>({})
