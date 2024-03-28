import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import TriggerMDX from './trigger.mdx'

export default function TriggerDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.trigger')} component={TriggerMDX} />
}
