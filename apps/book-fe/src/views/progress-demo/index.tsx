import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import ProgressMDX from './progress.mdx'

export default function ProgressDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.progress')} component={ProgressMDX} />
}
