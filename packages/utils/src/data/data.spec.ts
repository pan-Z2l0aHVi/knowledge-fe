import { equal, obj2FormData } from './'

describe('objectToFormData', () => {
  test('should convert object to FormData', () => {
    const obj = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'playing'],
      avatar: new File(['file contents'], 'avatar.jpg')
    }

    const formData = obj2FormData(obj)

    // 验证 FormData 中包含了正确的属性和值
    expect(formData.get('name')).toBe('John')
    expect(formData.get('age')).toBe('25')
    expect(formData.getAll('hobbies[]')).toEqual(['reading', 'playing'])
    expect(formData.get('avatar')).toBeInstanceOf(File)
  })
})

describe('test value equality judgment', () => {
  it('should undefined be equal', () => {
    expect(equal(undefined, undefined)).toBe(true)
  })

  it('should null be equal', () => {
    expect(equal(null, null)).toBe(true)
  })

  it('should boolean be equal', () => {
    expect(equal(true, true)).toBe(true)
  })

  it('should boolean not be equal', () => {
    expect(equal(true, false)).toBe(false)
  })

  it('should number be equal', () => {
    expect(equal(999, 999)).toBe(true)
  })

  it('should number not be equal', () => {
    expect(equal(123, 456)).toBe(false)
  })

  it('should string be equal', () => {
    expect(equal('xyz', 'xyz')).toBe(true)
  })

  it('should string not be equal', () => {
    expect(equal('xyz', 'qwer')).toBe(false)
  })
})

describe('test reference equality judgment', () => {
  it('should array reference not be equal', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]
    expect(arr1 === arr2).toBe(false)
  })

  it('should array value not be equal', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]
    expect(equal(arr1, arr2)).toBe(true)
  })

  it('should array nested be equal', () => {
    const arr1 = [1, 2, [3, [4]]]
    const arr2 = [1, 2, [3, [4]]]
    expect(equal(arr1, arr2)).toBe(true)
  })

  it('should array nested not be equal', () => {
    const arr1 = [1, 2, [3, [4]]]
    const arr2 = [1, 2, [3, 4]]
    expect(equal(arr1, arr2)).toBe(false)
  })

  it('should object reference not be equal', () => {
    const obj1 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: null
    }
    const obj2 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: null
    }
    expect(obj1 === obj2).toBe(false)
  })

  it('should object value be equal', () => {
    const obj1 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: null
    }
    const obj2 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: null
    }
    expect(equal(obj1, obj2)).toBe(true)
  })

  it('should object value not be equal', () => {
    const obj1 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: null
    }
    const obj2 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: undefined
    }
    expect(equal(obj1, obj2)).toBe(false)
  })

  it('should object nested value be equal', () => {
    const obj1 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: {
        x: 123,
        y: [1, 2, 3],
        z: {
          q: false,
          w: true,
          e: 'xyz',
          r: []
        }
      }
    }
    const obj2 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: {
        x: 123,
        y: [1, 2, 3],
        z: {
          q: false,
          w: true,
          e: 'xyz',
          r: []
        }
      }
    }
    expect(equal(obj1, obj2)).toBe(true)
  })

  it('should object nested value not be equal', () => {
    const obj1 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: {
        x: 123,
        y: [1, 2, 3],
        z: {
          q: false,
          w: true,
          e: 'xyz',
          r: []
        }
      }
    }
    const obj2 = {
      a: false,
      b: 123,
      c: 'xyz',
      d: {
        x: 123,
        y: [1, 2, 3],
        z: {
          q: false,
          w: true,
          e: 'xyz',
          r: ['diff']
        }
      }
    }
    expect(equal(obj1, obj2)).toBe(false)
  })
})

describe('special situation', () => {
  it('should NaN native not be equal', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(NaN === NaN).toBe(false)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(NaN == NaN).toBe(false)
  })

  it('should NaN value be equal', () => {
    expect(equal(NaN, NaN)).toBe(true)
  })
})
