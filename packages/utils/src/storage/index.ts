import is from '../is'

function now(): number {
  return new Date().getTime()
}

interface Pkg<T> {
  __value: T
  __expireTime?: number
}

class Storage {
  public store: globalThis.Storage
  constructor(type: 'local' | 'session') {
    this.store = window[`${type}Storage`]
  }

  public get<T = string>(key: string): T | null {
    const val = this.store.getItem(key)
    if (is.null(val)) {
      return null
    }
    try {
      const pkg: Pkg<T> = JSON.parse(val)
      if (!pkg.__expireTime) {
        return pkg.__value
      }
      if (now() < pkg.__expireTime) {
        return pkg.__value
      }
      this.remove(key)
      return null
    } catch (err) {
      return val as T
    }
  }

  public set<T>(key: string, val: T, expiration?: number) {
    const pkg: Pkg<T> = { __value: val }
    if (expiration) {
      Object.assign(pkg, {
        __expireTime: now() + expiration
      })
    }
    this.store.setItem(key, JSON.stringify(pkg))
  }

  public remove(key: string) {
    this.store.removeItem(key)
  }

  public clear() {
    this.store.clear()
  }
}

export default {
  local: new Storage('local'),
  session: new Storage('session')
}
