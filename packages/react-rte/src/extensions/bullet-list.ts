import type { BulletListOptions } from '@tiptap/extension-bullet-list'
import TiptapBulletList from '@tiptap/extension-bullet-list'

import BulletListItem from '../components/bullet-list-item'

export default TiptapBulletList.extend<
  BulletListOptions & {
    insert: typeof BulletListItem
    floating: typeof BulletListItem
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      insert: BulletListItem,
      floating: BulletListItem
    }
  }
})
