export function isNumber(arg: unknown): arg is number {
  return typeof arg === 'number'
}

export function isAllNumber(args: unknown[]): args is number[] {
  return args.every(isNumber)
}
