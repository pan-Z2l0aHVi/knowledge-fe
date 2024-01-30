import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Comment, comment_reply, Feed, SubComment } from '@/apis/feed'
import { with_api } from '@/utils/request'
import { Toast } from '@youknown/react-ui/src'

import { CommentContext } from '../../comment-context'
import CommentEditor from '../comment-editor'

interface CommentReplyProps {
	feed: Feed
	comment_info: Comment
	sub_comment_info?: SubComment
	on_close: () => void
}

export default function CommentReply(props: CommentReplyProps) {
	const { feed, comment_info, sub_comment_info, on_close } = props
	const { id: feed_id } = feed
	const is_sub_comment = !!sub_comment_info

	const { t } = useTranslation()
	const ctx = useContext(CommentContext)
	const [send_loading, set_send_loading] = useState(false)
	const [comment_text, set_comment_text] = useState('')
	const placeholder = `${t('reply.text')} ${comment_info.commentator.nickname}`

	const reply_comment = async () => {
		const [err, new_sub_comment] = await with_api(comment_reply)({
			feed_id,
			comment_id: comment_info.id,
			reply_user_id: is_sub_comment ? sub_comment_info.user_id : comment_info.user_id,
			content: comment_text
		})
		if (err) {
			return
		}
		Toast.success(t('reply.success'))
		ctx.on_comment_reply?.(comment_info.id, new_sub_comment)
		on_close()
	}

	const handle_reply_comment = async () => {
		if (send_loading) return
		set_send_loading(true)
		await reply_comment()
		set_send_loading(false)
	}

	return (
		<CommentEditor
			auto_focus
			placeholder={placeholder}
			btnText={t('reply.text')}
			send_loading={send_loading}
			value={comment_text}
			on_change={set_comment_text}
			on_send={handle_reply_comment}
			on_cancel={on_close}
		/>
	)
}
