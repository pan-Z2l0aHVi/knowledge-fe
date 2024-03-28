import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import ListMDX from './list.mdx'

export default function ListDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.list')} component={ListMDX} />
}
