import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export interface FetchOptions<T, S> {
  manual?: Ref<boolean>
  ready?: Ref<boolean>
  loadingDelay?: Ref<number>
  params?: Ref<S>
  onBefore?(params: S): void
  onSuccess?(data: T, params: S): void
  onError?(error: Error): void
  onFinally?(): void
}

export function useFetch<T, S extends any[]>(fetcher: (...args: S) => Promise<T>, opts?: FetchOptions<T, S>) {
  const {
    manual = ref(false),
    ready = ref(true),
    loadingDelay = ref(0),
    params = ref([]) as unknown as Ref<S>,
    onBefore,
    onSuccess,
    onError,
    onFinally
  } = opts ?? {}
  const data = ref<T>()
  const loading = ref(false)
  const error = ref<Error>()
  let timer = 0
  let reqCount = 0

  const cancel = () => {
    reqCount++
    loading.value = false
  }

  const run = () => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      loading.value = true
    }, loadingDelay.value)
    const currentCount = ++reqCount
    const currentParams = params.value
    onBefore?.(currentParams)

    return fetcher(...currentParams)
      .then(res => {
        if (currentCount === reqCount) {
          data.value = res
          onSuccess?.(res, currentParams)
        }
      })
      .catch(err => {
        if (currentCount === reqCount) {
          error.value = err
          onError?.(err)
        }
      })
      .finally(() => {
        if (currentCount === reqCount) {
          clearTimeout(timer)
          loading.value = false
          onFinally?.()
        }
      })
  }
  watch(
    [manual, ready],
    () => {
      if (!manual.value && ready.value) {
        run()
      }
    },
    {
      immediate: true
    }
  )
  return { data, error, loading, run, cancel }
}
