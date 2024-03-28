import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import FormMDX from './form.mdx'

export default function FormDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.form')} component={FormMDX} />
}
