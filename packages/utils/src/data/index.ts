export function obj2FormData(obj: Record<string, any>): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        formData.append(`${key}[]`, value[i])
      }
    } else {
      formData.append(key, value)
    }
  }
  return formData
}

export function equal(a: unknown, b: unknown): boolean {
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true
  }
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) {
    return a === b
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, index) => equal(item, b[index]))
  }
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(
    key => b.hasOwnProperty(key) && equal((a as Record<string, any>)[key], (b as Record<string, any>)[key])
  )
}

export function headers2Obj(headers: Headers): HeadersInit {
  const headersInit: HeadersInit = {}
  headers.forEach((val, key) => {
    headersInit[key] = val
  })
  return headersInit
}
