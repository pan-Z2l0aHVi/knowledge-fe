import { storage } from '@youknown/utils/src'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
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
    const closed_date = storage.local.get<Dayjs>(CLOSED_KEY)
    if (!closed_date) {
      setVisible(true)
    } else if (dayjs().diff(closed_date, 'day') > 7) {
      setVisible(true)
    } else {
      setVisible(false)
    }
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
    storage.local.set(CLOSED_KEY, dayjs())
    setVisible(false)
  }, [])

  return [visible, { show, hide }]
}
