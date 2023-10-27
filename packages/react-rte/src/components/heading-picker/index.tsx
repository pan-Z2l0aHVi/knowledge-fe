import './index.scss'

import { createElement } from 'react'
import { TbCheck } from 'react-icons/tb'

import { HeadingOptions, Level } from '@tiptap/extension-heading'
import { useBoolean } from '@youknown/react-hook/src'
import { Dropdown } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'

import { ButtonProps, UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

interface Option {
	value: 0 | Level
	label: string
	tagName: string
}
export default function HeadingPicker(props: ButtonProps<HeadingOptions>) {
	const { editor, tooltip = true, extension } = props

	const levels = extension?.options?.levels ?? []
	const headingOptions = levels
		.filter(level => level >= 1 && level <= 4)
		.map(level => ({
			value: level,
			label: `标题 ${level}`,
			tagName: `h${level}`
		}))
	const options: Option[] = [
		...headingOptions,
		{
			value: 0,
			label: '正文',
			tagName: 'span'
		}
	]
	const [open, { setBool: setOpen }] = useBoolean(false)

	let selection = options.find(opt => opt.value === 0)!
	for (const opt of options) {
		if (editor.isActive('heading', { level: opt.value })) {
			selection = opt
			break
		}
	}

	const isMainText = (value: Option['value']): value is 0 => value === 0

	const handleSelect = (opt: Option) => {
		const level = opt.value
		if (!isMainText(level)) {
			editor.chain().focus().setHeading({ level }).run()
		} else {
			editor.chain().focus().toggleNode('paragraph', 'paragraph').run()
		}
	}
	const prefixCls = `${UI_EDITOR_PREFIX}-heading-picker`
	return (
		<Dropdown
			trigger="click"
			onOpenChange={setOpen}
			content={
				<Dropdown.Menu className={`${prefixCls}-dropdown`} closeAfterItemClick>
					{options.map(opt => {
						const heading = createElement(opt.tagName, {}, opt.label)
						const active = selection.value === opt.value
						const iconCls = `${prefixCls}-dropdown-item-icon`
						return (
							<Dropdown.Item
								key={opt.value}
								className={`${prefixCls}-dropdown-item`}
								prefix={active ? <TbCheck className={iconCls} /> : <div className={iconCls}></div>}
								onClick={() => handleSelect(opt)}
							>
								{heading}
							</Dropdown.Item>
						)
					})}
				</Dropdown.Menu>
			}
		>
			<CommandBtn tooltip="标题" tooltipDisabled={!tooltip} className={cls(prefixCls)} active={open} arrow>
				<div className={`${prefixCls}-label`}>{selection.label}</div>
			</CommandBtn>
		</Dropdown>
	)
}
