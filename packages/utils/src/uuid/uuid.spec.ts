import uuid from './'

describe('uuid', () => {
  global.URL.createObjectURL = jest.fn(() => 'c7cb72fd-1cb2-4cc7-8a44-a10d1e91743b')

  it('should return a string of length 36', () => {
    const result = uuid()
    expect(result).toHaveLength(36)
  })

  it('should return a valid UUID format', () => {
    const result = uuid()
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(uuidRegex.test(result)).toBe(true)
  })
})
