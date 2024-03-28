import { Button, Divider, Input, Space } from '@youknown/react-ui/src'
import { useRef, useState } from 'react'
import { TbEyeOff, TbSearch } from 'react-icons/tb'

export default () => {
  const [inputVal, setInputVal] = useState('Controlled input')
  const [textareaVal, setTextareaVal] = useState('Controlled textarea')
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  return (
    <div>
      <h1>Input</h1>
      <Divider />
      <Space>
        <Input defaultValue="Hi" onChange={console.log} placeholder="Basic" />
        <Input placeholder="Controlled" value={inputVal} onChange={setInputVal} />
      </Space>
      <Divider />
      <Space>
        <Input size="small" placeholder="Small" />
        <Input size="medium" placeholder="Medium" />
        <Input size="large" placeholder="Large" />
      </Space>
      <Divider />
      <Space>
        <Input placeholder="Prefix" prefix={<TbSearch className="m-[0_4px]" />} />
        <Input placeholder="Suffix" suffix={<TbEyeOff className="m-[0_4px]" />} />
      </Space>
      <Divider />
      <Space>
        <Input placeholder="Allow clear" allowClear defaultValue="Allow clear" />
      </Space>
      <Divider />
      <Space direction="vertical">
        <Input placeholder="Round" round />
        <Input
          placeholder="Round with prefix and suffix"
          round
          prefix={<TbSearch className="m-[0_4px]" />}
          suffix={<TbEyeOff className="m-[0_4px]" />}
        />
      </Space>
      <Divider />
      <Space>
        <Input placeholder="Enabled" />
        <Input placeholder="Disabled" disabled />
      </Space>
      <Divider />
      <Space>
        <Input placeholder="Forward ref" ref={inputRef} />
        <Button
          primary
          onClick={() => {
            inputRef.current?.focus()
          }}
        >
          Manual focus
        </Button>
        <Button
          primary
          onClick={() => {
            inputRef.current?.blur()
          }}
        >
          Manual blur
        </Button>
      </Space>
      <Divider />
      <Input.Textarea defaultValue="Hi" placeholder="Basic textarea" />
      <Divider />
      <Input.Textarea placeholder="Controlled textarea" value={textareaVal} onChange={setTextareaVal} />
      <Divider />
      <Input.Textarea autosize placeholder="Autosize textarea" />
      <Divider />
      <Space>
        <Input.Textarea disabled placeholder="Disabled textarea" />
        <Input.Textarea disabled autosize placeholder="Disabled autosize textarea" />
      </Space>
      <Divider />
      <Space>
        <Input.Textarea ref={textareaRef} placeholder="Ref textarea" />
        <Button
          primary
          onClick={() => {
            textareaRef.current?.focus()
          }}
        >
          Manual focus
        </Button>
        <Button
          primary
          onClick={() => {
            textareaRef.current?.blur()
          }}
        >
          Manual blur
        </Button>
      </Space>
      <Divider />
      <Input bordered={false} placeholder="Border less" />
    </div>
  )
}
