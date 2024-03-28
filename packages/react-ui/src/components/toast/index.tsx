import { is, uuid } from '@youknown/utils/src'
import type { ComponentProps, CSSProperties, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaCircleXmark } from 'react-icons/fa6'

import { render as renderReactRoot } from '../../utils/renderReactRoot'
import { Toast as _Toast } from './Toast'

export interface ToastConfig {
  content: ReactNode
  duration?: number
  className?: string
  style?: CSSProperties
  icon?: ReactNode
  onClick?: (event: MouseEvent) => void
  onClose?: () => void
}
let root: ReturnType<typeof renderReactRoot> | void
let noticeList: ComponentProps<typeof _Toast>['noticeList'] = []

const toast = (config: ToastConfig) => {
  const noticeID = uuid()

  function render() {
    const ele = createPortal(<_Toast noticeList={noticeList} onNoticeClose={remove} />, document.body)
    if (root) {
      root.render(ele)
    } else {
      const div = document.createElement('div')
      document.body.appendChild(div)
      root = renderReactRoot(ele, div)
      if (div.parentNode) {
        div.parentNode.removeChild(div)
      }
    }
  }

  noticeList.push({ id: noticeID, ...config })
  render()

  function remove(id: string | number) {
    noticeList = noticeList.filter(notice => notice.id !== id)
    render()
  }

  function close() {
    remove(noticeID)
  }

  function update(newConfig: ToastConfig) {
    noticeList = noticeList.map(notice => {
      if (notice.id === noticeID) {
        return {
          ...notice,
          ...newConfig
        }
      }
      return notice
    })
    render()
  }

  return {
    noticeID,
    update,
    close
  }
}

toast.info = (arg: ToastConfig | string) => {
  const icon = <FaCircleInfo color="#165dff" />
  if (is.string(arg)) {
    return toast({
      icon,
      content: arg
    })
  }
  return toast({
    icon,
    ...arg
  })
}
toast.success = (arg: ToastConfig | string) => {
  const icon = <FaCircleCheck color="#00b42a" />
  if (is.string(arg)) {
    return toast({
      icon,
      content: arg
    })
  }
  return toast({
    icon,
    ...arg
  })
}
toast.warning = (arg: ToastConfig | string) => {
  const icon = <FaCircleExclamation color="#ff7d00" />
  if (is.string(arg)) {
    return toast({
      icon,
      content: arg
    })
  }
  return toast({
    icon,
    ...arg
  })
}
toast.error = (arg: ToastConfig | string) => {
  const icon = <FaCircleXmark color="#f53f3f" />
  if (is.string(arg)) {
    return toast({
      icon,
      content: arg
    })
  }
  return toast({
    icon,
    ...arg
  })
}

export const Toast = toast
