import './avatar.scss'

import { ForwardedRef, forwardRef, HTMLAttributes, ReactEventHandler, ReactNode, SyntheticEvent, useState } from 'react'

import { cls, is } from '@youknown/utils/src'

import { UI_PREFIX } from '../../constants'
import AvatarGroup from './avatarGroup'

interface AvatarProps extends HTMLAttributes<HTMLElement> {
	size?: 'small' | 'medium' | 'large' | number
	round?: boolean
	color?: string
	src?: string
	fallback?: ReactNode
	badge?: ReactNode
	onError?: ReactEventHandler<HTMLImageElement>
}

const Avatar = (props: AvatarProps, ref: ForwardedRef<HTMLDivElement>) => {
	const {
		children,
		className,
		size = 'medium',
		src,
		round = false,
		color = 'var(--ui-bg-3)',
		fallback,
		badge,
		style,
		onError,
		...rest
	} = props

	const prefixCls = `${UI_PREFIX}-avatar`

	const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event>>()
	const imgEle = error ? (
		fallback
	) : (
		<img
			className={`${prefixCls}-img`}
			src={src}
			onError={err => {
				onError?.(err)
				setError(err)
			}}
		/>
	)

	const avatarStyle = is.number(size)
		? {
				...style,
				backgroundColor: color,
				width: `${size}px`,
				height: `${size}px`,
				minWidth: `${size}px`,
				minHeight: `${size}px`
		  }
		: {
				...style,
				backgroundColor: color
		  }

	return (
		<div
			ref={ref}
			className={cls(className, prefixCls, is.string(size) && `${prefixCls}-${size}`, {
				[`${prefixCls}-round`]: round
			})}
			style={avatarStyle}
			{...rest}
		>
			{children || imgEle}
			{badge && <div className={`${prefixCls}-badge`}>{badge}</div>}
		</div>
	)
}
Avatar.displayName = 'Avatar'

const RefAvatar = forwardRef(Avatar)
const ExportAvatar = RefAvatar as typeof RefAvatar & {
	Group: typeof AvatarGroup
}
ExportAvatar.Group = AvatarGroup

export default ExportAvatar
