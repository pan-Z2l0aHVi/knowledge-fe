import { useFetch } from '@youknown/react-hook/src'
import { Anchor, Button, Image, Loading, Toast } from '@youknown/react-ui/src'
import { QS } from '@youknown/utils/src'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LuHeart, LuHeartOff } from 'react-icons/lu'
import { TbPencil } from 'react-icons/tb'
import { useLocation, useSearchParams } from 'react-router-dom'

import type { Feed } from '@/apis/feed'
import { get_feed_info } from '@/apis/feed'
import { cancel_collect_feed, collect_feed } from '@/apis/user'
import Header from '@/app/components/header'
import RichTextArea from '@/components/rich-text-area'
import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { useModalStore, useRecordStore, useUIStore, useUserStore } from '@/stores'
import { HeadingLeaf, prase_heading_tree } from '@/utils'
import { with_api } from '@/utils/request'

import CommentArea from './components/comment-area'
import DescArea from './components/desc-area'
import LikeArea from './components/like-area'
import RelatedArea from './components/related-area'

export default function FeedDetail() {
  const { t } = useTranslation()
  const is_mobile = useUIStore(state => state.is_mobile)
  const recording = useRecordStore(state => state.recording)
  const profile = useUserStore(state => state.profile)
  const has_login = useUserStore(state => state.has_login)
  const open_login_modal = useModalStore(state => state.open_login_modal)
  const navigate = useTransitionNavigate()
  const [search_params] = useSearchParams()
  const feed_id = search_params.get('feed_id') ?? ''
  const { state: feed_state }: { state: Feed } = useLocation()

  const record_read_feed = (feed_info: Feed) => {
    recording({
      action: 'record.read',
      target: feed_info.creator.nickname,
      target_id: feed_info.creator_id,
      obj_type: 'record.public_doc',
      obj: feed_info.subject.title,
      obj_id: feed_info.id
    })
  }

  const record_collect_feed = (action: string, feed_info?: Feed) => {
    if (!feed_info) {
      return
    }
    recording({
      action,
      target: feed_info.creator.nickname,
      target_id: feed_info.creator_id,
      obj_type: 'record.public_doc',
      obj: feed_info.subject.title,
      obj_id: feed_info.id
    })
  }

  const {
    data: detail,
    loading,
    mutate: set_detail
  } = useFetch(get_feed_info, {
    initialData: feed_state,
    params: [
      {
        feed_id
      }
    ],
    ready: !!feed_id,
    refreshDeps: [feed_id],
    onSuccess(data) {
      record_read_feed(data)
    }
  })
  useEffect(() => {
    if (feed_state) {
      set_detail(feed_state)
    }
  }, [feed_state, set_detail])

  const [collect_loading, set_collect_loading] = useState(false)
  const [cancel_collect_loading, set_cancel_collect_loading] = useState(false)
  const handle_collect_feed = async () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    set_collect_loading(true)
    const [err] = await with_api(collect_feed)({
      feed_id
    })
    set_collect_loading(false)
    if (err) {
      return
    }
    record_collect_feed('record.collect', detail)
    Toast.success(t('collect.success'))
    set_detail(p => (p ? { ...p, collected: true } : p))
  }
  const handle_cancel_collect_feed = async () => {
    if (!has_login) {
      open_login_modal()
      return
    }
    set_cancel_collect_loading(true)
    const [err] = await with_api(cancel_collect_feed)({
      feed_id
    })
    set_cancel_collect_loading(false)
    if (err) {
      return
    }
    record_collect_feed('record.cancel_collect', detail)
    Toast.success(t('collect.cancel.success'))
    set_detail(p => (p ? { ...p, collected: false } : p))
  }

  const go_doc_editor = () => {
    if (!detail) {
      return
    }
    const doc_editor_url = QS.stringify({
      base: `/library/${detail.subject.space_id}/editor`,
      query: {
        doc_id: detail.subject.doc_id
      }
    })
    navigate(doc_editor_url, {
      state: detail.subject
    })
  }

  const doc_content = detail?.subject.content ?? ''
  const rich_text_container_ref = useRef<HTMLDivElement>(null)
  const [anchor_items, set_anchor_items] = useState<HeadingLeaf[]>([])

  useEffect(() => {
    const tree = prase_heading_tree(doc_content)
    console.log('tree: ', tree)
    set_anchor_items(tree)
  }, [doc_content])

  const is_owner = detail?.creator_id === profile?.user_id
  const action_btn = detail && (
    <>
      {is_owner ? (
        <>
          {is_mobile ? (
            <Button text square onClick={go_doc_editor}>
              <TbPencil className="color-primary text-18px" />
            </Button>
          ) : (
            <Button prefixIcon={<TbPencil className="color-primary text-16px" />} onClick={go_doc_editor}>
              {t('edit.text')}
            </Button>
          )}
        </>
      ) : (
        <>
          {detail.collected ? (
            <>
              {is_mobile ? (
                <Button text square loading={cancel_collect_loading} onClick={handle_cancel_collect_feed}>
                  <LuHeartOff className="color-danger text-18px" />
                </Button>
              ) : (
                <Button
                  prefixIcon={<LuHeartOff className="color-danger" />}
                  loading={cancel_collect_loading}
                  onClick={handle_cancel_collect_feed}
                >
                  <span className="color-danger">{t('collect.cancel.text')}</span>
                </Button>
              )}
            </>
          ) : (
            <>
              {is_mobile ? (
                <Button text square loading={collect_loading} onClick={handle_collect_feed}>
                  <LuHeart className="color-primary text-18px" />
                </Button>
              ) : (
                <Button
                  prefixIcon={<LuHeart className="color-primary" />}
                  loading={collect_loading}
                  onClick={handle_collect_feed}
                >
                  {t('collect.text')}
                </Button>
              )}
            </>
          )}
        </>
      )}
    </>
  )

  const feed_content = (
    <div className="flex-1 sm:w-720px">
      {detail?.subject.cover && (
        <Image
          className="w-100% max-h-30vh min-h-80px b-1 b-solid b-divider rd-radius-m mb-16px"
          src={detail.subject.cover}
          previewSrc={detail.subject.cover}
          canPreview
          alt="Cover"
        />
      )}
      <RichTextArea ref={rich_text_container_ref} className="text-16px" html={doc_content} />
      {detail && (
        <>
          <DescArea feed={detail} />
          <LikeArea feed={detail} />
          <RelatedArea feed={detail} />
          <CommentArea feed={detail} />
        </>
      )}
    </div>
  )

  return (
    <>
      <Header heading={detail?.subject.title || t('detail')}>{action_btn}</Header>

      {!feed_state && loading ? (
        <div className="flex justify-center items-center w-100% mt-40%">
          <Loading spinning size="large" />
        </div>
      ) : (
        <div className="flex sm:p-24px <sm:p-16px sm:m-auto <sm:w-100%">
          {feed_content}
          {is_mobile || (
            <Anchor
              className="sticky top-80px ml-40px w-200px max-h-70vh h-max overflow-y-auto"
              offsetY={56}
              items={anchor_items}
            />
          )}
        </div>
      )}
    </>
  )
}
