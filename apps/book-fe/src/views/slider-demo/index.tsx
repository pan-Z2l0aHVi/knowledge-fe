import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import SliderMDX from './slider.mdx'

export default function SliderDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.slider')} component={SliderMDX} />
}
