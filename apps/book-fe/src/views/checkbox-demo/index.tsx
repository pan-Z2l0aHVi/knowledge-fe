import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import CheckboxMDX from './checkbox.mdx'

export default function CheckboxDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.checkbox')} component={CheckboxMDX} />
}
