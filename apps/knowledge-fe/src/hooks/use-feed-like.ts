import { useFetch } from '@youknown/react-hook/src'
import { useEffect, useState } from 'react'

import type { Feed } from '@/apis/feed'
import { like_feed } from '@/apis/feed'
import { useModalStore, useRecordStore, useUserStore } from '@/stores'

export function useFeedLike(feed: Feed) {
  const { id, likes } = feed
  const has_login = useUserStore(state => state.has_login)
  const profile = useUserStore(state => state.profile)
  const recording = useRecordStore(state => state.recording)
  const open_login_modal = useModalStore(state => state.open_login_modal)

  const [liked, set_liked] = useState(false)
  useEffect(() => {
    if (profile) {
      const is_liked = likes.some(like => like.user_id === profile.user_id)
      set_liked(is_liked)
    } else {
      set_liked(false)
    }
  }, [likes, profile])

  const [like_list, set_like_list] = useState(likes)
  useEffect(() => {
    set_like_list(likes)
  }, [likes])

  const record_like_feed = (action: string) => {
    recording({
      action,
      target: feed.creator.nickname,
      target_id: feed.creator_id,
      obj_type: 'record.public_doc',
      obj: feed.subject.title,
      obj_id: id
    })
  }

  const increase_likes = () => {
    if (!profile) {
      return
    }
    set_liked(true)
    set_like_list(p => [
      {
        user_id: profile.user_id,
        nickname: profile.nickname,
        avatar: profile.avatar,
        creation_time: new Date().toISOString()
      },
      ...p
    ])
  }

  const reduce_likes = () => {
    if (!profile) {
      return
    }
    set_liked(false)
    set_like_list(p => p.filter(item => item.user_id !== profile.user_id))
  }

  const { run: do_like_or_dislike } = useFetch(like_feed, {
    manual: true,
    params: [
      {
        event: liked ? 'unlike' : 'like',
        feed_id: id
      }
    ],
    async onBefore([{ event }]) {
      if (event === 'like') {
        increase_likes()
      } else if (event === 'unlike') {
        reduce_likes()
      }
    },
    onSuccess(_, [{ event }]) {
      if (event === 'like') {
        record_like_feed('record.like')
      } else if (event === 'unlike') {
        record_like_feed('record.unlike')
      }
    },
    onError(error, [{ event }]) {
      console.error('error: ', error)
      if (event === 'like') {
        reduce_likes()
      } else if (event === 'unlike') {
        increase_likes()
      }
    }
  })

  const toggle_like = () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    do_like_or_dislike()
  }

  return {
    like_list,
    like_count: like_list.length,
    liked,
    toggle_like
  }
}
