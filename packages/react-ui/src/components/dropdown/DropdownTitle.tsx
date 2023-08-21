import './dropdown-title.scss'

import { ForwardedRef, forwardRef, HTMLAttributes } from 'react'

import { cls } from '@youknown/utils/src'

import { UI_PREFIX } from '../../constants'

type DropdownTitleProps = HTMLAttributes<HTMLElement>

const DropdownTitle = (props: DropdownTitleProps, ref: ForwardedRef<HTMLDivElement>) => {
	const { className, children, ...rest } = props

	const prefixCls = `${UI_PREFIX}-dropdown-title`

	return (
		<div ref={ref} className={cls(className, prefixCls)} {...rest}>
			{children}
		</div>
	)
}
DropdownTitle.displayName = 'DropdownTitle'
const RefDropdownTitle = forwardRef(DropdownTitle)
export default RefDropdownTitle
