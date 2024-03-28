import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import SwitchMDX from './switch.mdx'

export default function SwitchDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.switch')} component={SwitchMDX} />
}
