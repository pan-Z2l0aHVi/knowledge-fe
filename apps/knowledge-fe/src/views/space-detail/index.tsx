import { useBoolean, useFetch } from '@youknown/react-hook/src'
import { Button, Space } from '@youknown/react-ui/src'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TbCheckbox, TbFilter, TbX } from 'react-icons/tb'
import { useParams } from 'react-router-dom'

import { get_space_info } from '@/apis/space'
import Header from '@/app/components/header'
import { useUIStore } from '@/stores'

import DocList from './components/doc-list'

export default function SpaceDetail() {
  const { t } = useTranslation()
  const { space_id = '' } = useParams()
  const is_mobile = useUIStore(state => state.is_mobile)
  const [choosing, { setTrue: do_choosing, setFalse: cancel_choosing }] = useBoolean(false)
  const [filter_open, { setTrue: open_filter, setFalse: close_filter }] = useBoolean(false)

  useEffect(() => {
    if (space_id) {
      cancel_choosing()
      close_filter()
    }
  }, [cancel_choosing, close_filter, space_id])

  const { data: info } = useFetch(get_space_info, {
    params: [{ space_id }],
    ready: !!space_id,
    refreshDeps: [space_id]
  })

  const action_bar = (
    <Space>
      {choosing ? (
        <>
          {is_mobile ? (
            <Button text square onClick={cancel_choosing}>
              <TbX className="text-18px color-primary" />
            </Button>
          ) : (
            <Button onClick={cancel_choosing} prefixIcon={<TbX className="text-16px color-primary" />}>
              {t('cancel.text')}
            </Button>
          )}
        </>
      ) : (
        <>
          {is_mobile ? (
            <>
              <Button text square onClick={do_choosing}>
                <TbCheckbox className="text-18px color-primary" />
              </Button>
              <Button text square onClick={open_filter}>
                <TbFilter className="text-18px color-primary" />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={do_choosing} prefixIcon={<TbCheckbox className="text-16px color-primary" />}>
                {t('select.text')}
              </Button>
              <Button prefixIcon={<TbFilter className="text-16px color-primary" />} onClick={open_filter}>
                {t('filter.text')}
              </Button>
            </>
          )}
        </>
      )}
    </Space>
  )

  return (
    <>
      <Header heading={info?.name ?? ''}>{action_bar}</Header>

      {space_id && (
        <DocList
          key={`doc_list/${space_id}`}
          space_id={space_id}
          filter_open={filter_open}
          close_filter={close_filter}
          choosing={choosing}
          cancel_choosing={cancel_choosing}
        />
      )}
    </>
  )
}
