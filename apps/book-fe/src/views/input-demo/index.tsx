import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import InputMDX from './input.mdx'

export default function InputDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.input')} component={InputMDX} />
}
