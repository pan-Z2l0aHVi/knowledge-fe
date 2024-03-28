import type { BlockquoteOptions } from '@tiptap/extension-blockquote'
import TiptapBlockquote from '@tiptap/extension-blockquote'

import BlockquoteBtn from '../components/blockquote-btn'
import BlockquoteItem from '../components/blockquote-item'

export default TiptapBlockquote.extend<
  BlockquoteOptions & {
    insert: typeof BlockquoteItem
    floating: typeof BlockquoteItem
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      menu: BlockquoteBtn,
      insert: BlockquoteItem,
      floating: BlockquoteItem
    }
  }
})
