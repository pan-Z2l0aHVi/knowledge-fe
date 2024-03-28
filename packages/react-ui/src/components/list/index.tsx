import './list.scss'

import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { UI_PREFIX } from '../../constants'
import { ListCtx } from './ListCtx'
import { ListItem } from './ListItem'

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large'
  bordered?: boolean
}

const _List = (props: ListProps, propRef: ForwardedRef<HTMLDivElement>) => {
  const { className, children, size = 'medium', bordered = true, ...rest } = props

  const prefixCls = `${UI_PREFIX}-list`

  return (
    <ListCtx.Provider value={{ size, bordered }}>
      <div
        ref={propRef}
        className={cls(className, prefixCls, {
          [`${prefixCls}-bordered`]: bordered
        })}
        {...rest}
      >
        {children}
      </div>
    </ListCtx.Provider>
  )
}
_List.displayName = 'List'

const RefList = forwardRef(_List)
export const List = RefList as typeof RefList & {
  Item: typeof ListItem
}
List.Item = ListItem
