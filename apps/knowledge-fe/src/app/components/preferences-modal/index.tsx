import { CloseIcon, Dialog } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'

import { is_dark_theme_getter, useModalStore, useUIStore } from '@/stores'

import Preferences from './components/preferences'

export default function PreferencesModal() {
  const { t } = useTranslation()
  const modal_open = useModalStore(state => state.preferences_modal_open)
  const close_preferences_modal = useModalStore(state => state.close_preferences_modal)
  const is_dark_theme = useUIStore(is_dark_theme_getter)

  return (
    <Dialog
      className="w-480px! max-w-[calc(100vw-32px)]"
      overlayClassName={cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      )}
      open={modal_open}
      onCancel={close_preferences_modal}
      unmountOnExit
      header={
        <div className="flex justify-between sm:p-[24px_24px_0] <sm:p-[16px_16px_0]">
          <span className="text-16px font-500">{t('heading.preference')}</span>
          <CloseIcon onClick={close_preferences_modal} />
        </div>
      }
      footer="" // 底部占位
      closeIcon={null}
    >
      <Preferences />
    </Dialog>
  )
}
