import { QS } from '../'

describe('qs parse', () => {
  it('should parse hash', () => {
    expect(QS.parse('https://developer.mozilla.org/en-US/docs/Web/API/URL/URL#specifications')).toEqual({
      base: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL',
      query: {},
      hash: '#specifications'
    })
    expect(QS.parse('https://www.deepl.com/en/translator#en/zh/placeholder')).toEqual({
      base: 'https://www.deepl.com/en/translator',
      query: {},
      hash: '#en/zh/placeholder'
    })
  })
  it('should parse query', () => {
    expect(QS.parse('https://segmentfault.com/search?q=xyz&w=123&e=aaa')).toEqual({
      base: 'https://segmentfault.com/search',
      query: {
        q: 'xyz',
        w: '123',
        e: 'aaa'
      },
      hash: ''
    })
  })
  it('should parse only path', () => {
    expect(QS.parse('/search?q=xyz&w=123&e=aaa#heading-1')).toEqual({
      base: '/search',
      query: {
        q: 'xyz',
        w: '123',
        e: 'aaa'
      },
      hash: '#heading-1'
    })
  })
  it('should decode query', () => {
    expect(
      QS.parse('https://developer.mozilla.org/en-US/docs/Web/API/URL/URL?%E9%94%AE1=%E5%80%BC1&%E9%94%AE2=%E5%80%BC2')
    ).toEqual({
      base: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL',
      query: {
        键1: '值1',
        键2: '值2'
      },
      hash: ''
    })
  })
})

describe('qs stringify', () => {
  it('should receive optional arguments', () => {
    expect(
      QS.stringify({
        base: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL'
      })
    ).toBe('https://developer.mozilla.org/en-US/docs/Web/API/URL/URL')
    expect(
      QS.stringify({
        base: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL',
        query: {
          q: 'xyz',
          w: '123',
          e: 'aaa'
        }
      })
    ).toBe('https://developer.mozilla.org/en-US/docs/Web/API/URL/URL?q=xyz&w=123&e=aaa')
    expect(
      QS.stringify({
        base: 'https://www.deepl.com/en/translator',
        hash: '#en/zh/placeholder'
      })
    ).toBe('https://www.deepl.com/en/translator#en/zh/placeholder')
  })
  it('should stringify', () => {
    expect(
      QS.stringify({
        base: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL',
        query: {
          q: 'xyz',
          w: '123',
          e: 'aaa'
        },
        hash: '#specifications'
      })
    ).toBe('https://developer.mozilla.org/en-US/docs/Web/API/URL/URL?q=xyz&w=123&e=aaa#specifications')
  })
  it('should encode query', () => {
    expect(
      QS.stringify({
        base: 'https://developer.mozilla.org/en-US/docs/Web/API/URL/URL',
        query: {
          键1: '值1',
          键2: '值2'
        },
        hash: ''
      })
    ).toBe('https://developer.mozilla.org/en-US/docs/Web/API/URL/URL?%E9%94%AE1=%E5%80%BC1&%E9%94%AE2=%E5%80%BC2')
  })
})
