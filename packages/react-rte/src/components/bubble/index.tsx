import './index.scss'

import type { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react'
import { Divider, Space } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { cloneElement, createElement, useMemo, useState } from 'react'

import { UI_EDITOR_PREFIX } from '../../common'
import LinkBubble from './components/link-bubble'

export type BubbleListItem =
  | '|' // divider
  | 'link'
  | 'bold'
  | 'italic'
  | 'strike'
  | 'underline'
  | 'highlight'
  | 'code'
  | 'color'
  | 'table'
interface BubbleProps {
  editor: Editor | null
  tooltip?: boolean
  list?: BubbleListItem[]
}
export function Bubble(props: BubbleProps) {
  const { editor, tooltip = true, list } = props

  const btnList = useMemo(() => {
    const defaultList = ['bold', 'italic', 'underline', 'strike', 'code', 'link', '|', 'highlight', 'color']
    return list ?? defaultList
  }, [list])
  const [linkPickerOpen, setLinkPickerOpen] = useState(false)
  const [tableOperatorOpen, setTableOperatorOpen] = useState(false)
  const [highlightPickerOpen, setHighlightPickerOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  if (!editor) {
    return null
  }

  const prefixCls = `${UI_EDITOR_PREFIX}-bubble`
  const verticalDivider = <Divider className={`${prefixCls}-divider`} size="small" direction="vertical" />

  const renderBubbleContent = () => {
    if (editor.isActive('link')) {
      return (
        <LinkBubble
          editor={editor}
          pickerOpen={linkPickerOpen}
          setPickerOpen={open => {
            setLinkPickerOpen(open)
            setTableOperatorOpen(false)
            setColorPickerOpen(false)
            setHighlightPickerOpen(false)
          }}
        />
      )
    }

    const btnListWithTable = editor.isActive('table') ? ['table', '|', ...btnList] : btnList
    const extensions = editor.extensionManager.extensions.filter(ext => ext.options.bubble)

    return btnListWithTable.map((btn, index) => {
      if (btn === '|') {
        return cloneElement(verticalDivider, { key: index })
      }
      const extension = extensions.find(ext => ext.name === btn)
      if (extension) {
        const { bubble } = extension.options
        const basicProps = {
          key: extension.name,
          editor,
          extension,
          tooltip
        }
        if (extension.name === 'link') {
          return createElement(bubble, {
            ...basicProps,
            appendTo: null,
            trigger: 'manual',
            open: linkPickerOpen,
            onOpenChange(open: boolean) {
              setLinkPickerOpen(open)
              setTableOperatorOpen(false)
              setColorPickerOpen(false)
              setHighlightPickerOpen(false)
            }
          })
        }
        if (extension.name === 'table') {
          return createElement(bubble, {
            ...basicProps,
            appendTo: null,
            trigger: 'manual',
            open: tableOperatorOpen,
            onOpenChange(open: boolean) {
              setTableOperatorOpen(open)
              setLinkPickerOpen(false)
              setColorPickerOpen(false)
              setHighlightPickerOpen(false)
            }
          })
        }
        if (extension.name === 'highlight') {
          return createElement(bubble, {
            ...basicProps,
            appendTo: null,
            trigger: 'manual',
            open: highlightPickerOpen,
            onOpenChange(open: boolean) {
              setHighlightPickerOpen(open)
              setColorPickerOpen(false)
              setLinkPickerOpen(false)
              setTableOperatorOpen(false)
            }
          })
        }
        if (extension.name === 'color') {
          return createElement(bubble, {
            ...basicProps,
            appendTo: null,
            trigger: 'manual',
            open: colorPickerOpen,
            onOpenChange(open: boolean) {
              setColorPickerOpen(open)
              setHighlightPickerOpen(false)
              setLinkPickerOpen(false)
              setTableOperatorOpen(false)
            }
          })
        }
        return createElement(bubble, basicProps)
      }
      return null
    })
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 300,
        zIndex: 9,
        maxWidth: 'none',
        moveTransition: 'transform 0.15s ease-out',
        onHide: () => {
          setLinkPickerOpen(false)
          setTableOperatorOpen(false)
          setColorPickerOpen(false)
          setHighlightPickerOpen(false)
        }
      }}
      shouldShow={({ editor }) => {
        if (editor.isActive('image')) {
          return false
        }
        if (editor.isActive('codeBlock')) {
          return false
        }
        return editor.view.state.selection.content().size > 0
      }}
    >
      <Space className={cls(prefixCls)} size="small" align="center">
        {renderBubbleContent()}
      </Space>
    </BubbleMenu>
  )
}
