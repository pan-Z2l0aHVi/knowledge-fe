import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import ButtonMDX from './button.mdx'

export default function ButtonDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.button')} component={ButtonMDX} />
}
