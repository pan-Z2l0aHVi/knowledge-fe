import { checkElementInContainer } from '@youknown/utils/src'
import type { Ref } from 'vue'
import { computed, nextTick, ref } from 'vue'

import { omit } from '@/utils/object'

import type { FetchOptions } from './useFetch'
import { useFetch } from './useFetch'
import useIntersection from './useIntersection'

interface InfinityOptions<T, S> extends FetchOptions<T, S> {
  initialPage?: number
  initialPageSize?: number
  target?: Ref<HTMLElement | null>
  observerInit?: () => IntersectionObserverInit
}

export function useInfinity<T extends any[], S extends any[]>(
  fetcher: (...args: S) => Promise<T>,
  opts: InfinityOptions<T, S> = {}
) {
  const { initialPage = 1, initialPageSize = 10, target, observerInit, ready = ref(true) } = opts
  const page = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const noMore = ref(false)
  const data = ref([]) as unknown as Ref<T>

  const isIntersecting = useIntersection(target, observerInit)

  const fetchReady = computed(() => {
    if (target) {
      return ready.value && isIntersecting.value
    }
    return ready.value
  })

  const fetchOpts = omit(opts, 'initialPage', 'initialPageSize', 'target', 'observerInit', 'ready')
  const fetchResult = useFetch(fetcher, {
    ...fetchOpts,
    ready: fetchReady,
    onSuccess(res, params) {
      if (noMore.value) {
        return
      }
      fetchOpts.onSuccess?.(res, params)
      if (page.value <= initialPage) {
        data.value = res
      } else {
        data.value = [...data.value, ...res] as T
      }
      if (res.length < pageSize.value) {
        noMore.value = true
      } else {
        page.value++
      }

      if (target)
        nextTick(() => {
          const targetEle = target.value
          const container = (observerInit?.().root as HTMLElement) ?? null
          const rootMargin = observerInit?.().rootMargin ?? ''
          if (targetEle) {
            const notEnough = checkElementInContainer(targetEle, container, rootMargin)
            if (notEnough) {
              run()
            }
          }
        })
    }
  })
  const { run, ...rest } = omit(fetchResult, 'data')

  const reload = () => {
    page.value = initialPage
    pageSize.value = initialPageSize
    noMore.value = false
    data.value = data.value.slice(0, initialPage * initialPageSize) as T
    nextTick(() => {
      if (target?.value) {
        const root = observerInit?.().root
        if (root instanceof HTMLElement) {
          root.scrollTo(0, 0)
        }
        run()
      }
    })
  }

  return {
    data,
    page,
    pageSize,
    noMore,
    loadMore: run,
    reload,
    ...rest
  }
}
