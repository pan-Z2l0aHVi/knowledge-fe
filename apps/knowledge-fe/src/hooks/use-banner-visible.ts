import { storage } from '@youknown/utils/src'
import { useCallback, useEffect, useState } from 'react'

const CLOSED_KEY = 'banner-closed'

export function useBannerVisible(): [
  boolean,
  {
    show: () => void
    hide: () => void
  }
] {
  const [visible, setVisible] = useState(false)

  const update_visible_status = () => {
    const closed = storage.local.get(CLOSED_KEY)
    setVisible(!closed)
  }

  useEffect(() => {
    update_visible_status()
    const storage_handler = (event: StorageEvent) => {
      if (event.key === CLOSED_KEY) {
        update_visible_status()
      }
    }
    window.addEventListener('storage', storage_handler)
    return () => {
      window.removeEventListener('storage', storage_handler)
    }
  }, [])

  const show = useCallback(() => {
    storage.local.remove(CLOSED_KEY)
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    storage.local.set(CLOSED_KEY, 1, 7 * 24 * 60 * 60 * 1000)
    setVisible(false)
  }, [])

  return [visible, { show, hide }]
}
