import { useEvent } from '@youknown/react-hook/src'
import { Button, Dialog, Input, Space } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbSearch, TbTrash } from 'react-icons/tb'

import Header from '@/app/components/header'
import { is_dark_theme_getter, useRecordStore, useUIStore } from '@/stores'

import RecordList from './components/record-list'

export default function History() {
  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const is_mobile = useUIStore(state => state.is_mobile)
  const record_list = useRecordStore(state => state.record_list)
  const clear_records = useRecordStore(state => state.clear_records)
  const [keywords, set_keywords] = useState('')
  const deferred_keywords = useDeferredValue(keywords)

  const record_result = useMemo(
    () =>
      deferred_keywords
        ? record_list.filter(record => {
            if (record.target.includes(deferred_keywords)) {
              return true
            }
            if (record.obj.includes(deferred_keywords)) {
              return true
            }
            return false
          })
        : record_list,
    [record_list, deferred_keywords]
  )

  const handle_search_input = useEvent((value: string) => {
    set_keywords(value)
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    })
  })

  const handle_clear_history = () => {
    Dialog.confirm({
      title: t('heading.clear_history'),
      content: t('history.clear_tip'),
      overlayClassName: cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      ),
      onOk() {
        clear_records()
      },
      okDanger: true,
      okText: t('clear.text'),
      cancelText: t('cancel.text'),
      closeIcon: null
    })
  }

  useEffect(() => {
    const pre_body_overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('webkit-scrollbar-hidden')
    return () => {
      document.body.style.overflow = pre_body_overflow
      document.body.classList.remove('webkit-scrollbar-hidden')
    }
  }, [])

  return (
    <>
      <Header heading={is_mobile ? null : t('page.title.history')}>
        <Space>
          <Input
            className="<sm:w-200px!"
            prefix={<TbSearch className="color-text-3" />}
            allowClear
            placeholder={t('placeholder.search_history')}
            value={keywords}
            onChange={handle_search_input}
          />
          {is_mobile ? (
            <Button square onClick={handle_clear_history}>
              <TbTrash />
            </Button>
          ) : (
            <Button onClick={handle_clear_history}>{t('clear.history')}</Button>
          )}
        </Space>
      </Header>

      {is_mobile ? (
        <RecordList list={record_result} />
      ) : (
        <div className="flex-1">
          <RecordList list={record_result} />
        </div>
      )}
    </>
  )
}
