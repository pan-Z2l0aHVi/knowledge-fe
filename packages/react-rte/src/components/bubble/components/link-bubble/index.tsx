import type { Editor } from '@tiptap/react'

import LinkPicker from '../../../link-picker'
import LinkCopyBtn from './components/link-copy-btn'
import LinkOpenBtn from './components/link-open-btn'
import UnLinkBtn from './components/unlink-btn'

interface LinkBubbleProps {
  editor: Editor
  pickerOpen: boolean
  setPickerOpen: (open: boolean) => void
}
export default function LinkBubble(props: LinkBubbleProps) {
  const { editor, pickerOpen, setPickerOpen } = props
  return (
    <>
      <LinkPicker
        editor={editor}
        isEdit
        appendTo={null}
        trigger="manual"
        open={pickerOpen}
        onOpenChange={setPickerOpen}
      />
      <UnLinkBtn editor={editor} />
      <LinkCopyBtn editor={editor} />
      <LinkOpenBtn editor={editor} />
    </>
  )
}
