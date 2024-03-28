import { is, omit } from '@youknown/utils/src'
import type { SetStateAction } from 'react'
import { useState } from 'react'

import { useEvent } from './useEvent'
import type { FetchOptions } from './useFetch'
import { useFetch } from './useFetch'
import { useUpdateEffect } from './useUpdateEffect'

interface PaginationOptions<T, S> extends FetchOptions<T, S> {
  initialPage?: number
  initialPageSize?: number
}
interface PaginationData {
  total: number
  list: any[]
}

export function usePagination<T extends PaginationData, S extends any[]>(
  fetcher: (...args: S) => Promise<T>,
  opts: PaginationOptions<T, S> = {}
) {
  const [initialPage] = useState(() => opts.initialPage ?? 1)
  const [initialPageSize] = useState(() => opts.initialPageSize ?? 10)
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(0)

  const fetchOpts = omit(opts, 'initialPage', 'initialPageSize')
  const { run, ...rest } = useFetch(fetcher, {
    ...fetchOpts,
    onSuccess(data, params) {
      fetchOpts.onSuccess?.(data, params)
      setTotal(data.total)
    }
  })

  const changePage = useEvent((arg: SetStateAction<number>) => {
    if (is.function(arg)) {
      setPage(p => {
        const next = arg(p)
        return Math.max(1, next)
      })
    } else {
      setPage(Math.max(1, arg))
    }
  })
  const changePageSize = useEvent((arg: SetStateAction<number>) => {
    setPageSize(arg)
  })

  useUpdateEffect(() => {
    if (page && pageSize) {
      run()
    }
  }, [page, pageSize, run])

  return {
    pagination: {
      page,
      pageSize,
      total,
      changePage,
      changePageSize
    },
    run,
    ...rest
  }
}
