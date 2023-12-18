import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { search_wallpapers, SearchWallpapersParams, Wallpaper } from '@/apis/wallpaper'
import Header from '@/app/components/header'
import MoreLoading from '@/components/more-loading'
import NoMore from '@/components/no-more'
import { useCreation, useEvent, useInfinity, useMount, useUnmount, useUpdate } from '@youknown/react-hook/src'
import { Form } from '@youknown/react-ui/src'
import { checkPWA, cls, macroDefer, QS, storage } from '@youknown/utils/src'

import WallpaperCard from './components/wallpaper-card'
import WallpaperFilter, {
	CATE,
	filterState,
	ImperativeHandle,
	ORDER,
	PURITY,
	SWITCH,
	WallpaperQuery
} from './components/wallpaper-filter'

const FILTER_STATE_KEY = 'wallpaper_filter_state'
const FILTER_KEYWORDS_KEY = 'wallpaper_filter_keywords'
const WALLPAPERS_KEY = 'wallpapers'
const WALLPAPER_PAGE_KEY = 'wallpaper_page'
const WALLPAPER_SCROLL_Y_KEY = 'wallpaper_scroll_y'

export default function Wallpapers() {
	const [search_params] = useSearchParams()
	const update = useUpdate()
	const loading_ref = useRef<HTMLDivElement>(null)
	const wrapper_ref = useRef<HTMLDivElement>(null)

	const default_keywords = useCreation(
		() => search_params.get('keywords') ?? storage.session.get(FILTER_KEYWORDS_KEY) ?? ''
	)
	const [keywords, set_keywords] = useState(default_keywords)
	const session_filter_state = useCreation(() => storage.session.get<filterState>(FILTER_STATE_KEY))
	const keywords_filter_ref = useRef<ImperativeHandle>(null)
	const [params, set_params] = useState<WallpaperQuery>()

	const form = Form.useForm<filterState>({
		defaultState: session_filter_state ?? {
			ai_art_filter: SWITCH.OFF,
			categories: [CATE.GENERAL, CATE.ANIME, CATE.PEOPLE],
			purity: [PURITY.SFW],
			atleast: '0x0',
			ratios: '',
			sorting: 'toplist',
			topRange: '1M',
			order: ORDER.DESC
		},
		onFulfilled() {
			reload_wallpapers()
		},
		onStateChange(org) {
			storage.session.set(FILTER_STATE_KEY, form.getState())
			update_params()

			switch (org.label) {
				case 'sorting':
					update()
					break

				case 'ratios':
					update()
					break

				default:
					break
			}
		}
	})

	const update_params = useEvent(() => {
		const state = form.getState()
		const categories_arr = Array(3).fill(SWITCH.OFF)
		const purity_arr = Array(3).fill(SWITCH.OFF)
		if (state.categories.includes(CATE.GENERAL)) {
			categories_arr[0] = SWITCH.ON
		}
		if (state.categories.includes(CATE.ANIME)) {
			categories_arr[1] = SWITCH.ON
		}
		if (state.categories.includes(CATE.PEOPLE)) {
			categories_arr[2] = SWITCH.ON
		}
		if (state.purity.includes(PURITY.SFW)) {
			purity_arr[0] = SWITCH.ON
		}
		if (state.purity.includes(PURITY.SKETCHY)) {
			purity_arr[1] = SWITCH.ON
		}
		if (state.purity.includes(PURITY.NSFW)) {
			purity_arr[2] = SWITCH.ON
		}
		set_params({
			...state,
			keywords,
			categories: categories_arr.join(''),
			purity: purity_arr.join('')
		})
	})

	useEffect(() => {
		update_params()
	}, [update_params])

	const wallpapers_cache = useCreation(() => storage.session.get<Wallpaper[]>(WALLPAPERS_KEY) ?? [])
	const wallpaper_page_cache = useCreation(() => storage.session.get<number>(WALLPAPER_PAGE_KEY) ?? 1)

	const wallpaper_fetcher = async () => {
		const { keywords, ai_art_filter, atleast, ratios, sorting, topRange, order, categories, purity } = params!
		const search_params: SearchWallpapersParams = {
			ai_art_filter,
			categories,
			purity,
			atleast,
			ratios,
			sorting,
			topRange,
			order,
			page
		}
		if (keywords) {
			search_params.q = keywords
		}
		return search_wallpapers(search_params)
	}
	const {
		page,
		data: wallpapers,
		loading,
		noMore: no_more,
		reload,
		changePage: change_page
	} = useInfinity(wallpaper_fetcher, {
		initialData: wallpapers_cache,
		initialPage: wallpaper_page_cache,
		initialPageSize: 48,
		ready: !!params,
		target: loading_ref,
		observerInit: {
			root: null,
			rootMargin: '0px 0px 280px 0px'
		}
	})

	const reload_wallpapers = () => {
		change_page(0)
		macroDefer(reload)
	}

	// 从缓存中恢复之前的浏览状态
	// 包括：页码、壁纸数据、滚动条位置
	const restore_scroll_y = () => {
		const scroll_y_cache = storage.session.get<number>(WALLPAPER_SCROLL_Y_KEY)
		if (scroll_y_cache) {
			storage.session.remove(WALLPAPER_SCROLL_Y_KEY)
			window.scrollTo({
				top: scroll_y_cache,
				behavior: 'instant'
			})
		}
	}
	useMount(() => {
		restore_scroll_y()
	})
	useUnmount(() => {
		storage.session.set(WALLPAPER_SCROLL_Y_KEY, window.scrollY)
	})
	useEffect(() => {
		storage.session.set(WALLPAPER_PAGE_KEY, page)
	}, [page])
	useEffect(() => {
		storage.session.set(WALLPAPERS_KEY, wallpapers)
	}, [wallpapers])

	const search_in_current_page = (similar_keywords: string) => {
		set_keywords(similar_keywords)
		window.scrollTo({
			top: 0,
			behavior: 'instant'
		})
		keywords_filter_ref.current?.focus_keywords_input()
		macroDefer(() => {
			update_params()
			reload_wallpapers()
		})
	}

	const search_open_new_page = (similar_keywords: string) => {
		window.open(
			QS.stringify({
				base: '/wallpapers',
				query: {
					keywords: similar_keywords
				}
			}),
			'_blank'
		)
	}

	const wallpaper_list = (
		<div
			ref={wrapper_ref}
			className={cls('grid gap-16px items-center justify-center', 'grid-cols-[repeat(auto-fill,320px)]')}
		>
			{wallpapers.map(wallpaper => (
				<WallpaperCard
					key={wallpaper.id}
					wallpaper={wallpaper}
					search_similar={() => {
						const similar_keywords = `like:${wallpaper.id}`
						if (checkPWA()) {
							search_in_current_page(similar_keywords)
						} else {
							search_open_new_page(similar_keywords)
						}
					}}
				/>
			))}
		</div>
	)

	return (
		<>
			<Header heading="壁纸"></Header>

			<div className="p-[16px_16px_0]">
				<WallpaperFilter
					ref={keywords_filter_ref}
					form={form}
					keywords={keywords}
					on_keywords_input={val => {
						storage.session.set(FILTER_KEYWORDS_KEY, val)
						set_keywords(val)
						macroDefer(() => {
							update_params()
						})
					}}
					loading={loading}
					on_search={reload_wallpapers}
					on_reset={reload_wallpapers}
				/>
			</div>
			<div className="p-[0_32px]">
				<div className="mt-32px min-h-20vh">{wallpaper_list}</div>

				{no_more ? <NoMore /> : <MoreLoading ref={loading_ref} />}
			</div>
		</>
	)
}
