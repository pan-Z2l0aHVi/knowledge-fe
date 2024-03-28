import { useInfinity } from '@youknown/react-hook/src'
import { Button, Divider, List } from '@youknown/react-ui/src'
import { useRef } from 'react'

const LIST_TOTAL = 204
const allList = Array.from(Array(LIST_TOTAL)).map((_, index) => ({
  id: index,
  content: `${index + 1}----${100 + Math.random() * 100}`
}))

function mockFetchInfinity(params: { page: number; page_size: number }): Promise<
  {
    id: number
    content: string
  }[]
> {
  return new Promise(resolve => {
    const span = 2000 * Math.random()
    setTimeout(() => {
      const { page, page_size } = params
      const begin = (page - 1) * page_size
      const list = allList.slice(begin, begin + page_size)
      resolve(list)
      console.warn('Fake fetch list', `${Math.round(span)}ms`, params, list)
    }, span)
  })
}

function ClickLoadMore() {
  const fetcher = (): ReturnType<typeof mockFetchInfinity> =>
    mockFetchInfinity({
      page,
      page_size: pageSize
    })

  const { page, pageSize, data, loading, noMore, loadMore } = useInfinity(fetcher)
  return (
    <>
      <div className="pt-24px">
        {data.length > 0 && (
          <List size="large">
            {data.map(item => {
              return <List.Item key={item.id}>{item.content}</List.Item>
            })}
          </List>
        )}
        <div className="mt-8px mb-8px">{loading ? <div>loading...</div> : noMore ? '-- No more --' : ''}</div>
        <Button onClick={loadMore}>Load more</Button>
      </div>
    </>
  )
}

function ToLowerLoadMore() {
  const fetcher = (): ReturnType<typeof mockFetchInfinity> =>
    mockFetchInfinity({
      page,
      page_size: pageSize
    })

  const containerRef = useRef(null)
  const lowerRef = useRef(null)
  const { page, pageSize, data, loading, noMore, reload } = useInfinity(fetcher, {
    initialPageSize: 50,
    target: lowerRef,
    observerInit: {
      root: containerRef.current,
      rootMargin: '0px 0px 100px 0px'
    }
  })

  return (
    <>
      <Button onClick={reload}>Reload</Button>
      <div ref={containerRef} className="h-400px overflow-auto">
        {data.length > 0 && (
          <List size="large">
            {data.map(item => {
              return <List.Item key={item.id}>{item.content}</List.Item>
            })}
          </List>
        )}
        <div ref={lowerRef} className="h-32px line-height-32px text-center">
          {loading ? <div>loading...</div> : noMore ? '-- No more --' : ''}
        </div>
      </div>
    </>
  )
}

export default () => {
  return (
    <>
      <ToLowerLoadMore />
      <Divider />
      <ClickLoadMore />
    </>
  )
}
