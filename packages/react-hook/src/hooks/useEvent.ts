import { useMemo, useRef } from 'react'

type Fn = (this: any, ...args: any[]) => any
type PickFunction<T extends Fn> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>

export function useEvent<T extends Fn>(fn: T) {
  const fnRef = useRef<T>(fn)
  // why not write `fnRef.current = fn`?
  // https://github.com/alibaba/hooks/issues/728
  fnRef.current = useMemo(() => fn, [fn])
  const memoizedFn = useRef<PickFunction<T>>()
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args)
    }
  }
  return memoizedFn.current as T
}
