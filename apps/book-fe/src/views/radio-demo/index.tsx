import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import RadioMDX from './radio.mdx'

export default function RadioDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.radio')} component={RadioMDX} />
}
