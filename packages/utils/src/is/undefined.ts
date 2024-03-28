export function isUndefined(arg: unknown): arg is undefined {
  return typeof arg === 'undefined'
}

export function isAllUndefined(args: unknown[]): args is undefined[] {
  return args.every(isUndefined)
}
