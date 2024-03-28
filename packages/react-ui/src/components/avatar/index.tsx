import './avatar.scss'

import { cls, is } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'

import { UI_PREFIX } from '../../constants'
import { Image } from '../image/Image'
import { AvatarCtx } from './avatarCtx'
import { AvatarGroup } from './avatarGroup'

export interface AvatarProps extends HTMLAttributes<HTMLElement> {
  size?: 'small' | 'medium' | 'large' | number
  round?: boolean
  bordered?: boolean
  color?: string
  src?: string
  badge?: ReactNode
  canPreview?: boolean
}

const _Avatar = (props: AvatarProps, ref: ForwardedRef<HTMLDivElement>) => {
  const avatarCtx = useContext(AvatarCtx)

  const {
    children,
    className,
    src = '',
    size = avatarCtx.size ?? 'medium',
    round = avatarCtx.round ?? false,
    bordered = avatarCtx.bordered ?? false,
    color = 'var(--ui-bg-3)',
    badge,
    canPreview,
    style,
    ...rest
  } = props

  const prefixCls = `${UI_PREFIX}-avatar`

  const imgEle = (
    <Image
      style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
      src={src}
      alt="Avatar"
      canPreview={canPreview}
      previewSrc={src}
    />
  )

  const avatarStyle = is.number(size)
    ? {
        ...style,
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }
    : {
        ...style,
        backgroundColor: color
      }

  return (
    <div
      ref={ref}
      className={cls(className, prefixCls, is.string(size) && `${prefixCls}-${size}`, {
        [`${prefixCls}-round`]: round,
        [`${prefixCls}-bordered`]: bordered
      })}
      style={avatarStyle}
      {...rest}
    >
      {children || imgEle}
      {badge && <div className={`${prefixCls}-badge`}>{badge}</div>}
    </div>
  )
}
_Avatar.displayName = 'Avatar'

const RefAvatar = forwardRef(_Avatar)
export const Avatar = RefAvatar as typeof RefAvatar & {
  Group: typeof AvatarGroup
}
Avatar.Group = AvatarGroup
