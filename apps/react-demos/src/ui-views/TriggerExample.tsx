import { Button, Divider, Space, Trigger } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [open, setOpen] = useState(false)

  const createContent = (text: string) => (
    <div className="w-max p-8px b-solid b-1 b-divider bg-#fff shadow-[1px_4px_8px_rgba(0,0,0,.1)]">{text}</div>
  )

  return (
    <div>
      <h1>Trigger</h1>
      <Divider />
      <Space>
        <Trigger trigger="hover" popup={createContent('tooltip')}>
          <Button>Hover me</Button>
        </Trigger>
        <Trigger trigger="click" popup={createContent('tooltip')}>
          <Button>Click me</Button>
        </Trigger>
        <Trigger
          trigger="manual"
          popup={createContent('tooltip')}
          open={open}
          onOpenChange={setOpen}
          onClickOutside={() => {
            setOpen(false)
          }}
        >
          <Button onClick={() => setOpen(true)}>Manual</Button>
        </Trigger>
      </Space>
      <Divider />
      <Space>
        <Trigger motion="none" popup={createContent('tooltip')}>
          <Button>Without motion</Button>
        </Trigger>
        <Trigger motion="grow" popup={createContent('tooltip')}>
          <Button>With grow</Button>
        </Trigger>
        <Trigger motion="stretch" popup={createContent('tooltip')}>
          <Button>With stretch</Button>
        </Trigger>
        <Trigger motion="fade" popup={createContent('tooltip')}>
          <Button>With fade</Button>
        </Trigger>
        <Trigger motion="zoom" popup={createContent('tooltip')}>
          <Button>With zoom</Button>
        </Trigger>
      </Space>
    </div>
  )
}
