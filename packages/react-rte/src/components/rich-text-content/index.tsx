import './index.scss'
import '@youknown/css/src/rte.scss'

import { EditorContent } from '@tiptap/react'
import { cls } from '@youknown/utils/src'
import type { ComponentProps } from 'react'

import { UI_EDITOR_PREFIX } from '../../common'
import type { BubbleListItem } from '../bubble'
import { Bubble } from '../bubble'
import type { FloatingListItem } from '../floating'
import { Floating } from '../floating'
import ImageResizer from '../image-resizer'

interface RTEContentProps extends ComponentProps<typeof EditorContent> {
  className?: string
  tooltip?: boolean
  bubble?: boolean
  floating?: boolean
  bubbleList?: BubbleListItem[]
  floatingList?: FloatingListItem[]
}
export function RTEContent(props: RTEContentProps) {
  const prefixCls = `${UI_EDITOR_PREFIX}-content`
  const { editor, className, tooltip = true, bubble = true, floating = true, floatingList, bubbleList, ...rest } = props
  const hasImageExt = editor && editor.extensionManager.extensions.some(ext => ext.name === 'image')
  return (
    <div
      className={cls(prefixCls, className)}
      onClick={() => {
        editor?.chain().focus().run()
      }}
    >
      {floating && <Floating editor={editor} tooltip={tooltip} list={floatingList} />}
      {bubble && <Bubble editor={editor} tooltip={tooltip} list={bubbleList} />}
      {hasImageExt && <ImageResizer editor={editor} />}
      <EditorContent editor={editor} {...rest} />
    </div>
  )
}
RTEContent.displayName = 'RTEContent'
export default RTEContent
