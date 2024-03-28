export function isString(arg: unknown): arg is string {
  return typeof arg === 'string'
}

export function isAllString(args: unknown[]): args is string[] {
  return args.every(isString)
}
