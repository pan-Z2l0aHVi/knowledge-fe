export function omit<T extends object, S extends keyof T>(obj: T, ...keys: S[]): Omit<T, S> {
  const clone = { ...obj }
  for (const key of keys) {
    delete clone[key]
  }
  return clone
}

export function pick<T extends object, S extends keyof T>(obj: T, ...keys: S[]): Pick<T, S> {
  return keys.reduce(
    (ret, key) => {
      if (key in obj) ret[key] = obj[key]
      return ret
    },
    {} as Pick<T, S>
  )
}
