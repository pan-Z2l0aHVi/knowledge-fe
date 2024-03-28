import { getMarkRange } from '@tiptap/core'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

export const linkSelectionPluginKey = new PluginKey('linkSelection')
export const linkSelectionPlugin = () =>
  new Plugin({
    key: linkSelectionPluginKey,
    props: {
      handleClick(view: EditorView, pos: number) {
        const { schema, doc, tr } = view.state
        const range = getMarkRange(doc.resolve(pos), schema.marks.link)
        if (!range) return false
        const $start = doc.resolve(range.from)
        const $end = doc.resolve(range.to)
        const transaction = tr.setSelection(new TextSelection($start, $end))
        view.dispatch(transaction)
        return true
      }
    }
  })
