import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import TabsMDX from './tabs.mdx'

export default function TabsDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.tabs')} component={TabsMDX} />
}
