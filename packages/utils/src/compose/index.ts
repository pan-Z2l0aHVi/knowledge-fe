export type Fn = (...s: any[]) => any
export function compose(...fns: Fn[]): Fn {
  if (fns.length === 0) return <T>(s: T): T => s
  if (fns.length === 1) return fns[0]
  return fns.reduceRight(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  )
}

export type Next = () => Promise<void>
export type Middleware<T = any> = (ctx: T, next: Next) => Promise<void>
export function asyncCompose<T>(middlewares: Middleware<T>[]) {
  if (!Array.isArray(middlewares)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middlewares) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  return function (ctx: T, next?: Next) {
    // last called middleware #
    let index = -1
    function dispatch(i: number): Promise<void> {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn: Middleware<T> | undefined = middlewares[i]
      if (i === middlewares.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}
