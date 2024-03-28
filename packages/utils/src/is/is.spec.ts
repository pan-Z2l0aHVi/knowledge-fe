import is from './'

describe('basic', () => {
  it('undefined is undefined', () => {
    expect(is.undefined(undefined)).toBe(true)
  })
  it('null is null', () => {
    expect(is.null(null)).toBe(true)
  })
  it('false is boolean', () => {
    expect(is.boolean(false)).toBe(true)
  })
  it('"abcd" is string', () => {
    expect(is.string('abcd')).toBe(true)
  })
  it('function is function', () => {
    expect(is.function((a: number, b: number) => a + b)).toBe(true)
  })
})

describe('array', () => {
  it('[] is array', () => {
    expect(is.array([])).toBe(true)
  })
  it('{} is not array', () => {
    expect(is.array({})).toBe(false)
  })
  it('should be empty', () => {
    expect(is.array.empty([])).toBe(true)
  })
  it('should be not empty', () => {
    expect(is.array.empty([1, 2, 3])).toBe(false)
    expect(is.array.empty('a')).toBe(false)
    expect(is.array.empty({})).toBe(false)
  })
})

describe('object', () => {
  it('null is not object', () => {
    expect(is.object(null)).toBe(false)
  })
  it('[] is not object', () => {
    expect(is.object([1, 2, 3])).toBe(false)
  })
  it('function is not object', () => {
    expect(is.object((a: number, b: number) => a + b)).toBe(false)
  })
  it('{} is object', () => {
    expect(is.object({})).toBe(true)
  })
  it('Object is object', () => {
    expect(is.object(Object.create(null))).toBe(true)
  })
  it('should be empty', () => {
    expect(is.object.empty({})).toBe(true)
  })
  it('should be not empty', () => {
    expect(is.object.empty(null)).toBe(false)
    expect(is.object.empty(undefined)).toBe(false)
    expect(is.object.empty([])).toBe(false)
    expect(is.object.empty({ a: 1 })).toBe(false)
  })
})

describe('all', () => {
  it('all undefined', () => {
    expect(is.all.undefined([undefined, undefined, undefined])).toBe(true)
  })
  it('all array', () => {
    expect(is.all.array([[], [1, 2], Array(1)])).toBe(true)
  })
})

is.all.object
