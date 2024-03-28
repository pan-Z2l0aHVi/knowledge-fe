import './index.scss'

import type { Editor } from '@tiptap/react'
import { Divider, Space } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { cloneElement, createElement, useMemo } from 'react'

import { UI_EDITOR_PREFIX } from '../../common'
import EraserBtn from '../eraser-btn'
import type { insertListItem } from '../insert-picker'
import InsertPicker from '../insert-picker'
import RedoBtn from '../redo-btn'
import UndoBtn from '../undo-btn'

type MenuListItem =
  | '|' // divider
  | 'heading'
  | 'bold'
  | 'italic'
  | 'strike'
  | 'underline'
  | 'code'
  | 'link'
  | 'highlight'
  | 'color'
  | 'textAlign'
interface RTEMenuBarProps {
  editor: Editor | null
  className?: string
  tooltip?: boolean
  list?: MenuListItem[]
  insertList?: insertListItem[]
}
export function RTEMenuBar(props: RTEMenuBarProps) {
  const { editor, className, tooltip = true, list, insertList } = props

  const btnList = useMemo(() => {
    const defaultList = [
      '|',
      'heading',
      'bold',
      'italic',
      'underline',
      'strike',
      'code',
      '|',
      'highlight',
      'color',
      '|',
      'link',
      'blockquote',
      '|',
      'textAlign'
    ]
    return list ?? defaultList
  }, [list])

  if (!editor) {
    return null
  }

  const prefixCls = `${UI_EDITOR_PREFIX}-menu-bar`
  const verticalDivider = (
    <Divider className={`${prefixCls}-divider`} size="small" direction="vertical" style={{ height: 20 }} />
  )

  const extensions = editor.extensionManager.extensions.filter(ext => ext.options.menu)
  const ele = btnList.map((btn, index) => {
    if (btn === '|') {
      return cloneElement(verticalDivider, { key: index })
    }
    const extension = extensions.find(ext => ext.name === btn)
    if (extension) {
      const { menu } = extension.options
      if (extension.name === 'link') {
        return createElement(menu, {
          key: extension.name,
          editor,
          extension,
          tooltip
        })
      }
      return createElement(menu, {
        key: extension.name,
        editor,
        extension,
        tooltip
      })
    }
    return null
  })

  return (
    <Space className={cls(prefixCls, className)} align="center">
      <UndoBtn editor={editor} tooltip={tooltip} />
      <RedoBtn editor={editor} tooltip={tooltip} />
      <EraserBtn editor={editor} tooltip={tooltip} />
      <InsertPicker editor={editor} tooltip={tooltip} list={insertList} />
      {ele}
    </Space>
  )
}
RTEMenuBar.displayName = 'RTEMenuBar'
export default RTEMenuBar
