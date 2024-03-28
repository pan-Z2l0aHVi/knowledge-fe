import uuid from '../uuid'
import storage from './'

jest.useFakeTimers()

describe('storage', () => {
  global.URL.createObjectURL = jest.fn(() => 'uuid_key')

  const id = uuid()

  it('should use localStorage', () => {
    expect(storage.local.store).toBe(window.localStorage)
  })

  it('should use sessionStorage', () => {
    expect(storage.session.store).toBe(window.sessionStorage)
  })

  it('should set basic to string', () => {
    storage.local.set(id, true)
    expect(window.localStorage.getItem(id)).toBe('{"__value":true}')

    storage.local.set(id, 123)
    expect(window.localStorage.getItem(id)).toBe('{"__value":123}')
  })

  it('should set object to json', () => {
    storage.local.set(id, {})
    expect(window.localStorage.getItem(id)).toBe('{"__value":{}}')
  })

  it('should get original value', () => {
    storage.local.set(id, true)
    expect(storage.local.get(id)).toBe(true)

    storage.local.set(id, 0)
    expect(storage.local.get(id)).toBe(0)

    storage.local.set(id, null)
    expect(storage.local.get(id)).toBe(null)

    storage.local.set(id, 'xyz')
    expect(storage.local.get(id)).toBe('xyz')

    storage.local.set(id, { a: 123 })
    expect(storage.local.get(id)).toEqual({ a: 123 })

    storage.local.set(id, [1, 2, 3, 4])
    expect(storage.local.get(id)).toEqual([1, 2, 3, 4])
  })

  it('should remove item', () => {
    storage.local.set(id, true)
    storage.local.remove(id)
    expect(window.localStorage.getItem(id)).toBe(null)
  })

  it('should clear all', () => {
    storage.local.set('key1', true)
    storage.local.set('key2', [])
    storage.local.clear()
    expect(window.localStorage.getItem('key1')).toBe(null)
    expect(window.localStorage.getItem('key2')).toBe(null)
  })

  it('should expired', () => {
    storage.local.set('key', 123, 1000)
    jest.advanceTimersByTime(2000)
    expect(storage.local.get('key')).toBe(null)
  })

  it('should not expired.', () => {
    storage.local.set('key', 123, 3000)
    jest.advanceTimersByTime(2000)
    expect(storage.local.get('key')).toBe(123)
  })
})
