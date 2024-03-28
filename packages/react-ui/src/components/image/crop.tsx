import type { ComponentProps } from 'react'

import { render as renderReactRoot } from '../../utils/renderReactRoot'
import { ImageCropper } from './ImageCropper'

type ImageCropperProps = ComponentProps<typeof ImageCropper>
type CropConfig = Omit<ImageCropperProps, 'open' | 'onClose'> & {
  fileTypeExcludes?: string[]
}

export const crop = (config: CropConfig) => {
  const { fileTypeExcludes = [], file } = config
  if (fileTypeExcludes.includes(file.type)) {
    config.onCrop?.(file)
    return
  }

  const div = document.createElement('div')
  document.body.appendChild(div)

  let root: ReturnType<typeof renderReactRoot> | void

  function render() {
    const ele = <ImageCropper {...imageCropperProps} />
    if (root) {
      root.render(ele)
    } else {
      root = renderReactRoot(ele, div)
      if (div.parentNode) {
        div.parentNode.removeChild(div)
      }
    }
  }

  const imageCropperProps: ComponentProps<typeof ImageCropper> = {
    ...config,
    open: false,
    onClose: close,
    afterClose() {
      config.afterClose?.()
      destroy()
    }
  }
  open()

  function open() {
    imageCropperProps.open = true
    render()
  }

  function close() {
    imageCropperProps.open = false
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
