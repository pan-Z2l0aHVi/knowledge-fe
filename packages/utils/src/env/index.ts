export function checkIOS(): boolean {
  const ua = navigator.userAgent
  return !!ua.match(/(iPhone|iPad|iPod|iOS)/i)
}

export function checkAndroid(): boolean {
  const ua = navigator.userAgent
  return !!ua.match(/(Android)/i)
}

export function checkPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
}

export function checkHoverSupported(): boolean {
  return window.matchMedia('(hover: hover)').matches
}

export function checkTouchable(): boolean {
  return 'ontouchstart' in window || !!navigator.maxTouchPoints
}

export function checkMobile(): boolean {
  return window.matchMedia('(max-width: 640px)').matches
}

export function onMobileChange(callback: (event: MediaQueryListEvent) => void) {
  const mediaQueryList = window.matchMedia('(max-width: 640px)')
  mediaQueryList.addEventListener('change', callback)
  return function off() {
    mediaQueryList.removeEventListener('change', callback)
  }
}

export function checkDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function onDarkModeChange(callback: (event: MediaQueryListEvent) => void) {
  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQueryList.addEventListener('change', callback)
  return function off() {
    mediaQueryList.removeEventListener('change', callback)
  }
}

export function checkTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
