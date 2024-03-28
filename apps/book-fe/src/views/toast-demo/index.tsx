import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import ToastMDX from './toast.mdx'

export default function ToastDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.toast')} component={ToastMDX} />
}
