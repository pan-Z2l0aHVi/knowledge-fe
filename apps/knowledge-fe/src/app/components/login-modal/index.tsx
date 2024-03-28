import { CloseIcon, Dialog } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'

import { is_dark_theme_getter, useModalStore, useUIStore } from '@/stores'

import GithubCard from './components/github-card'
import WeChatCard from './components/wechat-card'

export default function LoginModal() {
  const { t } = useTranslation()
  const modal_open = useModalStore(state => state.login_modal_open)
  const close_login_modal = useModalStore(state => state.close_login_modal)
  const is_dark_theme = useUIStore(is_dark_theme_getter)

  return (
    <Dialog
      overlayClassName={cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      )}
      open={modal_open}
      onCancel={close_login_modal}
      unmountOnExit
      header={
        <div className="flex justify-between sm:p-[24px_24px_8px_24px] <sm:p-[16px_16px_8px_16px]">
          <span className="text-16px font-500">{t('heading.user_login')}</span>
          <CloseIcon onClick={close_login_modal} />
        </div>
      }
      footer={null}
      closeIcon={null}
    >
      <div className="flex flex-col items-center w-360px max-w-[calc(100vw-32px)] sm:p-24px <sm:p-16px">
        <div className="w-100% grid grid-cols-[repeat(2,1fr)] grid-rows-[repeat(1,152px)] gap-16px">
          <GithubCard />
          <WeChatCard />
        </div>
      </div>
    </Dialog>
  )
}
