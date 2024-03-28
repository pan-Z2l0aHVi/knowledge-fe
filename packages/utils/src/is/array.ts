export function isArray(arg: unknown): arg is any[] {
  return Array.isArray(arg)
}

export function isAllArray(args: unknown[]): args is any[][] {
  return args.every(isArray)
}

export function isEmptyArray(arr: unknown): arr is [] {
  if (!isArray(arr)) return false
  return arr.length === 0
}
