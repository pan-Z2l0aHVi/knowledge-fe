import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import DropdownMDX from './dropdown.mdx'

export default function DropdownDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.dropdown')} component={DropdownMDX} />
}
