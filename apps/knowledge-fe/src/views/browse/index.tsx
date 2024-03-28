import { useBoolean } from '@youknown/react-hook/src'
import { Button, Input, Tabs } from '@youknown/react-ui/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbSearch } from 'react-icons/tb'

import Header from '@/app/components/header'
import TabBar from '@/app/components/tab-bar'
import { useUIStore, useUserStore } from '@/stores'

import FeedList, { FEED_TAB } from './components/feed-list'
import Searcher from './components/searcher'

export default function Browse() {
  const { t } = useTranslation()
  const has_login = useUserStore(state => state.has_login)
  const is_mobile = useUIStore(state => state.is_mobile)
  const [search_modal_open, { setTrue: show_search_modal, setFalse: hide_search_modal }] = useBoolean(false)
  const [feed_tab, set_feed_tab] = useState<FEED_TAB>(FEED_TAB.LATEST)

  const feed_tabs = (
    <Tabs
      type={is_mobile ? 'line' : 'segment'}
      value={feed_tab}
      onChange={set_feed_tab}
      tabList={[
        { key: FEED_TAB.LATEST, name: t('latest') },
        { key: FEED_TAB.MINE, name: t('mine') }
      ]}
    />
  )

  return (
    <>
      <Header
        heading={<div className="sm:w-152px">{t('page.title.browse')}</div>}
        footer={has_login && is_mobile && <div className="flex justify-center">{feed_tabs}</div>}
      >
        {has_login && !is_mobile && feed_tabs}

        {is_mobile ? (
          <Button square text onClick={show_search_modal}>
            <TbSearch className="color-primary text-18px" />
          </Button>
        ) : (
          <Input
            prefix={<TbSearch className="color-text-3" />}
            placeholder={t('placeholder.search')}
            outline={false}
            onClick={show_search_modal}
            onEnter={show_search_modal}
          />
        )}
      </Header>

      <Searcher open={search_modal_open} on_close={hide_search_modal} />

      <div className="flex justify-center sm:p-32px <sm:p-16px">
        <FeedList feed_tab={feed_tab} />
      </div>

      {is_mobile && <TabBar />}
    </>
  )
}
