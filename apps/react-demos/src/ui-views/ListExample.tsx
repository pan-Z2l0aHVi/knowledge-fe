import { Avatar, Divider, List, Tabs } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('small')
  return (
    <div>
      <h1>List</h1>
      <Divider />
      <List>
        <List.Item>List item 1</List.Item>
        <List.Item>List item 2</List.Item>
        <List.Item>List item 2</List.Item>
      </List>
      <Divider />
      <Tabs
        className="mb-8px"
        type="segment"
        value={size}
        onChange={setSize}
        tabList={[
          { key: 'small', name: 'Small' },
          { key: 'medium', name: 'Medium' },
          { key: 'large', name: 'Large' }
        ]}
      />
      <List size={size}>
        <List.Item>List item 1</List.Item>
        <List.Item>List item 2</List.Item>
        <List.Item>List item 2</List.Item>
      </List>
      <Divider />
      <List bordered={false}>
        <List.Item>Rimless list item 1</List.Item>
        <List.Item>Rimless list item 2</List.Item>
        <List.Item>Rimless list item 2</List.Item>
      </List>
      <Divider />
      <List>
        <List.Item prefix={<Avatar />}>Prefix list item 1</List.Item>
        <List.Item prefix={<Avatar />}>Prefix list item 2</List.Item>
        <List.Item prefix={<Avatar />}>Prefix list item 2</List.Item>
      </List>
      <Divider />
      <List>
        <List.Item suffix={<Avatar />}>Suffix list item 1</List.Item>
        <List.Item suffix={<Avatar />}>Suffix list item 2</List.Item>
        <List.Item suffix={<Avatar />}>Suffix list item 2</List.Item>
      </List>
    </div>
  )
}
