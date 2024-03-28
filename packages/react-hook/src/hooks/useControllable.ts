import { is } from '@youknown/utils/src'
import type { SetStateAction } from 'react'
import { useRef, useState } from 'react'

import { useEvent } from './useEvent'
import { useUpdate } from './useUpdate'

interface Options<T> {
  defaultValue?: T
  defaultValuePropName?: string
  valuePropName?: string
  trigger?: string
}

type Props = Record<string, any>

interface StandardProps<T> {
  value: T
  defaultValue?: T
  onChange: (val: T) => void
}

export function useControllable<T = any>(props: StandardProps<T>): [T, (v: SetStateAction<T>) => void]
export function useControllable<T = any>(
  props?: Props,
  options?: Options<T>
): [T, (v: SetStateAction<T>, ...args: any[]) => void]
export function useControllable<T = any>(props: Props = {}, options: Options<T> = {}) {
  const { defaultValue, defaultValuePropName = 'defaultValue', valuePropName = 'value', trigger = 'onChange' } = options

  const value = props[valuePropName] as T
  const isControlled = props.hasOwnProperty(valuePropName) && !is.undefined(props[valuePropName])

  const [initialValue] = useState(() => {
    if (isControlled) {
      return value
    }
    if (props.hasOwnProperty(defaultValuePropName)) {
      return props[defaultValuePropName]
    }
    return defaultValue
  })

  const stateRef = useRef(initialValue)
  if (isControlled) {
    stateRef.current = value
  }

  const update = useUpdate()

  function setState(v: SetStateAction<T>, ...args: any[]) {
    const r = is.function(v) ? v(stateRef.current) : v

    if (!isControlled) {
      stateRef.current = r
      update()
    }
    if (props[trigger]) {
      props[trigger](r, ...args)
    }
  }

  return [stateRef.current, useEvent(setState)] as const
}
