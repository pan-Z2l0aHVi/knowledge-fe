import { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react'
import { BiSolidChevronDown } from 'react-icons/bi'
import { TbNotes } from 'react-icons/tb'

import TransitionNavLink from '@/components/transition-nav-link'
import routes, { RouteItem } from '@/router/routes'
import { useSpaceStore, useUIStore } from '@/stores'
import { Motion, Tooltip } from '@youknown/react-ui/src'
import { cls, DeepRequired, pick } from '@youknown/utils/src'

type MenuRouteItem = Omit<RouteItem, 'children'> & {
	state: DeepRequired<RouteItem>['state']
	children: MenuRouteItem[]
}
interface MenuProps {
	expand: boolean
}
export default function Menu({ expand }: MenuProps) {
	const is_dark_theme = useUIStore(state => state.is_dark_theme)
	const space_list = useSpaceStore(state => state.space_list)

	const get_nav = (path: string) => {
		const route = routes.find(route => route.path === path)!
		return pick(route, 'path', 'state')
	}
	const get_library_nav = useCallback(() => {
		const route = routes.find(route => route.path === 'library')!
		return {
			...pick(route, 'path', 'state'),
			children: space_list.map(space => {
				return {
					path: space.space_id,
					state: {
						title: space.name,
						icon: <TbNotes />
					}
				}
			})
		}
	}, [space_list])

	const nav_list = useMemo(
		() =>
			[
				get_nav('browse'),
				get_library_nav(),
				get_nav('wallpapers'),
				get_nav('collection'),
				get_nav('history')
			] as MenuRouteItem[],
		[get_library_nav]
	)

	const [open_map, set_open_map] = useState<Record<string, boolean>>({})

	const set_open = (name: string, open: boolean) => {
		set_open_map(p => ({
			...p,
			[name]: open
		}))
	}

	return (
		<div className="flex-1 overflow-y-auto overflow-x-hidden select-none p-12px">
			{nav_list.map(menu_item => {
				const { path, state } = menu_item
				const { children = [] } = menu_item
				const has_sub_nav = children.length > 0

				const toggle_sub_menu = (e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					set_open(path, !open_map[path])
				}
				const chevron_down_icon = (
					<BiSolidChevronDown
						className={cls('color-text-2 transition-all', open_map[path] ? 'rotate-180' : 'rotate-0')}
					/>
				)
				const nav_content = (
					<>
						<div className="leading-0 text-18px color-primary">{state.icon}</div>
						<Motion.Fade in={expand} unmountOnExit>
							<div className="ml-8px flex-1 w-0 break-all ws-nowrap">{state.title}</div>
						</Motion.Fade>
						{has_sub_nav && (
							<>
								{expand ? (
									<div
										className={cls(
											'rd-radius-s w-24px h-24px flex items-center justify-center text-12px bg-inherit',
											is_dark_theme
												? 'active-brightness-120 hover-brightness-110'
												: 'active-brightness-90 hover-brightness-95'
										)}
										onClick={toggle_sub_menu}
									>
										{chevron_down_icon}
									</div>
								) : (
									<div
										className={cls(
											'flex items-center text-12px bg-inherit h-100% rd-tr-radius-m rd-br-radius-m',
											is_dark_theme
												? 'active-brightness-120 hover-brightness-110'
												: 'active-brightness-90 hover-brightness-95'
										)}
										onClick={toggle_sub_menu}
									>
										{chevron_down_icon}
									</div>
								)}
							</>
						)}
					</>
				)

				return (
					<Fragment key={path}>
						<Tooltip title={state.title} placement="right" spacing={20} disabled={expand}>
							<TransitionNavLink
								to={`/${path}`}
								end={open_map[path]}
								className={({ isActive }) =>
									cls(
										'group w-100% h-32px flex items-center pl-12px pr-4px rd-radius-m mb-8px decoration-none color-inherit',
										'active-bg-secondary-active hover-not-active-bg-secondary-hover',
										{
											'bg-secondary-hover': isActive
										}
									)
								}
								onClick={() => {
									set_open(path, true)
								}}
							>
								{nav_content}
							</TransitionNavLink>
						</Tooltip>

						{has_sub_nav && (
							<Motion.Collapse in={open_map[path]} className="w-100% mt-0! mb-0!" unmountOnExit>
								<Motion.Fade in={open_map[path]}>
									<div
										className={cls({
											'ml-32px': expand
										})}
									>
										{children.map(child => {
											return (
												<Tooltip
													key={child.path}
													title={child.state.title}
													placement="right"
													spacing={20}
													disabled={expand}
												>
													<TransitionNavLink
														to={`/${path}/${child.path}`}
														className={({ isActive }) =>
															cls(
																'group w-100% h-32px flex items-center pl-12px pr-4px rd-radius-m mb-8px decoration-none color-inherit',
																'active-bg-secondary-active hover-not-active-bg-secondary-hover',
																{
																	'bg-secondary-hover': isActive
																}
															)
														}
													>
														<div className="leading-0 text-18px color-primary">
															{child.state.icon}
														</div>
														<Motion.Fade in={expand} unmountOnExit>
															<div className="flex-1 break-all ws-nowrap ml-8px">
																{child.state.title}
															</div>
														</Motion.Fade>
													</TransitionNavLink>
												</Tooltip>
											)
										})}
									</div>
								</Motion.Fade>
							</Motion.Collapse>
						)}
					</Fragment>
				)
			})}
		</div>
	)
}
