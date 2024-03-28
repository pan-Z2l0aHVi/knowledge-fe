import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import OverlayMDX from './overlay.mdx'

export default function OverlayDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.overlay')} component={OverlayMDX} />
}
