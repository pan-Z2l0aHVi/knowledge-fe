import { Motion, Tooltip } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { IoSettingsSharp } from 'react-icons/io5'

import { useModalStore } from '@/stores'

interface OptionsProps {
  expand: boolean
}

export default function Options({ expand }: OptionsProps) {
  const { t } = useTranslation()
  const open_preferences_modal = useModalStore(state => state.open_preferences_modal)

  return (
    <Tooltip title={t('setting.text')} placement="right" spacing={20} disabled={expand}>
      <button
        className={cls(
          'btn border-0 bg-transparent w-100% h-44px flex items-center p-4px rd-radius-m cursor-pointer select-none custom-focus-outline',
          'active-bg-secondary-active [@media(hover:hover)]-hover-not-active-bg-secondary-hover'
        )}
        onClick={open_preferences_modal}
      >
        <div className="flex justify-center items-center w-36px min-w-36px h-36px rd-full bg-primary">
          <IoSettingsSharp className="text-18px color-#fff" />
        </div>
        <Motion.Fade in={expand} mountOnEnter unmountOnExit>
          <div className="flex-1 break-all ws-nowrap ml-8px">{t('setting.text')}</div>
        </Motion.Fade>
      </button>
    </Tooltip>
  )
}
