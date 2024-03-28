import { omit } from '@youknown/utils/src'
import type { ReactNode } from 'react'

import { render as renderReactRoot } from '../../utils/renderReactRoot'
import type { DialogProps } from './Dialog'
import { Dialog } from './Dialog'

interface ConfirmConfig
  extends Pick<
    DialogProps,
    | 'title'
    | 'header'
    | 'footer'
    | 'hasCancel'
    | 'closeIcon'
    | 'overlayClosable'
    | 'unmountOnExit'
    | 'className'
    | 'overlayClassName'
    | 'style'
    | 'okText'
    | 'cancelText'
    | 'okDanger'
    | 'okLoading'
    | 'onCancel'
    | 'onOk'
    | 'afterClose'
  > {
  content?: ReactNode
}
interface DialogInstance {
  update: (config: ConfirmConfig) => void
  close: () => void
}

export const confirm = (config: ConfirmConfig): DialogInstance => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  let root: ReturnType<typeof renderReactRoot> | void

  function render() {
    const ele = <Dialog {...dialogProps} />
    if (root) {
      root.render(ele)
    } else {
      root = renderReactRoot(ele, div)
    }
  }

  function destroy() {
    if (config.unmountOnExit) {
      root = root?._unmount()
    }
    if (div.parentNode) {
      div.parentNode.removeChild(div)
    }
  }

  let dialogProps: DialogProps = {
    ...omit(config, 'content'),
    children: config.content,
    open: true,
    onOk,
    onCancel,
    afterClose
  }
  render()

  function onOk() {
    if (config.onOk) {
      const ret = config.onOk?.()
      dialogProps.okLoading = true
      render()
      Promise.resolve(ret)
        .then(() => {
          dialogProps.open = false
        })
        .finally(() => {
          dialogProps.okLoading = false
          render()
        })
    }
  }

  function onCancel() {
    config.onCancel?.()
    dialogProps.open = false
    render()
  }

  function afterClose() {
    config.afterClose?.()
    destroy()
  }

  const update = (newConfig: ConfirmConfig) => {
    dialogProps = {
      ...dialogProps,
      ...omit(newConfig, 'content'),
      children: newConfig.content
    }
    render()
  }
  const close = () => {
    dialogProps.open = false
    render()
  }

  return {
    update,
    close
  }
}
