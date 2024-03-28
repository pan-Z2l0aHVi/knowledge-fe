import { usePagination } from '@youknown/react-hook/src'
import { Button, Space } from '@youknown/react-ui/src'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'

const LIST_TOTAL = 204
const allList = Array.from(Array(LIST_TOTAL)).map((_, index) => ({
  id: index,
  content: `${index + 1}----${100 + Math.random() * 100}`
}))

function mockFetchPaginationWithTotal(params: { page: number; page_size: number }): Promise<{
  total: number
  list: {
    id: number
    content: string
  }[]
}> {
  return new Promise(resolve => {
    const span = 2000 * Math.random()
    setTimeout(() => {
      const { page, page_size } = params
      const total = allList.length
      const begin = (page - 1) * page_size
      const list = allList.slice(begin, begin + page_size)
      const data = {
        total: total,
        list: list
      }
      resolve(data)
      console.warn('Fake fetch list', `${Math.round(span)}ms`, params, data)
    }, span)
  })
}

export default () => {
  const fetcher = (): ReturnType<typeof mockFetchPaginationWithTotal> =>
    mockFetchPaginationWithTotal({
      page,
      page_size: pageSize
    })

  const { pagination, data, loading, run: do_fetch } = usePagination(fetcher)
  const { page, pageSize, changePage } = pagination
  return (
    <>
      <Button onClick={do_fetch}>Request</Button>
      <div className="pt-24px">
        {loading ? (
          <div>loading...</div>
        ) : (
          <div>
            {data?.list.map(item => {
              return <div key={item.id}>{item.content}</div>
            })}
          </div>
        )}
        <Space className="mt-16px" align="center">
          <Button
            square
            onClick={() => {
              changePage(p => p - 1)
            }}
          >
            <MdOutlineArrowBackIos />
          </Button>
          <span className="min-w-40px text-center">{page}</span>
          <Button
            square
            onClick={() => {
              changePage(p => p + 1)
            }}
          >
            <MdOutlineArrowForwardIos />
          </Button>
        </Space>
      </div>
    </>
  )
}
