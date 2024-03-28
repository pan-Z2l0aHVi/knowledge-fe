import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import CollapseMDX from './collapse.mdx'

export default function CollapseDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.collapse')} component={CollapseMDX} />
}
