/* eslint-disable @typescript-eslint/ban-types */
export function isFunction(arg: unknown): arg is Function {
  return typeof arg === 'function'
}

export function isAllFunction(args: unknown[]): args is Function[] {
  return args.every(isFunction)
}
