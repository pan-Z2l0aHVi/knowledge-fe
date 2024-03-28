import { omitNil } from '../object'
import path from '../path'

interface URLObject {
  base: string
  query: Record<string, any>
  hash: string
}
const defaultOpts: URLObject = {
  base: '',
  query: {},
  hash: ''
}
export default class QS {
  static stringify(opts: Partial<URLObject>, ignoreNil = true): string {
    const options = { ...defaultOpts, ...opts }
    const { base, hash } = options
    let { query } = options
    if (ignoreNil) {
      query = omitNil(query)
    }
    const queryKeys = Object.keys(query)
    if (!queryKeys.length) {
      return base + hash
    }
    const prefix = base.includes('?') ? '&' : '?'
    const search = queryKeys
      .reduce((pre, key, i) => {
        const encodedKey = encodeURIComponent(key)
        const encodedVal = encodeURIComponent(query[key])
        return `${pre}${i ? '&' : ''}${encodedKey}=${encodedVal}`
      }, prefix)
      .trim()
    return base + search + hash
  }

  static parse(url = ''): URLObject {
    const isOnlyPath = !url.startsWith('http')
    if (isOnlyPath) {
      url = `http://${path.join('placeholder', url)}`
    }
    try {
      const { origin, pathname, searchParams, hash } = new URL(url)
      const base = isOnlyPath ? pathname : `${origin}${pathname}`
      const query: URLObject['query'] = {}
      for (const [key, val] of searchParams.entries()) {
        query[decodeURIComponent(key)] = decodeURIComponent(val)
      }
      return {
        base,
        query,
        hash
      }
    } catch (err) {
      return {
        base: '',
        query: {},
        hash: ''
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  static delete() {}
}
