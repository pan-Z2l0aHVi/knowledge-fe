import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import UseLatestRefMDX from './use-latest-ref.mdx'

export default function UseLatestRefDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.use_latest_ref')} component={UseLatestRefMDX} />
}
