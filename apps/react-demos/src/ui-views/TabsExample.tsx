import { Divider, Space, Tabs } from '@youknown/react-ui/src'
import type { ComponentPropsWithRef } from 'react'
import { useState } from 'react'

export default () => {
  const [tabsType, setTabsType] = useState<'line' | 'round' | 'segment'>('line')

  const tabList1 = [
    {
      key: 'a',
      name: 'Tab A'
    },
    {
      key: 'b',
      name: 'Tab B',
      disabled: true
    },
    {
      key: 'c',
      name: 'Tab C'
    },
    {
      key: 'd',
      name: 'Tab D'
    }
  ]
  const [tabKey, setTabKey] = useState(tabList1[0].key)
  type TabsProps = ComponentPropsWithRef<typeof Tabs<string>>
  const [closableList, setClosableTabList] = useState<Required<TabsProps['tabList']>>([
    {
      key: 'a',
      name: 'Tab A',
      closable: true
    },
    {
      key: 'b',
      name: 'Tab B',
      closable: true
    },
    {
      key: 'c',
      name: 'Tab C',
      closable: true
    },
    {
      key: 'd',
      name: 'Tab D',
      closable: true
    }
  ])
  const [closableTabKey, setCloseableTabKey] = useState('a')

  return (
    <div>
      <h1>Tabs</h1>
      <Divider />
      <Tabs
        type="segment"
        tabList={[
          { key: 'line', name: 'Line Tab' },
          { key: 'round', name: 'Round Tab' },
          { key: 'segment', name: 'Segment Tab' }
        ]}
        value={tabsType}
        onChange={setTabsType}
      />
      <Divider />
      <Space>
        <Tabs type={tabsType} value={tabKey} onChange={setTabKey} tabList={tabList1} />
      </Space>
      <Divider />
      <Space>
        <Tabs
          type={tabsType}
          value={closableTabKey}
          onChange={setCloseableTabKey}
          tabList={closableList}
          onTabListChange={setClosableTabList}
        />
      </Space>
      <Divider />
    </div>
  )
}
