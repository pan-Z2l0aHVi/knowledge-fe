import { net } from '@/utils/request'

export interface Wallpaper {
	id: string
	url: string
	short_url: string
	views: number
	purity: string
	category: string
	dimension_x: number
	dimension_y: number
	ratio: string
	resolution: string
	file_size: number
	file_type: string
	created_at: string
	colors: string[]
	path: string
	thumbs: {
		large: string
		original: string
		small: string
	}
	tags: null
}

interface SearchWallpapersParams {
	page: number
	q: string
	ai_art_filter: number
	categories: string
	purity: string
	atleast: string
	ratios: string
	sorting: string
	topRange: string
	order: string
}

export const search_wallpapers = (params: SearchWallpapersParams) =>
	net.fetch<Wallpaper[]>('/proxy/wallpaper/search', {
		params
	})

interface GetWallpaperInfoParams {
	url: string
}
export const get_wallpaper_info = (params: GetWallpaperInfoParams) =>
	net.fetch<Wallpaper>('/proxy/wallpaper/info', {
		params
	})
