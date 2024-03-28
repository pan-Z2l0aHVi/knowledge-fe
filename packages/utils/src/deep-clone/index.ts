type Primitive = string | number | boolean | symbol | null | undefined

function isObject(obj: unknown): obj is object {
  return typeof obj === 'object' && obj !== null
}

function isPrimitive(value: unknown): value is Primitive {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'symbol' ||
    value === null ||
    value === undefined
  )
}

export function deepClone<T>(obj: T, cache = new WeakMap<any, any>()): T {
  if (!isObject(obj) || isPrimitive(obj)) {
    return obj
  }

  if (cache.has(obj)) {
    return cache.get(obj)
  }

  let clonedObj: any

  if (Array.isArray(obj)) {
    clonedObj = [] as any
    cache.set(obj, clonedObj)
    obj.forEach((item: any, index: number) => {
      clonedObj[index] = deepClone(item, cache)
    })
  } else {
    clonedObj = {} as any
    cache.set(obj, clonedObj)
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key], cache)
      }
    }
  }

  return clonedObj as T
}
