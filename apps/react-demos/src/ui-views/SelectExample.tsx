import { Divider, Select, Space } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [selection, setSelection] = useState<0 | 1 | 2>(0)
  const [multipleSelection, setMultipleSelection] = useState<(0 | 1 | 2)[]>([0])
  return (
    <div>
      <h1>Select</h1>
      <Divider />
      <Select
        defaultValue={1}
        menuList={[
          {
            value: 0,
            label: 'Apple'
          },
          {
            value: 1,
            label: 'Watermelon'
          },
          {
            value: 2,
            label: 'Banana',
            disabled: true
          },
          {
            value: 3,
            label: 'Cherry'
          }
        ]}
      ></Select>
      <Divider />
      <Select
        multiple
        defaultValue={[2]}
        menuList={[
          {
            value: 0,
            label: 'Apple'
          },
          {
            value: 1,
            label: 'Watermelon'
          },
          {
            value: 2,
            label: 'Banana'
          }
        ]}
      ></Select>
      <Divider />
      <Space>
        <Select
          value={selection}
          onChange={setSelection}
          menuList={[
            {
              value: 0,
              label: 'Apple'
            },
            {
              value: 1,
              label: 'Watermelon'
            },
            {
              value: 2,
              label: 'Banana'
            }
          ]}
        ></Select>
        <Select
          multiple
          value={multipleSelection}
          onChange={setMultipleSelection}
          menuList={[
            {
              value: 0,
              label: 'Apple'
            },
            {
              value: 1,
              label: 'Watermelon'
            },
            {
              value: 2,
              label: 'Banana'
            }
          ]}
        ></Select>
      </Space>
      <Divider />
      <Select
        disabled
        defaultValue={1}
        menuList={[
          {
            value: 0,
            label: 'Apple'
          },
          {
            value: 1,
            label: 'Watermelon'
          },
          {
            value: 2,
            label: 'Banana'
          }
        ]}
      ></Select>
      <Divider />
      <Space>
        <Select
          filter
          allowClear
          defaultValue={1}
          menuList={[
            {
              value: 0,
              label: 'Apple'
            },
            {
              value: 1,
              label: 'Watermelon'
            },
            {
              value: 2,
              label: 'Banana'
            }
          ]}
        ></Select>
        <Select
          filter
          multiple
          defaultValue={[0]}
          menuList={[
            {
              value: 0,
              label: 'Apple'
            },
            {
              value: 1,
              label: 'Watermelon'
            },
            {
              value: 2,
              label: 'Banana'
            }
          ]}
        ></Select>
      </Space>
    </div>
  )
}
