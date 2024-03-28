import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import DrawerMDX from './drawer.mdx'

export default function DrawerDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.drawer')} component={DrawerMDX} />
}
