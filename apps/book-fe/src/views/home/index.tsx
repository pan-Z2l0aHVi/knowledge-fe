import { useTranslation } from 'react-i18next'

import Header from '@/app/components/header'

import { EntryCard } from './components/entry-card'

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <Header heading={t('page.title.home')}></Header>

      <div className="<sm:flex <sm:flex-wrap <sm:justify-center <sm:p-[32px_0] sm:p-32px">
        <EntryCard
          href="/rich_text_editor"
          title="React RTE"
          desc={t('desc.react_rte')}
          code="npm i @youknown/react-rte"
        />
        <EntryCard href="/ui_components" title="React UI" desc={t('desc.react_ui')} code="npm i @youknown/react-ui" />
        <EntryCard href="/hooks" title="React Hook" desc={t('desc.react_hook')} code="npm i @youknown/react-hook" />
      </div>
    </>
  )
}
