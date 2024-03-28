import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import TagMDX from './tag.mdx'

export default function TagDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.tag')} component={TagMDX} />
}
