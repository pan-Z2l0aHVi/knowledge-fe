import { Divider, Space, Switch } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [checked, setChecked] = useState<boolean>(false)
  return (
    <div>
      <h1>Switch</h1>
      <Divider />
      <Space>
        <Switch defaultValue={true} />
        <Switch onChange={console.log} />
        <Switch value={checked} onChange={setChecked} />
        <Switch disabled defaultValue={true} />
        <Switch disabled />
      </Space>
      <Divider />
      <Space>
        <Switch size="small" />
        <Switch size="medium" />
        <Switch size="large" />
      </Space>
    </div>
  )
}
