import './index.scss'

import type { Editor } from '@tiptap/react'
import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'

const isReact18 = Number(ReactDOM.version?.split('.')[0]) > 17
const flushSyncProps = isReact18 ? { flushSync: ReactDOM.flushSync } : {}
const Moveable = lazy(() => import('react-moveable'))

export default function ImageResizer({ editor }: { editor: Editor }) {
  const updateMediaSize = () => {
    const imageInfo = document.querySelector('.ProseMirror-selectednode') as HTMLImageElement
    if (imageInfo) {
      const selection = editor.state.selection
      editor.commands.setImage({
        src: imageInfo.src,
        width: Number(imageInfo.style.width.replace('px', '')),
        height: Number(imageInfo.style.height.replace('px', ''))
      })
      editor.commands.setNodeSelection(selection.from)
    }
  }

  return (
    <Suspense>
      <Moveable
        {...flushSyncProps}
        className="image-resizer-moveable"
        target={document.querySelector('.ProseMirror-selectednode') as HTMLImageElement}
        container={null}
        origin={false}
        /* Resize event edges */
        edge={false}
        throttleDrag={0}
        /* When resize or scale, keeps a ratio of the width, height. */
        keepRatio={true}
        /* resizable*/
        /* Only one of resizable, scalable, warpable can be used. */
        resizable={true}
        throttleResize={0}
        onResize={({ target, width, height, delta }) => {
          delta[0] && (target.style.width = `${width}px`)
          delta[1] && (target.style.height = `${height}px`)
        }}
        // { target, isDrag, clientX, clientY }: any
        onResizeEnd={() => {
          updateMediaSize()
        }}
        /* scalable */
        /* Only one of resizable, scalable, warpable can be used. */
        scalable={true}
        throttleScale={0}
        /* Set the direction of resizable */
        renderDirections={['w', 'e']}
        onScale={({ target, transform }) => {
          target.style.transform = transform
        }}
      />
    </Suspense>
  )
}
