import { useBoolean } from '@youknown/react-hook/src'
import { Avatar, Button, Dialog, Space, Toast, Tooltip } from '@youknown/react-ui/src'
import { cls, QS } from '@youknown/utils/src'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiMessageRoundedDetail, BiPencil } from 'react-icons/bi'
import { TbTrash } from 'react-icons/tb'

import type { Comment, Feed, SubComment } from '@/apis/feed'
import { comment_delete } from '@/apis/feed'
import RichTextArea from '@/components/rich-text-area'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { is_dark_theme_getter, useRecordStore, useUIStore, useUserStore } from '@/stores'
import { format_time } from '@/utils'
import { with_api } from '@/utils/request'

import { CommentContext } from '../../comment-context'
import CommentEdit from '../comment-edit'
import CommentReply from '../comment-reply'

interface SubCommentItemProps {
  feed: Feed
  main_comment: Comment
  comment: SubComment
}
export default function SubCommentItem(props: SubCommentItemProps) {
  const { feed, main_comment, comment } = props
  const { feed_id, commentator, reply_commentator, update_time, content } = comment
  const navigate = useTransitionNavigate()
  const { t } = useTranslation()
  const ctx = useContext(CommentContext)
  const profile = useUserStore(state => state.profile)
  const recording = useRecordStore(state => state.recording)
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const [reply_visible, { setReverse: toggle_reply, setFalse: hide_reply }] = useBoolean(false)
  const [edit_visible, { setReverse: toggle_edit, setFalse: hide_edit }] = useBoolean(false)
  const [del_loading, set_del_loading] = useState(false)

  const is_owner = profile?.user_id === comment.user_id

  const go_user_center = (user_id: string) => {
    navigate(
      QS.stringify({
        base: '/user-center',
        query: {
          target_user_id: user_id
        }
      })
    )
  }

  const record_delete_comment = () => {
    recording({
      action: 'record.delete',
      target: feed.creator.nickname,
      target_id: feed.creator_id,
      obj_type: 'record.public_doc',
      obj: `${feed.subject.title}${t('comment_in_it')}`,
      obj_id: feed_id
    })
  }

  const delete_comment = async () => {
    if (del_loading) return
    set_del_loading(true)
    const [err] = await with_api(comment_delete)({
      feed_id,
      comment_id: main_comment.id,
      sub_comment_id: comment.id
    })
    set_del_loading(false)
    if (err) {
      return
    }
    record_delete_comment()
    Toast.success(t('comment.delete.success'))
    ctx.on_sub_comment_deleted?.(comment.id)
  }

  const handle_delete_comment = () => {
    Dialog.confirm({
      title: t('heading.delete_comment'),
      content: t('comment.delete.tip'),
      overlayClassName: cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      ),
      async onOk() {
        await delete_comment()
      },
      okLoading: del_loading,
      okDanger: true,
      okText: t('confirm'),
      cancelText: t('cancel.text'),
      closeIcon: null
    })
  }

  const operate_bar = (
    <div className="flex items-center mb-8px ml--4px">
      <div className="color-text-3 text-12px mr-16px">{format_time(update_time)}</div>
      <Space>
        <Tooltip title={t('reply.text')}>
          <Button size="small" square text onClick={toggle_reply}>
            <BiMessageRoundedDetail className={cls('text-16px', reply_visible ? 'color-primary' : 'color-text-3')} />
          </Button>
        </Tooltip>
        {is_owner && (
          <>
            <Tooltip title={t('edit.text')}>
              <Button size="small" square text onClick={toggle_edit}>
                <BiPencil className={cls('text-16px', edit_visible ? 'color-primary' : 'color-text-3')} />
              </Button>
            </Tooltip>
            <Tooltip title={t('delete.text')}>
              <Button size="small" square text onClick={handle_delete_comment}>
                <TbTrash className="text-16px color-text-3" />
              </Button>
            </Tooltip>
          </>
        )}
      </Space>
    </div>
  )

  return (
    <div className="flex items-start mb-16px last:mb-0">
      <Avatar round size={32} src={commentator.avatar} onClick={() => go_user_center(commentator.id)} />

      <div className="flex-1 w-0 pl-16px">
        <div>
          <div className="flex max-w-100% color-text-2 whitespace-nowrap">
            <span
              className="truncate rd-radius-s cursor-pointer [@media(hover:hover)]-hover-bg-hover"
              onClick={() => go_user_center(commentator.id)}
            >
              {commentator.nickname}
            </span>
            <span className="color-text-3 ml-8px mr-8px">{t('reply.text')}</span>
            <span
              className="truncate rd-radius-s cursor-pointer [@media(hover:hover)]-hover-bg-hover"
              onClick={() => go_user_center(reply_commentator.id)}
            >
              {reply_commentator.nickname}
            </span>
          </div>
        </div>

        {edit_visible ? (
          <CommentEdit feed={feed} comment_info={main_comment} sub_comment_info={comment} on_close={hide_edit} />
        ) : (
          <RichTextArea className="comment-rich-text-reset mb-8px" html={content} />
        )}

        {operate_bar}

        {reply_visible && (
          <CommentReply feed={feed} comment_info={main_comment} sub_comment_info={comment} on_close={hide_reply} />
        )}
      </div>
    </div>
  )
}
