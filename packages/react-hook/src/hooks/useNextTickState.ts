import { is } from '@youknown/utils/src'
import { useLayoutEffect, useRef, useState } from 'react'

type CallBackType<T> = (updatedValue: T) => void
type SetStateType<T> = T | ((prev: T) => T)
type RetType = <T>(initialState: T | (() => T)) => [T, (newState: SetStateType<T>, callback?: CallBackType<T>) => void]

export const useNextTickState: RetType = <T>(initialState: T | (() => T)) => {
  const [state, _setState] = useState<T>(initialState)
  const callbackQueue = useRef<CallBackType<T>[]>([])

  useLayoutEffect(() => {
    callbackQueue.current.forEach(cb => cb(state))
    callbackQueue.current = []
  }, [state])

  const setState = (newState: SetStateType<T>, callback?: CallBackType<T>) => {
    _setState(newState)
    if (callback && is.function(callback)) {
      callbackQueue.current.push(callback)
    }
  }
  return [state, setState]
}
