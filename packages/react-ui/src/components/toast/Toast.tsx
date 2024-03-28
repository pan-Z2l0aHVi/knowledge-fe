import './toast.scss'

import { cls } from '@youknown/utils/src'
import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { TransitionGroup } from 'react-transition-group'

import { UI_PREFIX } from '../../constants'
import { useZIndex } from '../../hooks/useZIndex'
import { Motion } from '../motion'
import { Notice } from './Notice'

export interface ToastProps {
  noticeList: (ComponentProps<typeof Notice> & { id: string | number })[]
  onNoticeClose: (id: string | number) => void
}

const _Toast = (props: ToastProps, propRef: ForwardedRef<HTMLDivElement>) => {
  const { noticeList = [], onNoticeClose } = props

  const zIndex = useZIndex('message')

  const prefixCls = `${UI_PREFIX}-toast`

  return (
    <div
      ref={propRef}
      className={cls(prefixCls)}
      style={{
        zIndex
      }}
    >
      <TransitionGroup component={null}>
        {noticeList.map(notice => {
          const { id, onClose, ...rest } = notice
          return (
            <Motion.Zoom
              key={id}
              mountOnEnter
              unmountOnExit
              onExited={() => {
                onClose?.()
              }}
            >
              <Notice
                {...rest}
                onClose={() => {
                  onNoticeClose(id)
                }}
              />
            </Motion.Zoom>
          )
        })}
      </TransitionGroup>
    </div>
  )
}
_Toast.displayName = 'Toast'
export const Toast = forwardRef(_Toast)
