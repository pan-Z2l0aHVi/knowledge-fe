import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import AvatarMDX from './avatar.mdx'

export default function AvatarDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.avatar')} component={AvatarMDX} />
}
