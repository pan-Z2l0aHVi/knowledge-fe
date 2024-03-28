import { Button, Divider, Popover, Space } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [open, setOpen] = useState(false)
  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
  return (
    <div>
      <h1>Popover</h1>
      <Divider />
      <Space>
        <Popover trigger="hover" content="Show by hover">
          <Button>Hover me</Button>
        </Popover>
        <Popover trigger="click" content="Show by click">
          <Button>Click me</Button>
        </Popover>
        <Popover
          trigger="manual"
          content="Show by manual"
          open={open}
          onOpenChange={setOpen}
          onClickOutside={() => setOpen(false)}
        >
          <Button onClick={() => setOpen(true)}>Manual</Button>
        </Popover>
      </Space>
      <Divider />
      <div className="grid grid-cols-[repeat(3,160px)] grid-rows-[repeat(5,auto)] gap-12px justify-center justify-items-center">
        <Popover trigger="hover" placement="top-start" content="Top start">
          <Button style={cellStyle}>Top start</Button>
        </Popover>
        <Popover trigger="hover" placement="top" content="Top">
          <Button style={cellStyle}>Top</Button>
        </Popover>
        <Popover trigger="hover" placement="top-end" content="Top end">
          <Button style={cellStyle}>Top end</Button>
        </Popover>
        <Popover trigger="hover" placement="left-start" content="Left start">
          <Button style={cellStyle}>Left start</Button>
        </Popover>
        <div style={cellStyle}></div>
        <Popover trigger="hover" placement="right-start" content="Right start">
          <Button style={cellStyle}>Right start</Button>
        </Popover>
        <Popover trigger="hover" placement="left" content="Left">
          <Button style={cellStyle}>Left</Button>
        </Popover>
        <div style={cellStyle}></div>
        <Popover trigger="hover" placement="right" content="Right">
          <Button style={cellStyle}>Right</Button>
        </Popover>
        <Popover trigger="hover" placement="left-end" content="Left end">
          <Button style={cellStyle}>Left end</Button>
        </Popover>
        <div style={cellStyle}></div>
        <Popover trigger="hover" placement="right-end" content="Right end">
          <Button style={cellStyle}>Right end</Button>
        </Popover>
        <Popover trigger="hover" placement="bottom-start" content="Bottom start">
          <Button style={cellStyle}>Bottom start</Button>
        </Popover>
        <Popover trigger="hover" placement="bottom" content="Bottom">
          <Button style={cellStyle}>Bottom</Button>
        </Popover>
        <Popover trigger="hover" placement="bottom-end" content="Bottom end">
          <Button style={cellStyle}>Bottom end</Button>
        </Popover>
      </div>
    </div>
  )
}
