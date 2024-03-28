import { CloseIcon, Dialog } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'

import { is_dark_theme_getter, useUIStore } from '@/stores'

import SpaceOptions from './components/space-options'

interface SpaceOptionsModalProps {
  open: boolean
  hide_modal: () => void
  space_id?: string
  on_save: (name: string, desc: string) => Promise<void>
}
export default function SpaceOptionsModal(props: SpaceOptionsModalProps) {
  const { open, hide_modal, space_id, on_save } = props
  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const is_edit = !!space_id

  return (
    <Dialog
      className="w-428px! max-w-[calc(100vw-32px)]"
      overlayClassName={cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      )}
      open={open}
      onCancel={hide_modal}
      unmountOnExit
      header={
        <div className="flex justify-between sm:p-[24px_24px_0] <sm:p-[16px_16px_0]">
          <span className="text-16px font-500">{is_edit ? t('space.manage') : t('space.create')}</span>
          <CloseIcon onClick={hide_modal} />
        </div>
      }
      footer="" // 底部占位
      closeIcon={null}
    >
      <SpaceOptions space_id={space_id} hide_modal={hide_modal} on_save={on_save} />
    </Dialog>
  )
}
