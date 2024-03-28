import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import RichTextEditorMDX from './rich-text-editor.mdx'

export default function RichTextEditorDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.rte')} component={RichTextEditorMDX} />
}
