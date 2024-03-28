import './avatar-group.scss'

import { cls } from '@youknown/utils/src'
import type { FC, HTMLAttributes } from 'react'

import { UI_PREFIX } from '../../constants'
import { AvatarCtx } from './avatarCtx'

export interface AvatarGroupProps extends HTMLAttributes<HTMLElement> {
  size?: 'small' | 'medium' | 'large' | number
  round?: boolean
  bordered?: boolean
}

export const AvatarGroup: FC<AvatarGroupProps> = props => {
  const { children, className, size, round = true, bordered = false, ...rest } = props

  const prefixCls = `${UI_PREFIX}-avatar-group`
  return (
    <AvatarCtx.Provider value={{ size, round, bordered }}>
      <div className={cls(className, prefixCls)} {...rest}>
        {children}
      </div>
    </AvatarCtx.Provider>
  )
}
AvatarGroup.displayName = 'AvatarGroup'
