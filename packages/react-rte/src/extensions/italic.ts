import type { ItalicOptions } from '@tiptap/extension-italic'
import TiptapItalic from '@tiptap/extension-italic'

import ItalicBtn from '../components/italic-btn'

export default TiptapItalic.extend<
  ItalicOptions & {
    menu: typeof ItalicBtn
    bubble: typeof ItalicBtn
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      menu: ItalicBtn,
      bubble: ItalicBtn
    }
  }
})
