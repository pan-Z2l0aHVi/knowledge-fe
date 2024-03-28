import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import DialogMDX from './dialog.mdx'

export default function DialogDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.dialog')} component={DialogMDX} />
}
