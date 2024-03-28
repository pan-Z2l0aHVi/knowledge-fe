import { createContext } from 'react'

import type { Comment, SubComment } from '@/apis/feed'

export interface CommentContextValue {
  on_comment_created?: (new_comment: Comment) => void
  on_comment_reply?: (comment_id: string, new_sub_comment: SubComment) => void
  on_comment_deleted?: (comment_id: string) => void
  on_sub_comment_deleted?: (sub_comment_id: string) => void
  on_comment_updated?: (new_comment: Comment) => void
  on_sub_comment_updated?: (new_sub_comment: SubComment) => void
}

export const CommentContext = createContext<CommentContextValue>({})
