import './index.scss'

import { useEvent, useInfinity } from '@youknown/react-hook/src'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Comment, Feed, SubComment } from '@/apis/feed'
import { get_comment_list } from '@/apis/feed'
import MoreLoading from '@/components/more-loading'
import NoMore from '@/components/no-more'

import { CommentContext } from './comment-context'
import CommentCreate from './components/comment-create'
import CommentItem from './components/comment-item'

interface CommentAreaProps {
  feed: Feed
}
export default function CommentArea(props: CommentAreaProps) {
  const { feed } = props
  const { id: feed_id } = feed

  const { t } = useTranslation()
  const loading_ref = useRef<HTMLDivElement>(null)
  const [comment_total, set_comment_total] = useState(0)
  const fetcher = async () => {
    const { list, total } = await get_comment_list({
      feed_id,
      page,
      page_size: pageSize
    })
    set_comment_total(total)
    return list
  }
  const {
    noMore: no_more,
    data: comments,
    page,
    pageSize,
    mutate: set_comments
  } = useInfinity(fetcher, {
    initialPageSize: 5,
    target: loading_ref,
    observerInit: {
      rootMargin: '0px 0px 80px 0px'
    }
  })

  const on_comment_created = useEvent((new_comment: Comment) => {
    set_comment_total(p => p + 1)
    set_comments(p => [new_comment, ...p])
  })

  const on_comment_reply = useEvent(async (comment_id: string, sub_comment: SubComment) => {
    set_comment_total(p => p + 1)
    set_comments(p =>
      p.map(comment => {
        if (comment.id === comment_id) {
          return {
            ...comment,
            sub_comments: [sub_comment, ...comment.sub_comments]
          }
        }
        return comment
      })
    )
  })

  const on_comment_deleted = useEvent((comment_id: string) => {
    set_comment_total(p => p - 1)
    set_comments(p => p.filter(comment => comment.id !== comment_id))
  })

  const on_sub_comment_deleted = useEvent((sub_comment_id: string) => {
    set_comment_total(p => p - 1)
    set_comments(p =>
      p.map(comment => {
        return {
          ...comment,
          sub_comments: comment.sub_comments.filter(sub_comment => sub_comment.id !== sub_comment_id)
        }
      })
    )
  })

  const on_comment_updated = useEvent((new_comment: Comment) => {
    set_comments(p =>
      p.map(comment => {
        if (comment.id === new_comment.id) {
          return new_comment
        }
        return comment
      })
    )
  })

  const on_sub_comment_updated = useEvent((new_sub_comment: SubComment) => {
    set_comments(p =>
      p.map(comment => ({
        ...comment,
        sub_comments: comment.sub_comments.map(sub_comment => {
          if (sub_comment.id === new_sub_comment.id) {
            return new_sub_comment
          }
          return sub_comment
        })
      }))
    )
  })

  return (
    <CommentContext.Provider
      value={{
        on_comment_created,
        on_comment_reply,
        on_comment_deleted,
        on_sub_comment_deleted,
        on_comment_updated,
        on_sub_comment_updated
      }}
    >
      <div id="feed-comment-area" className="p-[24px_0]">
        <div className="font-700 text-18px mb-24px">
          {comment_total} {t('comment.count')}
        </div>
        <CommentCreate feed={feed} />
        <div className="mt-32px">
          {comments.map(comment => (
            <CommentItem key={comment.id} feed={feed} comment={comment} />
          ))}
        </div>
        {no_more ? <NoMore /> : <MoreLoading ref={loading_ref} />}
      </div>
    </CommentContext.Provider>
  )
}
