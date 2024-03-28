import type { LinkOptions } from '@tiptap/extension-link'
import TiptapLink from '@tiptap/extension-link'

import LinkPicker from '../components/link-picker'
import { linkSelectionPlugin } from '../plugins/link-selection-plugin'

export default TiptapLink.extend<
  LinkOptions & {
    menu: typeof LinkPicker
    bubble: typeof LinkPicker
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      menu: LinkPicker,
      bubble: LinkPicker
    }
  },

  addProseMirrorPlugins() {
    return [linkSelectionPlugin()]
  }
})
