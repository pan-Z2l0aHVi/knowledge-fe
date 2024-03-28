interface Resp<T> {
  code: number
  msg: string
  data: T
}

const LIST_TOTAL = 204
const allList = Array.from(Array(LIST_TOTAL)).map((_, index) => ({
  id: index,
  content: `${index + 1}----${100 + Math.random() * 100}`
}))

export function fetchListWithTotal(params: { page: number; page_size: number }): Promise<
  Resp<{
    total: number
    list: {
      id: number
      content: string
    }[]
  }>
> {
  return new Promise(resolve => {
    const span = 50 + 200 * Math.random()
    setTimeout(() => {
      const { page, page_size } = params
      const total = allList.length
      const begin = (page - 1) * page_size
      const list = allList.slice(begin, begin + page_size)
      const res = {
        code: 0,
        msg: '',
        data: {
          total: total,
          list: list
        }
      }
      resolve(res)
      console.warn('Fake fetch list', `${Math.round(span)}ms`, params, res.data)
    }, span)
  })
}

export function mockFetchList(params: { page: number; page_size: number }): Promise<
  {
    id: number
    content: string
  }[]
> {
  return new Promise(resolve => {
    const span = 50 + 200 * Math.random()
    setTimeout(() => {
      const { page, page_size } = params
      const begin = (page - 1) * page_size
      const list = allList.slice(begin, begin + page_size)
      resolve(list)
      console.warn('Fake fetch list', `${Math.round(span)}ms`, params, list)
    }, span)
  })
}
