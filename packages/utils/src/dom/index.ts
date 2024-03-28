export function setRootStyle(styleObj: Record<string, string | null>) {
  const root = document.querySelector<HTMLElement>(':root')
  if (!root) return
  Object.entries(styleObj).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

export function pickDataAttrs<T extends object, K extends string & keyof T>(obj: T): Record<K, any> {
  const ret = {} as Record<K, any>
  if (obj)
    Object.keys(obj).forEach(key => {
      const k = String(key) as K
      if (k.startsWith('data-')) {
        ret[k] = obj[k]
      }
      if (k.startsWith('aria-')) {
        ret[k] = obj[k]
      }
    })
  return ret
}

export function parseSpacing(rootMargin?: string) {
  const defaultResult = { top: 0, right: 0, bottom: 0, left: 0 }
  if (!rootMargin) {
    return defaultResult
  }
  const margins = rootMargin.split(/\s+/).map(margin => parseInt(margin, 10))
  if (margins.length === 1) {
    const [top] = margins
    return { top, right: top, bottom: top, left: top }
  }
  if (margins.length === 2) {
    const [top, right] = margins
    return { top, right, bottom: top, left: right }
  }
  if (margins.length === 3) {
    const [top, right, bottom] = margins
    return { top, right, bottom, left: right }
  }
  if (margins.length === 4) {
    const [top, right, bottom, left] = margins
    return { top, right, bottom, left }
  }
  return defaultResult
}

export function checkElementInContainer(el: HTMLElement, container: HTMLElement | null, rootMargin?: string): boolean {
  const margin = parseSpacing(rootMargin)
  const { top, bottom } = el.getBoundingClientRect()
  if (!container) {
    const viewportHeight = (window.innerHeight || document.documentElement.clientHeight) + margin.top + margin.bottom

    return (top >= 0 && top <= viewportHeight) || (bottom >= 0 && bottom <= viewportHeight)
  } else {
    const containerRect = container.getBoundingClientRect()
    return top >= containerRect.top + margin.top && bottom <= containerRect.bottom + margin.bottom
  }
}

export function checkScrollbarVisible(el: HTMLElement, vertical = true): boolean {
  return vertical ? el.scrollHeight > el.clientHeight : el.scrollWidth > el.clientWidth
}

export function getViewportWidth(): number {
  return window.innerWidth || document.documentElement.clientWidth
}

export function getViewportHeight(): number {
  return window.innerHeight || document.documentElement.clientHeight
}
