import { DatePicker, Divider, Space } from '@youknown/react-ui/src'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useState } from 'react'

export default () => {
  const [date, setDate] = useState<Dayjs>()
  return (
    <div>
      <h1>DatePicker</h1>
      <Divider />
      <Space>
        <DatePicker />
        <DatePicker placeholder="请选择" />
        <DatePicker allowClear />
        <DatePicker disabled />
      </Space>
      <Divider />
      <Space>
        <DatePicker allowClear />
      </Space>
      <Divider />
      <Space>
        <DatePicker defaultValue={dayjs()} onChange={console.log} />
      </Space>
      <Divider />
      <Space>
        <DatePicker value={date} onChange={setDate} />
      </Space>
    </div>
  )
}
