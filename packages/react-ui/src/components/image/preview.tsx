import type { ComponentProps } from 'react'

import { render as renderReactRoot } from '../../utils/renderReactRoot'
import ImagePreview from './ImagePreview'

type ImagePreviewProps = ComponentProps<typeof ImagePreview>
interface PreviewConfig extends Omit<ImagePreviewProps, 'open' | 'onClose'> {
  url: string
}

export const preview = (config: PreviewConfig) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  let root: ReturnType<typeof renderReactRoot> | void

  function render() {
    const ele = <ImagePreview {...imagePreviewProps} />
    if (root) {
      root.render(ele)
    } else {
      root = renderReactRoot(ele, div)
    }
  }

  const imagePreviewProps: ComponentProps<typeof ImagePreview> = {
    ...config,
    src: config.url,
    open: false,
    onClose: close,
    afterClose() {
      config.afterClose?.()
      destroy()
    }
  }
  open()

  function open() {
    imagePreviewProps.open = true
    render()
  }

  function close() {
    imagePreviewProps.open = false
    render()
  }

  function destroy() {
    const { unmountOnExit = true } = config
    if (unmountOnExit) {
      root = root?._unmount()
    }
    if (div.parentNode) {
      div.parentNode.removeChild(div)
    }
  }

  return {
    open,
    close
  }
}
