import type { Editor, Extension } from '@tiptap/react'

export const UI_PREFIX = 'ui'
export const UI_EDITOR_PREFIX = `${UI_PREFIX}-rte`

export interface ButtonProps<T = any> {
  editor: Editor
  extension?: Extension<T>
  tooltip?: boolean
}
