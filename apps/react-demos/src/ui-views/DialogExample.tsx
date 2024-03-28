import { Button, Dialog, Divider } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <h1>Dialog</h1>
      <Divider />
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Show dialog
      </Button>
      <Dialog
        open={open}
        title="Basic Dialog"
        onCancel={() => {
          setOpen(false)
        }}
      >
        <div className="w-300px p-24px">Content</div>
      </Dialog>
      <Divider />
      <Button
        onClick={() => {
          Dialog.confirm({
            title: 'Dialog title',
            content: <div className="w-320px p-24px">dialog content</div>,
            onOk() {
              console.log('onOk')
            },
            onCancel() {
              console.log('onCancel')
            },
            afterClose() {
              console.log('afterClose')
            }
          })
        }}
      >
        Show dialog by command
      </Button>
    </div>
  )
}
