import type { OrderedListOptions } from '@tiptap/extension-ordered-list'
import TiptapOrderedList from '@tiptap/extension-ordered-list'

import OrderedListItem from '../components/ordered-list-item'

export default TiptapOrderedList.extend<
  OrderedListOptions & {
    insert: typeof OrderedListItem
    floating: typeof OrderedListItem
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      insert: OrderedListItem,
      floating: OrderedListItem
    }
  }
})
