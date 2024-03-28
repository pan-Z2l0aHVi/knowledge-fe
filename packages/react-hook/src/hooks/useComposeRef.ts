import type { MutableRefObject, Ref } from 'react'
import { useMemo } from 'react'

function fillRef<T>(ref: Ref<T>, node: T) {
  if (typeof ref === 'function') {
    ref(node)
  } else if (typeof ref === 'object' && ref && 'current' in ref) {
    ;(ref as MutableRefObject<T>).current = node
  }
}

export function composeRef<T>(...refs: Ref<T>[]): Ref<T> {
  const refList = refs.filter(ref => ref)
  if (refList.length <= 1) {
    return refList[0]
  }

  return (node: T) => {
    refs.forEach(ref => {
      fillRef(ref, node)
    })
  }
}

export function useComposeRef<T>(...refs: Ref<T>[]): Ref<T> {
  return useMemo(() => composeRef(...refs), refs)
}
