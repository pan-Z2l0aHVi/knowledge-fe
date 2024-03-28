import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import TooltipMDX from './tooltip.mdx'

export default function TooltipDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.tooltip')} component={TooltipMDX} />
}
