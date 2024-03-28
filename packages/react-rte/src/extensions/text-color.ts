import type { ColorOptions } from '@tiptap/extension-color'
import TiptapColor from '@tiptap/extension-color'
import TiptapTextStyle from '@tiptap/extension-text-style'

import TextColorPicker from '../components/text-color-picker'

export default TiptapColor.extend<
  ColorOptions & {
    menu: typeof TextColorPicker
    bubble: typeof TextColorPicker
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      menu: TextColorPicker,
      bubble: TextColorPicker
    }
  },

  addExtensions() {
    return [TiptapTextStyle]
  }
})
