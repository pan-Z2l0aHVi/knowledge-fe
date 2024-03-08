import './notice.scss'

import { cls } from '@youknown/utils/src'
import {
	ForwardedRef,
	forwardRef,
	HTMLAttributes,
	MouseEventHandler,
	ReactNode,
	useCallback,
	useEffect,
	useRef
} from 'react'

import { UI_PREFIX } from '../../constants'

interface NoticeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
	content?: ReactNode
	icon?: ReactNode
	duration?: number
	onClose?: () => void
}

const Notice = (props: NoticeProps, propRef: ForwardedRef<HTMLDivElement>) => {
	const { className, content, icon, duration = 2000, onClose, onMouseEnter, onMouseLeave, ...rest } = props

	const timer = useRef(0)

	const startTimer = useCallback(() => {
		if (duration === Infinity) {
			return
		}
		timer.current = window.setTimeout(() => {
			onClose?.()
		}, duration)
	}, [duration, onClose])

	const stopTimer = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current)
		}
	}, [])

	useEffect(() => {
		stopTimer()
		startTimer()
	}, [startTimer, stopTimer])

	useEffect(
		() => () => {
			stopTimer()
		},
		[stopTimer]
	)

	const handleMouseEnter: MouseEventHandler<HTMLDivElement> = event => {
		onMouseEnter?.(event)
		stopTimer()
	}
	const handleMouseLeave: MouseEventHandler<HTMLDivElement> = event => {
		onMouseLeave?.(event)
		stopTimer()
		startTimer()
	}

	const prefixCls = `${UI_PREFIX}-notice`

	return (
		<div
			ref={propRef}
			className={cls(className, prefixCls)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...rest}
		>
			{icon}
			<div
				className={cls(`${prefixCls}-content-wrapper`, {
					[`${prefixCls}-content-wrapper-with-icon`]: icon
				})}
			>
				{content}
			</div>
		</div>
	)
}
Notice.displayName = 'Notice'
export default forwardRef(Notice)
