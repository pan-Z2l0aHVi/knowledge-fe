import { isUndefined } from './undefined'

export function isObject(arg: unknown): arg is Record<string, any> {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

export function isAllObject(args: unknown[]): args is Record<string, any>[] {
  return args.every(isUndefined)
}

export function isEmptyObject(obj: unknown): obj is Record<string, never> {
  if (!isObject(obj)) return false
  return !Object.keys(obj).length
}

export function isPlainObject(obj: unknown): boolean {
  if (!isObject(obj)) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}
