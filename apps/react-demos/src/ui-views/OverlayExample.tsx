import { Button, Card, Divider, Overlay } from '@youknown/react-ui/src'
import { useState } from 'react'

export default () => {
  const [open, setOpen] = useState(false)
  const show = () => setOpen(true)
  const hide = () => setOpen(false)
  return (
    <div>
      <h1>Overlay</h1>
      <Divider />
      <Button onClick={show}>Show overlay</Button>
      <Overlay open={open} onCancel={hide}>
        <Card className="w-320px! h-200px! mt-15vh">Content</Card>
      </Overlay>
      <Divider />
    </div>
  )
}
