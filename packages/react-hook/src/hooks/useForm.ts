import type { ValueOf } from '@youknown/utils/src'
import { is } from '@youknown/utils/src'
import type { ChangeEvent, FormEventHandler } from 'react'
import { useRef, useState } from 'react'

import { useEvent } from './useEvent'

type controllerChangeEvent = ChangeEvent<HTMLSelectElement | HTMLInputElement>
interface State {
  [key: string]: any
}
interface FieldOptions<S> {
  onChange?(arg: ValueOf<S> | controllerChangeEvent): void
  validators?: ((value: S) => Promise<string | void>)[]
  onExplainsChange?(explains: string[]): void
}
interface Field<S> {
  label: keyof S
  options: FieldOptions<S>
}
interface Options<S> {
  defaultState: S
  onFulfilled?(state: S): void
  onFailed?(explainsMap: Record<keyof S, string[]>): void
  onStateChange?(org: Field<S>): void
}
interface FieldController<S> {
  defaultValue?: ValueOf<S>
  value?: ValueOf<S>
  onChange(arg: ValueOf<S> | controllerChangeEvent): void
}
export interface FormInstance<S = any> {
  submit(): void
  getState(): S
  setState(state: Partial<S>): void
  onSubmit: FormEventHandler<Element>
  subscribe(label: keyof S, options?: FieldOptions<S>): FieldController<S>
  unsubscribe(label: keyof S): void
  reset(): void
  validate(...labels: (keyof S)[]): Promise<Record<keyof S, string[]>>
}

export function useForm<S extends State>(opts: Options<S>): FormInstance<S> {
  const [defaultState] = useState(() => opts.defaultState)
  // shallow copy
  const state = useRef<S>({ ...defaultState })
  const fields = useRef<Field<S>[]>([])
  const controllerMap = useRef<Partial<Record<keyof S, any>>>({})

  const getState = useEvent(() => state.current)

  const setState = useEvent((newState: Partial<S>) => {
    fields.current.forEach(field => {
      Object.entries(newState).forEach(([key, value]) => {
        if (key === field.label) {
          const controller = controllerMap.current[key]
          controller?.onChange(value)
        }
      })
    })
  })

  const reset = useEvent(() => {
    setState(defaultState)
  })

  const submit = useEvent(async () => {
    const explainsMap = await validate()
    const isValid = !Object.values(explainsMap).flat().length
    if (isValid) {
      opts.onFulfilled?.(state.current)
    } else {
      opts.onFailed?.(explainsMap)
    }
  })

  const onSubmit: FormEventHandler = useEvent(event => {
    event.preventDefault()
    event.stopPropagation()
    submit()
  })

  const subscribe = useEvent((label: keyof S, options: FieldOptions<S>) => {
    const field: Field<S> = { label, options }
    const index = fields.current.findIndex(field => field.label === label)
    if (index > -1) {
      fields.current.splice(index, 1, field)
    } else {
      fields.current.push(field)
    }
    const controller: FieldController<S> = {
      onChange(arg) {
        let val = arg
        if ((arg as controllerChangeEvent)?.nativeEvent instanceof Event)
          val = (arg as controllerChangeEvent).target.value as ValueOf<S>

        state.current[label] = val as ValueOf<S>
        opts.onStateChange?.(field)
        options.onChange?.(val)
        validateField(field)
      }
    }

    if (is.undefined(state.current[label])) {
      controller.defaultValue = defaultState[label]
    } else {
      controller.value = state.current[label]
    }
    controllerMap.current[label] = controller
    return controller
  })

  const unsubscribe = useEvent((label: keyof S) => {
    fields.current = fields.current.filter(field => field.label !== label)
    delete controllerMap.current[label]
  })

  const validateField = useEvent(async (field: Field<S>) => {
    const { validators = [] } = field.options
    const results = await Promise.allSettled(
      validators.map(validator => {
        const value = getState()[field.label]
        return validator(value)
      })
    )
    const explains = results
      .map<string>(res => {
        if (res.status === 'rejected') {
          return res.reason
        }
        return ''
      })
      .filter(Boolean)
    field.options.onExplainsChange?.(explains)
    return explains
  })

  const validate = useEvent(async (...labels: (keyof S)[]) => {
    const isValidateAll = is.array.empty(labels)
    const toBeVerifiedFields = isValidateAll
      ? fields.current
      : fields.current.filter(field => labels.includes(field.label))
    const result = {} as Record<keyof S, string[]>
    for (const field of toBeVerifiedFields) {
      const explains = await validateField(field)
      result[field.label] = explains
    }
    return result
  })

  const [form] = useState({
    submit,
    getState,
    setState,
    onSubmit,
    subscribe,
    unsubscribe,
    reset,
    validate
  })
  return form
}
