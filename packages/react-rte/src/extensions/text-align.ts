import type { TextAlignOptions } from '@tiptap/extension-text-align'
import TiptapTextAlign from '@tiptap/extension-text-align'

import TextAlignPicker from '../components/text-align-picker'

export default TiptapTextAlign.extend<
  TextAlignOptions & {
    menu: typeof TextAlignPicker
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      types: ['heading', 'paragraph'],
      menu: TextAlignPicker
    }
  }
})
