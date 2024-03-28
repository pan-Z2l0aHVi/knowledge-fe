import { Toast } from '@youknown/react-ui/src'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Comment, Feed, SubComment } from '@/apis/feed'
import { comment_update } from '@/apis/feed'
import { useRecordStore } from '@/stores'
import { with_api } from '@/utils/request'

import { CommentContext } from '../../comment-context'
import CommentEditor from '../comment-editor'

interface CommentEditProps {
  feed: Feed
  comment_info: Comment
  sub_comment_info?: Comment | SubComment
  on_close: () => void
}

export default function CommentEdit(props: CommentEditProps) {
  const { feed, comment_info, sub_comment_info, on_close } = props
  const { id: feed_id } = feed
  const is_sub_comment = !!sub_comment_info

  const ctx = useContext(CommentContext)
  const recording = useRecordStore(state => state.recording)
  const { t } = useTranslation()
  const [send_loading, set_send_loading] = useState(false)
  const [comment_text, set_comment_text] = useState(() => {
    if (is_sub_comment) {
      return sub_comment_info?.content ?? ''
    }
    return comment_info?.content ?? ''
  })

  const placeholder = is_sub_comment
    ? `${t('reply.text')} ${sub_comment_info.commentator.nickname}`
    : t('placeholder.input')

  const record_edit_comment = () => {
    recording({
      action: 'record.edit',
      target: feed.creator.nickname,
      target_id: feed.creator_id,
      obj_type: 'record.public_doc',
      obj: `${feed.subject.title}${t('record.comment_in_it')}`,
      obj_id: feed_id
    })
  }

  const update_comment = async () => {
    const params = {
      feed_id,
      comment_id: comment_info.id,
      content: comment_text
    }
    if (is_sub_comment) {
      Object.assign(params, {
        sub_comment_id: sub_comment_info.id
      })
    }
    const [err, new_comment] = await with_api(comment_update)(params)
    if (err) {
      return
    }
    record_edit_comment()
    Toast.success(t('comment.edit.success'))
    if (is_sub_comment) {
      ctx.on_sub_comment_updated?.(new_comment as SubComment)
    } else {
      ctx.on_comment_updated?.(new_comment as Comment)
    }
    on_close()
  }

  const handle_edit_comment = async () => {
    if (send_loading) return
    set_send_loading(true)
    await update_comment()
    set_send_loading(false)
  }

  return (
    <CommentEditor
      auto_focus
      placeholder={placeholder}
      btnText={t('save.text')}
      send_loading={send_loading}
      value={comment_text}
      on_change={set_comment_text}
      on_send={handle_edit_comment}
      on_cancel={on_close}
    />
  )
}
