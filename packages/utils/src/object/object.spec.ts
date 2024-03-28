import { omit, pick } from './'

describe('use omit', () => {
  interface TestObj {
    a: number
    b: boolean
    c: string
    d: number[]
    e: {
      x: string
      y: string
    }
  }
  const obj: TestObj = {
    a: 1,
    b: true,
    c: 'qwer',
    d: [1, 2, 3],
    e: {
      x: 'xxx',
      y: 'yyy'
    }
  }

  it('should get keys', () => {
    expect(Object.keys(omit(obj, 'a'))).toStrictEqual(['b', 'c', 'd', 'e'])
    expect(Object.keys(omit(obj, 'a', 'b'))).toStrictEqual(['c', 'd', 'e'])
    expect(Object.keys(omit(obj, 'a', 'b', 'c'))).toStrictEqual(['d', 'e'])
    expect(Object.keys(omit(obj, 'a', 'b', 'c', 'd'))).toStrictEqual(['e'])
    expect(Object.keys(omit(obj, 'a', 'b', 'c', 'd', 'e'))).toStrictEqual([])
  })

  it('should get object', () => {
    expect(omit(obj, 'a')).toStrictEqual({
      b: true,
      c: 'qwer',
      d: [1, 2, 3],
      e: {
        x: 'xxx',
        y: 'yyy'
      }
    })
    expect(omit(obj, 'a', 'b')).toStrictEqual({
      c: 'qwer',
      d: [1, 2, 3],
      e: {
        x: 'xxx',
        y: 'yyy'
      }
    })
    expect(omit(obj, 'a', 'b', 'c')).toStrictEqual({
      d: [1, 2, 3],
      e: {
        x: 'xxx',
        y: 'yyy'
      }
    })
    expect(omit(obj, 'a', 'b', 'c', 'd')).toStrictEqual({
      e: {
        x: 'xxx',
        y: 'yyy'
      }
    })
    expect(omit(obj, 'a', 'b', 'c', 'd', 'e')).toStrictEqual({})
  })
})

describe('use pick', () => {
  interface TestObj {
    a: number
    b: boolean
    c: string
    d: number[]
    e: {
      x: string
      y: string
    }
  }
  const obj: TestObj = {
    a: 1,
    b: true,
    c: 'qwer',
    d: [1, 2, 3],
    e: {
      x: 'xxx',
      y: 'yyy'
    }
  }

  it('should get keys', () => {
    expect(Object.keys(pick(obj, 'a'))).toStrictEqual(['a'])
    expect(Object.keys(pick(obj, 'a', 'b'))).toStrictEqual(['a', 'b'])
    expect(Object.keys(pick(obj, 'a', 'b', 'c'))).toStrictEqual(['a', 'b', 'c'])
    expect(Object.keys(pick(obj, 'a', 'b', 'c', 'd'))).toStrictEqual(['a', 'b', 'c', 'd'])
    expect(Object.keys(pick(obj, 'a', 'b', 'c', 'd', 'e'))).toStrictEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('should get object', () => {
    expect(pick(obj, 'a')).toStrictEqual({
      a: 1
    })
    expect(pick(obj, 'a', 'b')).toStrictEqual({
      a: 1,
      b: true
    })
    expect(pick(obj, 'a', 'b', 'c')).toStrictEqual({
      a: 1,
      b: true,
      c: 'qwer'
    })
    expect(pick(obj, 'a', 'b', 'c', 'd')).toStrictEqual({
      a: 1,
      b: true,
      c: 'qwer',
      d: [1, 2, 3]
    })
    expect(pick(obj, 'a', 'b', 'c', 'd', 'e')).toStrictEqual({
      a: 1,
      b: true,
      c: 'qwer',
      d: [1, 2, 3],
      e: {
        x: 'xxx',
        y: 'yyy'
      }
    })
  })
})
