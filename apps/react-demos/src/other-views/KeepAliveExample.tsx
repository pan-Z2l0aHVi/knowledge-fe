import { Button, Divider, Input, KeepAlive, Tabs } from '@youknown/react-ui/src'
import { useState } from 'react'

const A = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <Button onClick={() => setCount(p => p + 1)}>Count+1</Button>
      count:{count}
    </>
  )
}

const B = () => {
  const [val, setVal] = useState('')
  return (
    <>
      <Input value={val} onChange={setVal} />
      input:{val}
    </>
  )
}

export default () => {
  const [tab, setTab] = useState<'a' | 'b'>('a')
  return (
    <>
      <h3>Without keep alive</h3>
      <Tabs
        type="segment"
        tabList={[
          { key: 'a', name: 'A Tab' },
          { key: 'b', name: 'B Tab' }
        ]}
        value={tab}
        onChange={setTab}
      />
      <div className="mt-16px">
        {tab === 'a' && <A />}
        {tab === 'b' && <B />}
      </div>

      <Divider />

      <h3>Using keep alive</h3>
      <Tabs
        type="segment"
        tabList={[
          { key: 'a', name: 'A Tab' },
          { key: 'b', name: 'B Tab' }
        ]}
        value={tab}
        onChange={setTab}
      />
      <div className="mt-16px">
        <KeepAlive show={tab === 'a'}>
          <A />
        </KeepAlive>
        <KeepAlive show={tab === 'b'}>
          <B />
        </KeepAlive>
      </div>
    </>
  )
}
