import { Tooltip } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import React, { useContext } from 'react'
import { TbCodeOff } from 'react-icons/tb'
import ToolbarContext from '../toolbar-context'
import './index.scss'

export default function CodeOff() {
	const { editor } = useContext(ToolbarContext)
	return (
		<Tooltip placement="bottom" title="取消代码">
			<div
				className={cls('g-code-off', {
					disabled: !editor.can().unsetAllMarks()
				})}
				onClick={() => {
					editor.chain().focus().clearNodes().unsetAllMarks().run()
				}}
			>
				<TbCodeOff />
			</div>
		</Tooltip>
	)
}
