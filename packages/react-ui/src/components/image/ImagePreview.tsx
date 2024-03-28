import './image-preview.scss'

import { useBoolean, useEvent, useLatestRef } from '@youknown/react-hook/src'
import { checkTouchDevice, cls, downloadFile, setRootStyle } from '@youknown/utils/src'
import type { MouseEventHandler, ReactEventHandler, TouchEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TbDownload,
  TbPhotoX,
  TbRelationOneToOne,
  TbRotate,
  TbRotateClockwise,
  TbX,
  TbZoomIn,
  TbZoomOut
} from 'react-icons/tb'

import { UI_PREFIX } from '../../constants'
import { Button } from '../button'
import { Loading } from '../loading'
import { Motion } from '../motion'
import { Overlay } from '../overlay'
import { Space } from '../space'
import { Tooltip } from '../tooltip'

type Coordinate = {
  x: number
  y: number
} | null
export interface ImagePreviewProps {
  src?: string
  toolbarVisible?: boolean
  minZoom?: number
  maxZoom?: number
  zoomSpeed?: number
  unmountOnExit?: boolean
  downloadFileName?: string
  open: boolean
  onClose: () => void
  afterClose?: () => void
  onLoad?: ReactEventHandler<HTMLImageElement>
  onError?: ReactEventHandler<HTMLImageElement>
  onDownloadSuccess?: () => void
  onDownloadError?: (err: string | Event) => void
}

const is_touch_device = checkTouchDevice()

export const ImagePreview = (props: ImagePreviewProps) => {
  const {
    src = '',
    open = false,
    toolbarVisible = true,
    minZoom = 1,
    maxZoom = 8,
    zoomSpeed = 1,
    unmountOnExit = true,
    downloadFileName = 'picture',
    onClose,
    afterClose,
    onLoad,
    onError,
    onDownloadSuccess,
    onDownloadError
  } = props

  const { t } = useTranslation()
  const imgDetailRef = useRef<HTMLImageElement>(null)
  const [detailError, setDetailError] = useState(false)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [offset, setOffset] = useState<Coordinate>(null)
  const [ratioVisible, { setTrue: showRatio, setFalse: hideRatio }] = useBoolean(false)
  const delayTimerRef = useRef(0)

  const [detailLoaded, { setTrue: setDetailLoaded }] = useBoolean(false)
  const [dragging, setDragging] = useState(false)
  const draggingRef = useLatestRef(dragging)

  const handleDetailError = () => {
    setDetailLoaded()
    setDetailError(true)
  }

  const handleMouseDragStart: MouseEventHandler<HTMLImageElement> = useEvent(event => {
    setDragging(true)
    let pos: Coordinate = null
    if (imgDetailRef.current)
      pos = {
        x: event.pageX - imgDetailRef.current.offsetLeft,
        y: event.pageY - imgDetailRef.current.offsetTop
      }
    const handleMove = (event: MouseEvent) => {
      if (draggingRef.current && pos)
        setOffset({
          x: event.pageX - pos.x,
          y: event.pageY - pos.y
        })
    }
    const handleUp = () => {
      setDragging(false)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  })

  // 单指拖拽
  const handleTouchDragStart: TouchEventHandler<HTMLElement> = useEvent(event => {
    if (event.touches.length !== 1) return

    const touch = event.touches[0]
    setDragging(true)
    let pos: Coordinate = null
    if (imgDetailRef.current)
      pos = {
        x: touch.pageX - imgDetailRef.current.offsetLeft,
        y: touch.pageY - imgDetailRef.current.offsetTop
      }
    const handleMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return

      const moveTouch = e.touches[0]
      if (draggingRef.current && pos) {
        setOffset({
          x: moveTouch.pageX - pos.x,
          y: moveTouch.pageY - pos.y
        })
      }
    }
    const handleStop = () => {
      setDragging(false)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleStop)
      document.removeEventListener('touchcancel', handleStop)
    }
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', handleStop)
    document.addEventListener('touchcancel', handleStop)
  })

  // 双指缩放
  const distanceRef = useRef(0)
  const handleTwoFingersStart = useEvent(event => {
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]

    if (touch1 && touch2) {
      event.preventDefault()
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY)
      distanceRef.current = distance / zoom
    }
  })
  const handleTwoFingersMove = useEvent(event => {
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]

    if (touch1 && touch2) {
      event.preventDefault()
      const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY)
      const scaleFactor = distance / distanceRef.current
      setZoom(scaleFactor)
    }
  })
  useEffect(() => {
    if (open) {
      document.addEventListener('touchstart', handleTwoFingersStart)
      document.addEventListener('touchmove', handleTwoFingersMove, { passive: false })
      return () => {
        document.removeEventListener('touchstart', handleTwoFingersStart)
        document.removeEventListener('touchmove', handleTwoFingersMove)
      }
    }
  }, [handleTwoFingersStart, handleTwoFingersMove, open])
  // 确保双指缩放正常，禁止移动端页面缩放
  useEffect(() => {
    if (open) {
      setRootStyle({
        'touch-action': 'none'
      })
    } else {
      setRootStyle({
        'touch-action': 'auto'
      })
    }
  }, [open])

  const handleReset = useEvent(() => {
    if (!detailLoaded) return

    setZoom(1)
    setRotate(0)
    setOffset(null)
  })

  const handleShowRatio = useEvent(() => {
    showRatio()

    const ONE_SECOND = 1000
    clearTimeout(delayTimerRef.current)
    delayTimerRef.current = window.setTimeout(() => {
      hideRatio()
    }, ONE_SECOND)
  })

  const updateZoom = (nextZoom: number) => {
    if (!detailLoaded) return
    setZoom(Math.max(minZoom, Math.min(maxZoom, nextZoom)))
    handleShowRatio()
  }

  const handleZoomIn = () => {
    updateZoom(zoom + (20 * zoomSpeed) / 200)
  }
  const handleZoomOut = () => {
    updateZoom(zoom + (-20 * zoomSpeed) / 200)
  }

  const handleLeftRotate = () => {
    if (!detailLoaded) return

    setRotate(p => p - 90)
  }

  const handleRightRotate = () => {
    if (!detailLoaded) return

    setRotate(p => p + 90)
  }

  const handleDownload = () => {
    if (!detailLoaded) return

    if (src) {
      downloadFile(src, downloadFileName).then(onDownloadSuccess).catch(onDownloadError)
    }
  }

  const onWheel = useEvent((event: WheelEvent) => {
    if (dragging) return
    event.preventDefault()
    updateZoom(zoom + (event.deltaY * zoomSpeed) / 200)
  })

  const overlayRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const overlay = overlayRef.current
    if (open && overlay) {
      overlay.addEventListener('wheel', onWheel, { passive: false })
      return () => {
        overlay.removeEventListener('wheel', onWheel)
      }
    }
  }, [onWheel, open])

  // 无感知重置
  const resetTimerRef = useRef(0)
  useEffect(() => {
    if (open) {
      clearTimeout(resetTimerRef.current)
    } else {
      const DELAY = 1000
      resetTimerRef.current = window.setTimeout(() => {
        handleReset()
      }, DELAY)
    }
  }, [open, handleReset])

  const setImageRect: ReactEventHandler<HTMLImageElement> = useEvent(event => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    const { innerWidth, innerHeight } = window
    const naturalRatio = naturalWidth / naturalHeight
    const innerRatio = innerWidth / innerHeight

    if (innerRatio > naturalRatio) {
      if (naturalHeight > innerHeight) {
        setHeight(innerHeight)
        setWidth(innerHeight * naturalRatio)
      } else {
        setWidth(naturalWidth)
        setHeight(naturalHeight)
      }
    } else {
      if (naturalWidth > innerWidth) {
        setWidth(innerWidth)
        setHeight(innerWidth / (naturalWidth / naturalHeight))
      } else {
        setWidth(naturalWidth)
        setHeight(naturalHeight)
      }
    }
  })

  const prefixCls = `${UI_PREFIX}-image-preview`
  const scalePercent = `${Math.round(zoom * 100)}%`

  const toolbarList = [
    {
      id: 'download',
      title: t('react_ui.download.text'),
      icon: <TbDownload className={`${prefixCls}-icon`} />,
      handler: handleDownload
    },
    {
      id: 'left-rotate',
      title: t('react_ui.rotate_counterclockwise'),
      icon: <TbRotate className={`${prefixCls}-icon`} />,
      handler: handleLeftRotate
    },
    {
      id: 'right-rotate',
      title: t('react_ui.rotate_clockwise'),
      icon: <TbRotateClockwise className={`${prefixCls}-icon`} />,
      handler: handleRightRotate
    },
    {
      id: 'shrink',
      title: t('react_ui.zoom.out'),
      icon: <TbZoomOut className={`${prefixCls}-icon`} />,
      handler: handleZoomOut
    },
    {
      id: 'swell',
      title: t('react_ui.zoom.in'),
      icon: <TbZoomIn className={`${prefixCls}-icon`} />,
      handler: handleZoomIn
    },
    {
      id: 'reset',
      title: t('react_ui.resize'),
      icon: <TbRelationOneToOne className={`${prefixCls}-icon`} />,
      handler: handleReset
    },
    {
      id: 'close',
      title: t('react_ui.close'),
      icon: <TbX className={`${prefixCls}-icon`} />,
      handler: onClose
    }
  ]

  const detailLoading = !src || !detailLoaded
  const operationDisabled = detailLoading || detailError
  const toolbarEle = (
    <Motion.Slide in={toolbarVisible} direction="up" mountOnEnter unmountOnExit>
      <div className={`${prefixCls}-toolbar`}>
        <Space size="small">
          {toolbarList.map(item => (
            <Tooltip key={item.id} appendTo={null} spacing={12} placement="top" title={item.title}>
              <Button
                className={cls(`${prefixCls}-icon-wrap`, {
                  [`${prefixCls}-icon-wrap-disabled`]: operationDisabled
                })}
                circle
                text
                disabled={item.id !== 'close' && operationDisabled}
                onClick={item.handler}
              >
                {item.icon}
              </Button>
            </Tooltip>
          ))}
        </Space>
      </div>
    </Motion.Slide>
  )

  return (
    <Overlay
      ref={overlayRef}
      className={`${prefixCls}-overlay`}
      unmountOnExit={unmountOnExit}
      open={open}
      onCancel={onClose}
      onTouchStart={handleTouchDragStart}
      afterClose={afterClose}
    >
      <div
        className={`${prefixCls}`}
        onClick={event => {
          // scale < 1 时，外层 detail 的宽高不变，点击 detail 也需要关闭弹窗。
          if (event.target === event.currentTarget) {
            onClose?.()
          }
        }}
      >
        <div className={`${prefixCls}-loading-icon`}>
          <Loading spinning={detailLoading} bordered size="large" />
        </div>

        {detailError ? (
          <a className={`${prefixCls}-fallback`} target="_blank" href={src}>
            <TbPhotoX />
          </a>
        ) : (
          <img
            ref={imgDetailRef}
            className={cls(`${prefixCls}-pic`, {
              'with-transition': !is_touch_device,
              [`${prefixCls}-pic-loaded`]: !detailLoading
            })}
            src={src}
            alt="Preview"
            draggable={false}
            style={{
              width,
              height,
              transform: `scale(${zoom}) rotate(${rotate}deg)`,
              ...(offset
                ? {
                    position: 'fixed',
                    left: offset.x,
                    top: offset.y
                  }
                : {})
            }}
            onMouseDown={handleMouseDragStart}
            onLoad={event => {
              onLoad?.(event)
              setDetailLoaded()
              setImageRect(event)
            }}
            onError={event => {
              onError?.(event)
              handleDetailError()
            }}
            onClick={() => {
              if (detailLoading) {
                onClose?.()
              }
            }}
          />
        )}
      </div>
      {ratioVisible && <div className={`${prefixCls}-ratio`}>{scalePercent}</div>}
      {toolbarEle}
    </Overlay>
  )
}
ImagePreview.displayName = 'ImagePreview'
export default ImagePreview
