import { get_collected_feed_list, get_collected_wallpaper_list, get_followed_users, Profile } from '@/apis/user'
import Header from '@/app/components/header'
import { useUserStore } from '@/stores'
import { useFetch } from '@youknown/react-hook/src'
import { Collapse, Loading } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'

import WallpaperCard from '../wallpapers/components/wallpaper-card'
import FeedCard from './components/feed-card'
import UserCard from './components/user-card'
import { GoInbox } from 'react-icons/go'

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
	const { data: feed_list, mutate: set_feed_list, loading } = useFetch(get_collected_feed_list)
	const empty_visible = !loading && feed_list?.length === 0
	return (
		<Loading
			spinning={loading}
			className={cls('w-100%! min-h-120px flex items-center flex-wrap p-[16px_0]', {
				'justify-center': loading || empty_visible
			})}
		>
			{feed_list?.map(feed => (
				<FeedCard
					key={feed.feed_id}
					className="mr-16px mb-16px"
					feed={feed}
					on_removed={() => {
						set_feed_list(p => p?.filter(item => item.feed_id !== feed.feed_id))
					}}
				/>
			))}
			{empty_visible && <EmptyCollection text="没有收藏的动态" />}
		</Loading>
	)
}

function UserCollapsePanel() {
	const { data: user_list, mutate: set_user_list, loading } = useFetch(get_followed_users)
	const empty_visible = !loading && user_list?.length === 0
	return (
		<Loading
			spinning={loading}
			className={cls('w-100%! min-h-120px flex items-center flex-wrap p-[16px_0]', {
				'justify-center': loading
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
			{empty_visible && <EmptyCollection text="没有关注的用户" />}
		</Loading>
	)
}

function WallpaperCollapsePanel() {
	const { data: wallpaper_list, mutate: set_wallpaper_list, loading } = useFetch(get_collected_wallpaper_list)
	const empty_visible = !loading && wallpaper_list?.length === 0
	return (
		<Loading
			spinning={loading}
			className={cls('w-100%! min-h-120px flex items-center flex-wrap p-[16px_0]', {
				'justify-center': loading
			})}
		>
			{wallpaper_list?.map(wallpaper => {
				return (
					<WallpaperCard
						key={wallpaper.id}
						className="mr-16px mb-16px"
						wallpaper={wallpaper}
						on_removed={() => {
							set_wallpaper_list(p => p?.filter(item => item.id !== wallpaper.id))
						}}
					/>
				)
			})}
			{empty_visible && <EmptyCollection text="没有收藏的壁纸" />}
		</Loading>
	)
}

export default function Collection() {
	const has_login = useUserStore(state => state.has_login)

	return (
		<>
			<Header heading="收藏夹"></Header>

			<div className="p-32px">
				<Collapse accordion defaultActives={[COLLECTION_TYPE.FEED]}>
					<Collapse.Panel
						className="bg-bg-2 rd-radius-m"
						itemKey={COLLECTION_TYPE.FEED}
						title={<span className="color-text-2 font-600">收藏的文档</span>}
						bordered={false}
					>
						<FeedCollapsePanel />
					</Collapse.Panel>
					<Collapse.Panel
						className="bg-bg-2 rd-radius-m"
						itemKey={COLLECTION_TYPE.USER}
						title={<span className="color-text-2 font-600">我关注的用户</span>}
						bordered={false}
					>
						<UserCollapsePanel />
					</Collapse.Panel>
					<Collapse.Panel
						className="bg-bg-2 rd-radius-m"
						itemKey={COLLECTION_TYPE.WALLPAPER}
						title={<span className=" color-text-2 font-600">收藏的壁纸</span>}
						bordered={false}
					>
						<WallpaperCollapsePanel />
					</Collapse.Panel>
				</Collapse>
			</div>
		</>
	)
}
