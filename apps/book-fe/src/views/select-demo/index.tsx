import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import SelectMDX from './select.mdx'

export default function SelectDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.select')} component={SelectMDX} />
}
