import { useEvent, useInfinity } from '@youknown/react-hook/src'
import { Dialog, Input, Loading } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CgSpinner } from 'react-icons/cg'
import { GoInbox } from 'react-icons/go'
import { TbSearch } from 'react-icons/tb'

import type { Feed } from '@/apis/feed'
import { get_feed_list } from '@/apis/feed'
import MoreLoading from '@/components/more-loading'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { is_dark_theme_getter, useUIStore } from '@/stores'

import Overview from './components/overview'
import ResultList from './components/result-list'

interface SearcherProps {
  open: boolean
  on_close: (open: boolean) => void
}
export default function Searcher(props: SearcherProps) {
  const { open = false, on_close } = props

  const { t } = useTranslation()
  const navigate = useTransitionNavigate()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const [keywords, set_keywords] = useState('')
  const has_keywords = !!keywords.trim()
  const [selection, set_selection] = useState<Feed | null>(null)
  const list_ref = useRef<HTMLDivElement>(null)
  const loading_ref = useRef<HTMLDivElement>(null)

  const fetcher = async () => {
    const { list } = await get_feed_list({
      page,
      page_size,
      sort_by: 'update_time',
      sort_type: 'desc',
      keywords
    })
    return list
  }
  const {
    data: result,
    loading,
    noMore: no_more,
    page,
    pageSize: page_size,
    reload,
    reset,
    mutate: set_result
  } = useInfinity(fetcher, {
    initialPageSize: 10,
    manual: true,
    target: loading_ref,
    observerInit: {
      root: list_ref.current
    },
    onSuccess(data) {
      if (page === 1) {
        set_selection(data[0])
      }
    }
  })

  useEffect(() => {
    if (open) {
      set_keywords('')
      reset()
    }
  }, [open, reset])

  useEffect(() => {
    if (keywords.trim()) {
      reload()
    } else {
      set_selection(null)
      reset()
      set_result([])
    }
  }, [keywords, reload, reset, set_result])

  const go_feed_detail = useEvent((feed: Feed) => {
    navigate(
      QS.stringify({
        base: '/browse/feed-detail',
        query: { feed_id: feed.id }
      }),
      { state: feed }
    )
  })

  const card_header = (
    <div className="p-4px b-b-1 b-b-solid b-b-divider">
      <Input
        className="w-100%! text-16px!"
        autoFocus
        bordered={false}
        size="large"
        placeholder={t('placeholder.search')}
        prefix={
          loading ? (
            <Loading icon={<CgSpinner className="color-primary text-18px mr-4px ml-4px" />} spinning />
          ) : (
            <TbSearch className="color-text-3 text-18px mr-4px ml-4px" />
          )
        }
        allowClear
        value={keywords}
        onChange={set_keywords}
      />
    </div>
  )

  const card_footer = (
    <div className="pt-4px pb-4px pl-16px bg-bg-2 b-t-1 b-t-solid b-t-divider line-height-24px color-text-3 text-12px">
      {t('keyboard.tip')}
    </div>
  )
  const has_result = result.length > 0
  const card_content = (
    <>
      {has_keywords && has_result ? (
        <div className="flex h-400px">
          <div className="flex flex-col items-center w-160px p-t-12px pb-12px pl-16px">
            {selection && <Overview selection={selection} />}
          </div>
          <div className="flex-1">
            <ResultList
              ref={list_ref}
              keywords={keywords}
              result={result}
              selection={selection}
              set_selection={set_selection}
              go_detail={feed => {
                if (!feed) return
                on_close(false)
                go_feed_detail(feed)
              }}
              footer={no_more || (has_keywords && <MoreLoading ref={loading_ref} />)}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-120px color-text-3">
          <GoInbox className="text-32px mb-8px" />
          {t('find.empty')}
        </div>
      )}
    </>
  )

  return (
    <Dialog
      className="w-640px! max-w-[calc(100vw-32px)] overflow-hidden"
      overlayClassName={cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      )}
      open={open}
      onCancel={() => on_close(false)}
      unmountOnExit
      closeIcon={null}
      header={card_header}
      footer={card_footer}
    >
      {card_content}
    </Dialog>
  )
}
