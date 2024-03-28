import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import LoadingMDX from './loading.mdx'

export default function LoadingDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.loading')} component={LoadingMDX} />
}
