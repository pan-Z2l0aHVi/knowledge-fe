import cls from './'

describe('cls type', () => {
  it('should be a function', () => {
    expect(typeof cls).toBe('function')
  })

  it('should return string', () => {
    expect(typeof cls()).toBe('string')
  })
})

describe('use cls to get classes', () => {
  it('receive strings (variadic)', () => {
    expect(cls('foo', true && 'bar', 'baz')).toBe('foo bar baz')
  })

  it('receive objects', () => {
    const isTrue = () => true
    expect(cls({ foo: true, bar: false, baz: isTrue() })).toBe('foo baz')
  })

  it('receive objects (variadic)', () => {
    expect(cls({ foo: true }, { bar: false }, null, { '--foobar': 'hello' })).toBe('foo --foobar')
  })

  it('receive arrays', () => {
    expect(cls(['foo', 0, false, 'bar'])).toBe('foo bar')
  })

  it('receive arrays (variadic)', () => {
    expect(cls(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]])).toBe('foo bar baz hello there')
  })

  it('receive kitchen sink (with nesting)', () => {
    expect(cls('foo', [1 && 'bar', { baz: false, bat: null }, ['hello', ['world']]], 'cya')).toBe(
      'foo bar hello world cya'
    )
  })
})
