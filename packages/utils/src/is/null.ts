export function isNull(arg: unknown): arg is null {
  return arg === null
}

export function isAllNull(args: unknown[]): args is null[] {
  return args.every(isNull)
}
