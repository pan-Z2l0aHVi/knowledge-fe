import React, { useEffect, useRef, useState } from 'react'
import { Checkbox, Divider, Space } from '@youknown/react-ui/src'

export default () => {
	const [val, setVal] = useState(false)
	const defaultGroupVal = [2]
	const [groupVal, setGroupVal] = useState<(string | number)[]>(defaultGroupVal)
	const checkboxRef = useRef<HTMLInputElement>(null)
	const defaultHorizontalVal = [0, 1]
	const [horizontalVal, setHorizontalVal] = useState<(string | number)[]>(defaultHorizontalVal)
	const defaultVerticalVal = [1]
	const [verticalVal, setVerticalVal] = useState<(string | number)[]>(defaultVerticalVal)
	const defaultJsxGroupVal = [2, 3]
	const [jsxGroupVal, setJsxGroupVal] = useState<(string | number)[]>(defaultJsxGroupVal)
	useEffect(() => {
		setTimeout(() => {
			console.log('checkboxRef.current.checked', checkboxRef.current?.checked)
		}, 1000)
	}, [])
	return (
		<div style={{ padding: 24 }}>
			<h1>Checkbox</h1>
			<Divider />
			<Space>
				<Checkbox defaultValue={true}>Basic</Checkbox>
				<Checkbox
					value={val}
					onChange={value => {
						if (typeof value === 'boolean') {
							setVal(value)
						}
					}}
				>
					Controlled
				</Checkbox>
			</Space>
			<Divider />
			<Space>
				<Checkbox size="small" defaultValue={true}>
					Small
				</Checkbox>
				<Checkbox size="medium" defaultValue={true}>
					Medium
				</Checkbox>
				<Checkbox size="large" defaultValue={true}>
					Large
				</Checkbox>
			</Space>
			<Divider />
			<Checkbox.Group
				options={[
					{
						label: 0,
						child: 'Cherry'
					},
					{
						label: 1,
						child: 'Apple'
					},
					{
						label: 2,
						child: 'Pear'
					},
					{
						label: 3,
						child: 'Orange',
						disabled: true
					}
				]}
				value={groupVal}
				onChange={value => {
					setGroupVal(value)
				}}
			/>
			<Divider />
			<Space direction="vertical">
				<Checkbox.Group
					direction="horizontal"
					options={[
						{ label: 0, child: 'Horizontal A' },
						{ label: 1, child: 'Horizontal B' },
						{ label: 2, child: 'Horizontal C' }
					]}
					value={horizontalVal}
					onChange={value => {
						setHorizontalVal(value)
					}}
				/>
				<Checkbox.Group
					direction="vertical"
					options={[
						{ label: 0, child: 'Vertical A' },
						{ label: 1, child: 'Vertical B' },
						{ label: 2, child: 'Vertical C' }
					]}
					value={verticalVal}
					onChange={value => {
						setVerticalVal(value)
					}}
				/>
			</Space>
			<Divider />
			<Checkbox ref={checkboxRef} defaultValue={true}>
				Forward ref
			</Checkbox>
			<Divider />
			<Space direction="vertical">
				<Checkbox disabled>Disabled</Checkbox>
				<Checkbox.Group
					disabled
					options={[
						{ label: 0, child: 'A' },
						{ label: 1, child: 'B' },
						{ label: 2, child: 'C' }
					]}
				/>
			</Space>
			<Divider />
			<Checkbox.Group
				direction="vertical"
				options={[
					{ label: 0, child: 'Options A' },
					{ label: 1, child: 'Options B' },
					{ label: 2, child: 'Options C' }
				]}
				value={jsxGroupVal}
				onChange={value => {
					setJsxGroupVal(value)
				}}
			>
				<Checkbox label={3}>JSX A</Checkbox>
				<Checkbox label={4}>JSX B</Checkbox>
				<Checkbox label={5}>JSX C</Checkbox>
			</Checkbox.Group>
		</div>
	)
}
