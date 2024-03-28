import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import ImageMDX from './image.mdx'

export default function ImageDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.image')} component={ImageMDX} />
}
