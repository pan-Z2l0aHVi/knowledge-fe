import { useFetch } from '@youknown/react-hook/src'
import { Button, Collapse, Loading } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { FcBusinessContact, FcDocument, FcPicture } from 'react-icons/fc'
import { GoInbox } from 'react-icons/go'

import { get_collected_feed_list, get_collected_wallpaper_list, get_followed_users } from '@/apis/user'
import Header from '@/app/components/header'
import { useModalStore, useUserStore } from '@/stores'

import WallpaperCard from '../wallpapers/components/wallpaper-card'
import FeedCard from './components/feed-card'
import UserCard from './components/user-card'

const enum COLLECTION_TYPE {
  FEED = 1,
  USER = 2,
  WALLPAPER = 3
}

function EmptyCollection(props: { text: string }) {
  return (
    <div className="flex flex-col items-center color-text-3">
      <GoInbox className="text-32px mb-8px" />
      <div>{props.text}</div>
    </div>
  )
}

function FeedCollapsePanel() {
  const { t } = useTranslation()
  const { data: feed_list, mutate: set_feed_list, loading } = useFetch(get_collected_feed_list)
  const empty_visible = !loading && feed_list?.length === 0
  return (
    <Loading
      spinning={loading}
      className={cls('w-100%! min-h-178px flex items-center flex-wrap p-[16px_0]', {
        'justify-center': loading || empty_visible
      })}
    >
      {feed_list?.map(feed => (
        <FeedCard
          key={feed.id}
          className="sm:mr-16px mb-16px"
          feed={feed}
          on_removed={() => {
            set_feed_list(p => p?.filter(item => item.id !== feed.id))
          }}
        />
      ))}
      {empty_visible && <EmptyCollection text={t('collect.empty.feed')} />}
    </Loading>
  )
}

function UserCollapsePanel() {
  const { t } = useTranslation()
  const { data: user_list, mutate: set_user_list, loading } = useFetch(get_followed_users)
  const empty_visible = !loading && user_list?.length === 0
  return (
    <Loading
      spinning={loading}
      className={cls('w-100%! min-h-208px flex items-center flex-wrap p-[16px_0]', {
        'justify-center': loading || empty_visible
      })}
    >
      {user_list?.map(user => (
        <UserCard
          key={user.user_id}
          className="mr-16px mb-16px"
          user_info={user}
          on_removed={() => {
            set_user_list(p => p?.filter(item => item.user_id !== user.user_id))
          }}
        />
      ))}
      {empty_visible && <EmptyCollection text={t('follow.empty.user')} />}
    </Loading>
  )
}

function WallpaperCollapsePanel() {
  const { t } = useTranslation()
  const { data: wallpaper_list, mutate: set_wallpaper_list, loading } = useFetch(get_collected_wallpaper_list)
  const empty_visible = !loading && wallpaper_list?.length === 0
  return (
    <Loading
      spinning={loading}
      className={cls('w-100%! min-h-228px flex items-center flex-wrap p-[16px_0] ml--8px mr--8px', {
        'justify-center': loading || empty_visible
      })}
    >
      {wallpaper_list?.map(wallpaper => {
        return (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            on_removed={() => {
              set_wallpaper_list(p => p?.filter(item => item.id !== wallpaper.id))
            }}
          />
        )
      })}
      {empty_visible && <EmptyCollection text={t('collect.empty.wallpaper')} />}
    </Loading>
  )
}

export default function Collection() {
  const { t } = useTranslation()
  const has_login = useUserStore(state => state.has_login)
  const open_login_modal = useModalStore(state => state.open_login_modal)

  const login_guidance = (
    <>
      {!has_login && (
        <div className="flex flex-col items-center mt-40px">
          <span className="mb-24px color-text-2">{t('collect.login_tip')}</span>
          <Button primary onClick={open_login_modal}>
            {t('login.immediately')}
          </Button>
        </div>
      )}
    </>
  )

  const collection_list = (
    <>
      {has_login && (
        <Collapse defaultActives={[COLLECTION_TYPE.FEED]}>
          <Collapse.Panel
            className="bg-bg-2 rd-radius-m"
            itemKey={COLLECTION_TYPE.FEED}
            title={
              <div className="flex items-center h-32px select-none">
                <FcDocument className="text-20px ml-4px mr-8px" />
                <span className="color-text-2 font-600">{t('collect.feed')}</span>
              </div>
            }
            bordered={false}
          >
            <FeedCollapsePanel />
          </Collapse.Panel>
          <Collapse.Panel
            className="bg-bg-2 rd-radius-m"
            itemKey={COLLECTION_TYPE.USER}
            title={
              <div className="flex items-center h-32px select-none">
                <FcBusinessContact className="text-20px ml-4px mr-8px" />
                <span className="color-text-2 font-600">{t('follow.user')}</span>
              </div>
            }
            bordered={false}
          >
            <UserCollapsePanel />
          </Collapse.Panel>
          <Collapse.Panel
            className="bg-bg-2 rd-radius-m"
            itemKey={COLLECTION_TYPE.WALLPAPER}
            title={
              <div className="flex items-center h-32px select-none">
                <FcPicture className="text-20px ml-4px mr-8px" />
                <span className="color-text-2 font-600">{t('collect.wallpaper')}</span>
              </div>
            }
            bordered={false}
          >
            <WallpaperCollapsePanel />
          </Collapse.Panel>
        </Collapse>
      )}
    </>
  )

  return (
    <>
      <Header heading={t('page.title.collection')}></Header>

      <div className="sm:p-32px <sm:p-16px">
        {login_guidance}
        {collection_list}
      </div>
    </>
  )
}
