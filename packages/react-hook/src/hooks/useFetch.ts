import type { DependencyList } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useEvent } from './useEvent'

export interface FetchOptions<T, S> {
  initialData?: T
  manual?: boolean
  ready?: boolean
  loadingDelay?: number
  refreshDeps?: DependencyList
  params?: S
  onBefore?(params: S): Promise<void | boolean>
  onSuccess?(data: T, params: S): void
  onError?(error: Error, params: S): void
  onFinally?(params: S): void
}

export function useFetch<T, S extends any[]>(fetcher: (...args: S) => Promise<T>, opts: FetchOptions<T, S> = {}) {
  const {
    manual = false,
    ready = true,
    loadingDelay = 0,
    params = [],
    refreshDeps = [],
    onBefore,
    onSuccess,
    onError,
    onFinally
  } = opts

  const [data, setData] = useState(() => opts.initialData)
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(false)
  const fetchCount = useRef(0)

  const run = useEvent(async () => {
    const currentParams = params as S
    const isBreak = (await onBefore?.(currentParams)) ?? false
    if (isBreak) {
      return
    }
    fetchCount.current++
    const currentCount = fetchCount.current
    const loadingTimer = setTimeout(() => {
      setLoading(true)
    }, loadingDelay)

    return fetcher(...currentParams)
      .then(res => {
        if (fetchCount.current !== currentCount) return
        setData(res)
        onSuccess?.(res, currentParams)
      })
      .catch((err: Error) => {
        if (fetchCount.current !== currentCount) return
        setError(err)
        onError?.(err, currentParams)
      })
      .finally(() => {
        clearTimeout(loadingTimer)
        if (fetchCount.current !== currentCount) return
        setLoading(false)
        onFinally?.(currentParams)
      })
  })

  const cancel = () => {
    fetchCount.current++
    setLoading(false)
  }

  useEffect(() => {
    if (!manual && ready) {
      run()
    }
  }, [manual, ready, run, ...refreshDeps])

  return { data, error, loading, run, cancel, mutate: setData }
}
