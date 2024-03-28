interface TransitionHelperOptions {
  skipTransition?: boolean
  classNames?: string
  updateDOM: () => void
}
export function transitionHelper({ skipTransition = false, classNames = '', updateDOM }: TransitionHelperOptions) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => undefined)

    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      domUpdated: updateCallbackDone,
      updateCallbackDone,
      finished: updateCallbackDone
    }
  }

  const classNamesArray = classNames.split(/\s+/g).filter(Boolean)

  document.documentElement.classList.add(...classNamesArray)

  const transition = document.startViewTransition(updateDOM)

  transition.finished.finally(() => document.documentElement.classList.remove(...classNamesArray))

  return transition
}
