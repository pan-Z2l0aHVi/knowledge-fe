import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import CardMDX from './card.mdx'

export default function CardDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.card')} component={CardMDX} />
}
