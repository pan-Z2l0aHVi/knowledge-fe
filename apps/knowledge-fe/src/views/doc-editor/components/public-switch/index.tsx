import { Button, Dialog, Toast, Tooltip } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbWorld, TbWorldOff } from 'react-icons/tb'

import type { Doc } from '@/apis/doc'
import { update_doc } from '@/apis/doc'
import { is_dark_theme_getter, useUIStore } from '@/stores'
import { with_api } from '@/utils/request'

interface PublicSwitchProps {
  doc_id: string
  doc_info?: Doc
  on_updated: (doc_info: Doc) => void
}

export default function PublicSwitch(props: PublicSwitchProps) {
  const { doc_id, doc_info, on_updated } = props
  const is_doc_public = doc_info?.public ?? false

  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const [publishing, set_publishing] = useState(false)

  const update_doc_public = async (is_public: boolean) => {
    set_publishing(true)
    const payload = {
      doc_id,
      public: is_public
    }
    const [err, res] = await with_api(update_doc)(payload)
    set_publishing(false)
    if (err) {
      return
    }
    on_updated(res)
    Toast.success(is_public ? t('doc.publish.ok') : t('doc.publish.cancel'))
  }

  return (
    <Tooltip placement="bottom" title={is_doc_public ? t('doc.public') : t('doc.private')}>
      <Button
        className="mr-8px"
        text
        square
        size="small"
        loading={publishing}
        onClick={() => {
          const next_doc_public = !is_doc_public
          if (!next_doc_public) {
            Dialog.confirm({
              title: t('heading.delete_feed'),
              content: t('feed.delete_tip'),
              overlayClassName: cls(
                'backdrop-blur-xl',
                is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
              ),
              okDanger: true,
              okText: t('confirm'),
              cancelText: t('cancel.text'),
              closeIcon: null,
              onOk: () => {
                update_doc_public(next_doc_public)
              }
            })
          } else {
            update_doc_public(next_doc_public)
          }
        }}
      >
        {is_doc_public ? (
          <TbWorld className="color-primary text-16px" />
        ) : (
          <TbWorldOff className="color-text-3 text-16px" />
        )}
      </Button>
    </Tooltip>
  )
}
