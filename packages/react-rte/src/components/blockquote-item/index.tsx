import './index.scss'

import { RiDoubleQuotesL } from 'react-icons/ri'

import { Editor } from '@tiptap/react'
import { Dropdown } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'

import { UI_EDITOR_PREFIX } from '../../common'

export default function BlockquoteItem(props: { editor: Editor }) {
	const { editor } = props
	const prefixCls = `${UI_EDITOR_PREFIX}-blockquote-item`
	return (
		<Dropdown.Item
			prefix={
				<div
					className={cls(prefixCls, {
						active: editor.isActive('blockquote'),
						disabled: !editor.can().toggleBlockquote()
					})}
				>
					<RiDoubleQuotesL />
				</div>
			}
			closeAfterItemClick
			onClick={() => {
				editor.chain().focus().toggleBlockquote().run()
			}}
		>
			引用
		</Dropdown.Item>
	)
}
