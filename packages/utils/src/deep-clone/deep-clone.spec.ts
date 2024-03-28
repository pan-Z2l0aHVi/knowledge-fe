import { deepClone } from './'

describe('deepClone', () => {
  it('should perform deep cloning', () => {
    const obj1 = {
      name: 'John',
      age: 30,
      address: {
        city: 'New York',
        country: 'USA'
      },
      hobbies: ['reading', 'swimming']
    }

    const obj2 = deepClone(obj1)

    // 修改拷贝后的对象，不影响原始对象
    obj2.name = 'Jane'
    obj2.address.city = 'San Francisco'
    obj2.hobbies.push('running')

    expect(obj1).toEqual({
      name: 'John',
      age: 30,
      address: {
        city: 'New York',
        country: 'USA'
      },
      hobbies: ['reading', 'swimming']
    })

    expect(obj2).toEqual({
      name: 'Jane',
      age: 30,
      address: {
        city: 'San Francisco', // 拷贝后的对象中的 address.city 修改了，但原始对象不变
        country: 'USA'
      },
      hobbies: ['reading', 'swimming', 'running'] // 拷贝后的对象中的 hobbies 数组增加了元素，但原始对象不变
    })
  })

  it('should handle circular references', () => {
    const obj1: any = { name: 'John' }
    obj1.selfReference = obj1 // 添加循环引用

    const obj2 = deepClone(obj1)

    expect(obj2).toEqual({
      name: 'John',
      selfReference: expect.any(Object) // 循环引用应该被处理为一个对象，而不是引用自身
    })
    expect(obj2.selfReference).toBe(obj2) // 对象中的循环引用应该指向对象本身
  })

  it('should handle primitives', () => {
    expect(deepClone('Hello')).toBe('Hello') // 字符串是基本类型，不会被深拷贝
    expect(deepClone(42)).toBe(42) // 数字是基本类型，不会被深拷贝
    expect(deepClone(true)).toBe(true) // 布尔值是基本类型，不会被深拷贝
    expect(deepClone(null)).toBe(null) // null 是基本类型，不会被深拷贝
    expect(deepClone(undefined)).toBe(undefined) // undefined 是基本类型，不会被深拷贝
  })
})
