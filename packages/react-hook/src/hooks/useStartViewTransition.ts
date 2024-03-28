import { flushSync } from 'react-dom'

export function useStartViewTransition(): (updateDOM: () => void) => ReturnType<typeof document.startViewTransition> {
  return updateDOM => {
    if (!document.startViewTransition) {
      const updateCallbackDone = Promise.resolve(updateDOM())
      return {
        ready: Promise.reject(Error('View transitions unsupported')),
        skipTransition: () => true,
        updateCallbackDone,
        finished: updateCallbackDone
      }
    }
    return document.startViewTransition(() => {
      flushSync(updateDOM)
    })
  }
}
