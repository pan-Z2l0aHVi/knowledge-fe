import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import AnchorMDX from './anchor.mdx'

export default function AnchorDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.anchor')} component={AnchorMDX} anchor_visible={false} />
}
