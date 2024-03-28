import { useMount } from '@youknown/react-hook/src'
import { Toast } from '@youknown/react-ui/src'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { useRouteMeta } from '@/hooks/use-route-meta'
import { useModalStore, useRecordStore, useSpaceStore, useUserStore } from '@/stores'
import { get_local_token } from '@/utils/local'
import { report } from '@/utils/report'

export function useInitApp() {
  const { t } = useTranslation()
  const has_login = useUserStore(state => state.has_login)
  const fetch_profile = useUserStore(state => state.fetch_profile)
  const fetch_space_list = useSpaceStore(state => state.fetch_space_list)
  const clear_space_list = useSpaceStore(state => state.clear_space_list)
  const init_records = useRecordStore(state => state.init_records)
  const close_login_modal = useModalStore(state => state.close_login_modal)
  const close_preferences_modal = useModalStore(state => state.close_preferences_modal)

  useMount(() => {
    if (get_local_token()) {
      fetch_profile()
    }
  })

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
      close_login_modal()
    }
  }, [close_login_modal, close_preferences_modal, location])

  useEffect(() => {
    init_records()
  }, [init_records])

  useEffect(() => {
    if (has_login) {
      fetch_space_list()
    } else {
      clear_space_list()
    }
  }, [has_login, fetch_space_list, clear_space_list])
}
