import { useMount } from '@youknown/react-hook/src'
import { Toast } from '@youknown/react-ui/src'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { useRouteMeta } from '@/hooks/use-route-meta'
import { useModalStore } from '@/stores'
import { report } from '@/utils/report'

export function useInitApp() {
  const { t } = useTranslation()
  const close_preferences_modal = useModalStore(state => state.close_preferences_modal)

  useMount(() => {
    window.addEventListener('online', () => {
      Toast.success(t('network.recovery'))
    })
    window.addEventListener('offline', () => {
      Toast.error(t('network.abort'))
    })
  })

  const route_meta = useRouteMeta()
  const title = route_meta.title?.()
  useEffect(() => {
    if (title) {
      document.title = title
    }
  }, [title])

  const location = useLocation()
  useEffect(() => {
    report({
      event: 'page_view',
      payload: location
    })
  }, [location])

  // 切页面时关闭全局弹窗
  useEffect(() => {
    if (location) {
      close_preferences_modal()
    }
  }, [close_preferences_modal, location])
}
