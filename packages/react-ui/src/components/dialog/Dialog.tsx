import './dialog.scss'

import { useEvent } from '@youknown/react-hook/src'
import { cls, is } from '@youknown/utils/src'
import type { ComponentProps, ForwardedRef, ReactNode } from 'react'
import { forwardRef, isValidElement, useRef } from 'react'

import { UI_PREFIX } from '../../constants'
import { Button } from '../button'
import { Card } from '../card'
import { CloseIcon } from '../close-icon'
import { Motion } from '../motion'
import { Overlay } from '../overlay'
import { Space } from '../space'

export interface DialogProps extends ComponentProps<typeof Overlay> {
  hasCancel?: boolean
  closeIcon?: ReactNode
  overlayClassName?: string
  title?: string
  footer?: ReactNode
  header?: ReactNode
  okText?: string
  cancelText?: string
  okLoading?: boolean
  okDanger?: boolean
  onCancel?: () => void
  onOk?: () => void
}

interface Point {
  x: number
  y: number
}
let point: Point | null = null
document.addEventListener(
  'click',
  event => {
    // 忽略手动触发的点击事件
    if (!event.isTrusted) {
      return
    }
    point = {
      x: event.clientX,
      y: event.clientY
    }
    setTimeout(() => {
      // 不能立即弹出的放弃定位
      point = null
    }, 200)
  },
  true
)

const _Dialog = (props: DialogProps, ref: ForwardedRef<HTMLDivElement>) => {
  const prefixCls = `${UI_PREFIX}-dialog`
  const {
    children,
    className,
    open,
    overlayClassName,
    overlayClosable,
    hasCancel = true,
    title,
    okText = 'Ok',
    cancelText = 'Cancel',
    okLoading = false,
    okDanger = false,
    onCancel,
    onOk,
    closeIcon,
    footer,
    header,
    ...rest
  } = props

  const pointRef = useRef<Point | null>(null)
  const haveOriginTransformOrigin = useRef(false)

  const setZoomOrigin = useEvent((el: HTMLElement) => {
    if (haveOriginTransformOrigin.current) {
      return
    }
    let transformOrigin = ''
    if (pointRef.current) {
      const { x, y } = pointRef.current
      // 为什么不用 el.getBoundingClientRect() 获取位置呢？
      // 因为 zoom 的初始 transform 设置成了 scale(0) 导致取值不准
      transformOrigin = `${x - el.offsetLeft}px ${y - el.offsetTop}px`
    }
    el.style.transformOrigin = transformOrigin
  })

  const closeIconEle = (
    <>{is.undefined(closeIcon) ? <CloseIcon className={`${prefixCls}-close-icon`} onClick={onCancel} /> : closeIcon}</>
  )

  const headerEle = (
    <>
      {is.undefined(header) ? (
        <div className={`${prefixCls}-header`}>
          <strong className={`${prefixCls}-header-title`}>{title}</strong>
        </div>
      ) : (
        header
      )}
    </>
  )

  const footerEle = is.undefined(footer) ? (
    <div className={`${prefixCls}-footer`}>
      <Space>
        {hasCancel && <Button onClick={onCancel}>{cancelText}</Button>}
        <Button primary={!okDanger} danger={okDanger} loading={okLoading} onClick={onOk}>
          {okText}
        </Button>
      </Space>
    </div>
  ) : (
    footer
  )

  return (
    <Overlay
      ref={ref}
      open={open}
      className={overlayClassName}
      timeout={400}
      overlayClosable={overlayClosable}
      onCancel={onCancel}
      {...rest}
    >
      <Motion.Zoom
        in={open}
        timeout={400}
        onEnter={el => {
          haveOriginTransformOrigin.current = !!el.style.transformOrigin
          pointRef.current = point
          setZoomOrigin(el)
        }}
        onEntered={el => {
          setZoomOrigin(el)
          pointRef.current = null
        }}
        onExited={el => {
          setZoomOrigin(el)
        }}
      >
        <Card className={cls(className, prefixCls)} shadow header={headerEle} footer={footerEle}>
          {isValidElement(children) ? (
            <>
              {closeIconEle}
              {children}
            </>
          ) : (
            children
          )}
        </Card>
      </Motion.Zoom>
    </Overlay>
  )
}

_Dialog.displayName = 'Dialog'
export const Dialog = forwardRef(_Dialog)
