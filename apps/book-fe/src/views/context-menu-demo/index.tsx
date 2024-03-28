import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import ContextMenuMDX from './context-menu.mdx'

export default function ContextMenuDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.context_menu')} component={ContextMenuMDX} />
}
