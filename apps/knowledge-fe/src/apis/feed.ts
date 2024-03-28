import { net } from '@/utils/request'

import type { Doc } from './doc'

export interface Feed {
  id: string
  creator_id: string
  creator: {
    id: string
    nickname: string
    avatar: string
  }
  subject_id: string
  subject_type: string
  subject: Doc
  likes: {
    creation_time: string
    user_id: string
    nickname: string
    avatar: string
  }[]
  likes_count: number
  creation_time: string
  update_time: string
  collected: boolean
}

export interface GetFeedListParams {
  page: number
  page_size: number
  keywords?: string
  sort_by?: 'update_time'
  sort_type?: 'desc' | 'asc'
  author_id?: string
}
export const get_feed_list = (params: GetFeedListParams) =>
  net.fetch<{
    total: number
    list: Feed[]
  }>('/proxy/feed/list', {
    params
  })

export interface GetFeedInfoParams {
  feed_id: string
}
export const get_feed_info = (params: GetFeedInfoParams) =>
  net.fetch<Feed>('/proxy/feed/info', {
    params
  })

export interface GetRelatedFeedsParams {
  space_id: string
  page: number
  page_size: number
}
export const get_related_feeds = (params: GetRelatedFeedsParams) =>
  net.fetch<{
    total: number
    list: Feed[]
  }>('/proxy/feed/related_feeds', {
    params
  })

export interface LikeFeedPayload {
  event: 'like' | 'unlike'
  feed_id: string
}
export const like_feed = (payload: LikeFeedPayload) =>
  net.fetch('/proxy/feed/like', {
    method: 'post',
    payload
  })

export interface Commentator {
  id: string
  nickname: string
  avatar: string
}
export interface SubComment {
  id: string
  user_id: string
  feed_id: string
  content: string
  creation_time: string
  update_time: string
  reply_user_id: string
  commentator: Commentator
  reply_commentator: Commentator
}
export interface Comment {
  id: string
  user_id: string
  feed_id: string
  content: string
  creation_time: string
  update_time: string
  sub_comments: SubComment[]
  commentator: Commentator
}

export interface GetCommentListParams {
  feed_id: string
  page: number
  page_size: number
}
export const get_comment_list = (params: GetCommentListParams) =>
  net.fetch<{
    list: Comment[]
    total: number
  }>('/proxy/feed/comment_list', {
    params
  })

export interface CommentPayload {
  feed_id: string
  content: string
}
export const comment = (payload: CommentPayload) =>
  net.fetch<Comment>('/proxy/feed/comment', {
    method: 'post',
    payload
  })

export interface CommentReplyPayload {
  feed_id: string
  comment_id: string
  reply_user_id: string
  content: string
}
export const comment_reply = (payload: CommentReplyPayload) =>
  net.fetch<SubComment>('/proxy/feed/reply', {
    method: 'post',
    payload
  })

export interface CommentDeletePayload {
  feed_id: string
  comment_id: string
  sub_comment_id?: string
}
export const comment_delete = (payload: CommentDeletePayload) =>
  net.fetch<void>('/proxy/feed/comment_delete', {
    method: 'post',
    payload
  })

export interface CommentUpdatePayload {
  feed_id: string
  comment_id: string
  sub_comment_id?: string
  content: string
}
export const comment_update = (payload: CommentUpdatePayload) =>
  net.fetch<Comment | SubComment>('/proxy/feed/comment_update', {
    method: 'post',
    payload
  })
