export function isBoolean(arg: unknown): arg is boolean {
  return typeof arg === 'boolean'
}

export function isAllBoolean(args: unknown[]): args is boolean[] {
  return args.every(isBoolean)
}
