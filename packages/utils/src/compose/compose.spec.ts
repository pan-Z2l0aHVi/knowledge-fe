import { compose } from './'

describe('compose', () => {
  function shouting(str: string): string {
    return str + '!!!'
  }
  function doubt(str: string): string {
    return str + '???'
  }
  function crying(str: string): string {
    return str + '...'
  }

  it('should return a function', () => {
    expect(typeof compose()).toBe('function')

    expect(typeof compose(shouting)).toBe('function')

    expect(typeof compose(shouting, doubt, crying)).toBe('function')
  })

  it('should excision composed', () => {
    expect(compose()('hi')).toBe('hi')

    expect(compose(shouting)('hello')).toBe('hello!!!')

    expect(compose(shouting, doubt, crying)('wtf')).toEqual('wtf!!!???...')
  })
})
