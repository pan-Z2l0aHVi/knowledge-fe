import { Divider, Slider, Space } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [value, setValue] = useState(70)
  return (
    <div>
      <h1>Slider</h1>
      <Divider />
      <Space className="w-320px" direction="vertical" size="large">
        <Slider />
        <Slider value={value} onChange={setValue} />
        <Slider defaultValue={30} />
        <Slider disabled defaultValue={30} />
        <Slider min={20} max={80} />
        <Slider min={-40} max={40} />
        <Slider tooltipFormatter={val => `${val.toFixed(1)}%`} />
        <Slider step={10} />
      </Space>
      <Divider />
      <Space className="h-120px" size="large">
        <Slider vertical />
        <Slider vertical disabled />
        <Slider vertical min={-100} max={100} />
      </Space>
    </div>
  )
}
