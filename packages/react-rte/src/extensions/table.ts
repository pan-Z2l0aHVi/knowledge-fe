import type { TableOptions } from '@tiptap/extension-table'
import TiptapTable from '@tiptap/extension-table'
import TiptapTableCell from '@tiptap/extension-table-cell'
import TiptapTableHeader from '@tiptap/extension-table-header'
import TiptapTableRow from '@tiptap/extension-table-row'

import TableItem from '../components/table-item'
import TableOperator from '../components/table-operator'

export default TiptapTable.extend<
  TableOptions & {
    insert: typeof TableItem
    floating: typeof TableItem
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      resizable: true,
      insert: TableItem,
      floating: TableItem,
      bubble: TableOperator
    }
  },

  addExtensions() {
    return [TiptapTableHeader, TiptapTableRow, TiptapTableCell]
  }
})
