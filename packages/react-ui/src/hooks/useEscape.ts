import { useEffect } from 'react'

export function useEscape(enable: boolean, callback?: (event: KeyboardEvent) => void) {
  useEffect(() => {
    if (enable) {
      const keydownHandler = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          callback?.(event)
        }
      }
      document.addEventListener('keydown', keydownHandler)
      return () => {
        document.removeEventListener('keydown', keydownHandler)
      }
    }
  }, [enable, callback])
}
