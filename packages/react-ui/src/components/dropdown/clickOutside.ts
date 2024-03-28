export function clickOutside() {
  const event = new Event('pointerdown', {
    bubbles: true,
    cancelable: true
  })
  document.documentElement.dispatchEvent(event)
}
