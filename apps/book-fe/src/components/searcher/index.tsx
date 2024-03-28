import { Dialog, Input, Loading } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CgSpinner } from 'react-icons/cg'
import { GoInbox } from 'react-icons/go'
import { TbSearch } from 'react-icons/tb'

import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { RouteItem } from '@/router/routes'
import { is_dark_theme_getter, useUIStore } from '@/stores'

import ResultList from './components/result-list'
import { get_local_data } from './local-data'

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
  const [selection, set_selection] = useState<RouteItem | null>(null)
  const list_ref = useRef<HTMLDivElement>(null)

  const [result, set_result] = useState<RouteItem[]>([])
  const loading = false

  useEffect(() => {
    if (open) {
      set_keywords('')
      set_result([])
    }
  }, [open])

  useEffect(() => {
    if (keywords.trim()) {
      set_result(get_local_data(keywords))
    } else {
      set_selection(null)
      set_result([])
    }
  }, [keywords, set_result])

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
        <div className="h-400px">
          <ResultList
            ref={list_ref}
            result={result}
            selection={selection}
            set_selection={set_selection}
            go_detail={route => {
              if (!route) return
              on_close(false)
              navigate(route.path)
            }}
          />
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
