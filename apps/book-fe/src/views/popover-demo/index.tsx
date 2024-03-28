import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import PopoverMDX from './popover.mdx'

export default function PopoverDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.popover')} component={PopoverMDX} />
}
