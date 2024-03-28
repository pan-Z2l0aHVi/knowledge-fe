import { useBoolean } from '@youknown/react-hook/src'
import { Input, Toast } from '@youknown/react-ui/src'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Doc } from '@/apis/doc'
import { update_doc } from '@/apis/doc'
import { DOC_TITLE_MAX_LEN } from '@/consts'
import { with_api } from '@/utils/request'

interface DocTitleProps {
  doc_id: string
  doc_info?: Doc
  on_updated: (doc_info: Doc) => void
}

export default function DocTitle(props: DocTitleProps) {
  const { doc_id, doc_info, on_updated } = props

  const { t } = useTranslation()
  const [title_focus, { setTrue: focus_title, setFalse: blur_title }] = useBoolean(false)
  const [title_val, set_title_val] = useState('')
  const title_input_ref = useRef<HTMLInputElement>(null)

  const doc_title = doc_info?.title ?? ''
  useEffect(() => {
    if (doc_title) {
      set_title_val(doc_title)
    }
  }, [doc_title])

  const update_doc_title = async () => {
    blur_title()
    if (!title_val) {
      Toast.warning(t('validate.title_required'))
      set_title_val(doc_title)
      return
    }
    if (title_val === doc_info?.title) {
      return
    }
    const payload = {
      doc_id,
      title: title_val
    }
    const [err, res] = await with_api(update_doc)(payload)
    if (err) {
      set_title_val(doc_title)
      return
    }
    on_updated(res)
    Toast.success(t('update.title.success'))
  }

  return (
    <>
      {title_focus ? (
        <div className="flex-1">
          <Input
            ref={title_input_ref}
            className="w-100%! max-w-400px"
            maxLength={DOC_TITLE_MAX_LEN}
            value={title_val}
            onChange={set_title_val}
            autoFocus
            placeholder={t('placeholder.title')}
            onBlur={update_doc_title}
          />
        </div>
      ) : (
        <div className="flex-1 w-0 truncate flex items-center h-24px">
          <span
            className="max-w-100% pl-8px pr-8px rd-radius-m color-text-2 [@media(hover:hover)]-hover-bg-hover cursor-default"
            onClick={focus_title}
          >
            {doc_title}
          </span>
        </div>
      )}
    </>
  )
}
