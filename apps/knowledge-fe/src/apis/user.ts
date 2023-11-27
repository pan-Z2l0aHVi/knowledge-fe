import { LOGIN_TYPE } from '@/consts'
import { net } from '@/utils/request'
import { Feed } from './feed'
import { Wallpaper } from './wallpaper'

export interface Profile {
	user_id: string
	associated: number
	github_id: number
	nickname: string
	avatar: string
	creation_time: string
	followed_user_ids: string[]
}

export interface LoginPayload {
	type: LOGIN_TYPE
	code: string
}
export const login = (payload: LoginPayload) =>
	net.fetch<
		Profile & {
			token: string
		}
	>('/proxy/user/sign_in', {
		method: 'post',
		payload
	})

export interface GetProfileParams {
	user_id?: string
}
export const get_profile = (params?: GetProfileParams) =>
	net.fetch<Profile>('/proxy/user/profile', {
		params
	})

export interface UpdateProfilePayload {
	nickname?: string
	avatar?: string
}
export const update_profile = (payload?: UpdateProfilePayload) =>
	net.fetch<Profile>('/proxy/user/profile', {
		method: 'post',
		payload
	})

export const get_yd_qrcode = () =>
	net.fetch<{
		qrcode_url: string
		temp_user_id: string
	}>('/proxy/user/yd_qrcode')

export interface CheckYDLoginStatusParams {
	temp_user_id: string
}
export const check_yd_login_status = (params?: CheckYDLoginStatusParams) =>
	net.fetch<{
		has_login: boolean
	}>('/proxy/user/yd_login_status', {
		params
	})

export const get_collected_feed_list = () =>
	net.fetch<{
		list: Feed[]
		total: number
	}>('/proxy/user/collected_feeds')

export interface CollectFeedPayload {
	feed_id: string
}
export const collect_feed = (payload: CollectFeedPayload) =>
	net.fetch('/proxy/user/collect_feed', {
		method: 'post',
		payload
	})

export const get_followed_users = () =>
	net.fetch<{
		list: Profile[]
		total: number
	}>('/proxy/user/followed_users')

export interface FollowUserPayload {
	user_id: string
}
export const follow_user = (payload: FollowUserPayload) =>
	net.fetch('/proxy/user/follow_user', {
		method: 'post',
		payload
	})

export interface UnFollowUserPayload {
	user_id: string
}
export const unfollow_user = (payload: UnFollowUserPayload) =>
	net.fetch('/proxy/user/unfollow_user', {
		method: 'post',
		payload
	})

export const get_collected_wallpaper_list = () =>
	net.fetch<{
		list: Wallpaper[]
		total: number
	}>('/proxy/user/collected_wallpapers')

export interface CollectWallpaperPayload {
	wallpaper: Wallpaper
}
export const collect_wallpaper = (payload: CollectWallpaperPayload) =>
	net.fetch('/proxy/user/collect_wallpaper', {
		method: 'post',
		payload
	})

export interface CancelCollectWallpaperPayload {
	wallpaper_id: string
}
export const cancel_collect_wallpaper = (payload: CancelCollectWallpaperPayload) =>
	net.fetch('/proxy/user/cancel_collect_wallpaper', {
		method: 'post',
		payload
	})
