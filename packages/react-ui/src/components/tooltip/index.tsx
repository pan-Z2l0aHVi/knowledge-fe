import './tooltip.scss'

import { Children, cloneElement, ComponentProps, ForwardedRef, forwardRef, isValidElement } from 'react'

import { checkHoverSupported, cls, pick, pickDataAttrs } from '@youknown/utils/src'

import { UI_PREFIX } from '../../constants'
import Trigger, { EventsByTriggerNeed } from '../trigger'

interface TooltipProps extends Omit<ComponentProps<typeof Trigger>, 'popup' | 'motion'> {
	title?: string
	light?: boolean
}

const Tooltip = (props: TooltipProps, propRef: ForwardedRef<HTMLElement>) => {
	const {
		children,
		title = '',
		light = false,
		placement = 'top',
		open,
		defaultOpen,
		trigger = 'hover',
		mouseEnterDelay,
		mouseLeaveDelay,
		spacing,
		crossOffset,
		disabled,
		unmountOnExit = true,
		appendTo,
		onClickOutside,
		onOpenChange,
		...rest
	} = props

	const prefixCls = `${UI_PREFIX}-tooltip`

	const popup = (
		<div className={cls(`${prefixCls}-content`, `${prefixCls}-content-${light ? 'light' : 'dark'}`)}>{title}</div>
	)
	const triggerEle = Children.map(children, child =>
		isValidElement(child)
			? cloneElement(child, {
					...pick(rest, ...EventsByTriggerNeed),
					...pickDataAttrs(rest)
				})
			: child
	)

	return (
		<Trigger
			ref={propRef}
			popup={popup}
			placement={placement}
			open={open}
			defaultOpen={defaultOpen}
			trigger={trigger}
			disabled={(trigger === 'hover' && !checkHoverSupported()) || disabled}
			mouseEnterDelay={mouseEnterDelay}
			mouseLeaveDelay={mouseLeaveDelay}
			spacing={spacing}
			unmountOnExit={unmountOnExit}
			crossOffset={crossOffset}
			appendTo={appendTo}
			onClickOutside={onClickOutside}
			onOpenChange={onOpenChange}
			motion="grow"
			ariaRole="tooltip"
		>
			{triggerEle}
		</Trigger>
	)
}
Tooltip.displayName = 'Tooltip'
export default forwardRef(Tooltip)
