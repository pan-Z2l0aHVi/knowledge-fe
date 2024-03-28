import './image.scss'

import { useComposeRef, useEvent } from '@youknown/react-hook/src'
import type { ArgumentType } from '@youknown/utils/src'
import { cls, is } from '@youknown/utils/src'
import type { ForwardedRef, ImgHTMLAttributes } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'

import { UI_PREFIX } from '../../constants'
import crackImage from './crack-image'
import { preview } from './preview'

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, Omit<ArgumentType<typeof preview>, 'url'> {
  src: string
  previewSrc?: string | (() => Promise<string>)
  canPreview?: boolean
}

const _Image = (props: ImageProps, propRef: ForwardedRef<HTMLImageElement>) => {
  const {
    className,
    src = '',
    previewSrc = src,
    canPreview = false,
    toolbarVisible,
    minZoom,
    maxZoom,
    onDownloadSuccess,
    onDownloadError,
    onClick,
    onError,
    ...rest
  } = props

  const innerRef = useRef<HTMLImageElement>(null)
  const imgRef = useComposeRef(propRef, innerRef)
  const [isError, setIsError] = useState(false)
  useEffect(() => {
    setIsError(!src)
  }, [src])

  const showDetail = useEvent((url: string) => {
    preview({
      url,
      toolbarVisible,
      minZoom,
      maxZoom,
      onDownloadSuccess,
      onDownloadError
    })
  })

  const prefixCls = `${UI_PREFIX}-image`

  return (
    <img
      className={cls(className, prefixCls, {
        [`${prefixCls}-can-preview`]: canPreview,
        [`${prefixCls}-is-error`]: isError
      })}
      ref={imgRef}
      src={isError ? crackImage : src}
      onError={event => {
        onError?.(event)
        setIsError(true)
      }}
      onClick={event => {
        onClick?.(event)

        if (canPreview) {
          if (is.string(previewSrc)) {
            showDetail(previewSrc)
          } else {
            previewSrc().then(url => {
              showDetail(url)
            })
          }
        }
      }}
      {...rest}
    />
  )
}
_Image.displayName = 'Image'
export const Image = forwardRef(_Image)
