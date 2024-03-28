import type { Ref } from 'vue'
import { ref, watchPostEffect } from 'vue'

/**
 * @param target
 */
export default function useIntersection(
  target?: Ref<HTMLElement | null>,
  observerInit?: () => IntersectionObserverInit
) {
  const isIntersection = ref(false)
  watchPostEffect(onCleanup => {
    if (!target?.value) return

    const observe = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        isIntersection.value = entry.isIntersecting
      })
    }, observerInit?.())
    const currentTarget = target.value
    observe.observe(currentTarget)
    onCleanup(() => {
      observe.unobserve(currentTarget)
    })
  })

  return isIntersection
}
