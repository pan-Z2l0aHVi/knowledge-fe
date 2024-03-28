import type { HeadingOptions } from '@tiptap/extension-heading'
import TiptapHeading from '@tiptap/extension-heading'

import HeadingItem from '../components/heading-item'
import HeadingPicker from '../components/heading-picker'

export default TiptapHeading.extend<
  HeadingOptions & {
    menu: typeof HeadingPicker
    floating: typeof HeadingItem
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3, 4],
      menu: HeadingPicker,
      floating: HeadingItem
    }
  }
})
