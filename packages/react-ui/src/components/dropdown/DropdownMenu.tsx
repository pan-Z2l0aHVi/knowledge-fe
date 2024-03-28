import './dropdown-menu.scss'

import { cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { UI_PREFIX } from '../../constants'
import { clickOutside } from './clickOutside'
import { MenuCtx } from './MenuCtx'

export interface DropdownMenuProps extends HTMLAttributes<HTMLElement> {
  closeAfterItemClick?: boolean
  closeDropdown?: () => void
}

const _DropdownMenu = (props: DropdownMenuProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, children, closeAfterItemClick = false, closeDropdown = clickOutside, ...rest } = props

  const prefixCls = `${UI_PREFIX}-dropdown-menu`

  return (
    <MenuCtx.Provider
      value={{
        closeAfterItemClick,
        closeDropdown
      }}
    >
      <div ref={ref} className={cls(className, prefixCls)} role="listbox" {...rest}>
        {children}
      </div>
    </MenuCtx.Provider>
  )
}
_DropdownMenu.displayName = 'DropdownMenu'
export const DropdownMenu = forwardRef(_DropdownMenu)
