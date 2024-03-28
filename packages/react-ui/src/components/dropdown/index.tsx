import { pick, pickDataAttrs } from '@youknown/utils/src'
import type { ComponentProps, ForwardedRef, ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'

import { EventsByTriggerNeed, Trigger } from '../trigger'
import { clickOutside } from './clickOutside'
import { DropdownItem } from './DropdownItem'
import { DropdownMenu } from './DropdownMenu'
import { DropdownTitle } from './DropdownTitle'

export interface DropdownProps
  extends Omit<ComponentProps<typeof Trigger>, 'popup' | 'growTransformOrigin' | 'content' | 'motion'> {
  content?: ReactNode
}

const _Dropdown = (props: DropdownProps, propRef: ForwardedRef<HTMLElement>) => {
  const {
    children,
    content,
    placement = 'bottom-start',
    open,
    defaultOpen,
    trigger,
    mouseEnterDelay,
    mouseLeaveDelay,
    spacing,
    crossOffset,
    disabled,
    appendTo,
    unmountOnExit = true,
    onClickOutside,
    onOpenChange,
    ...rest
  } = props

  const triggerEle = Children.map(children, child =>
    isValidElement(child)
      ? cloneElement(child, {
          ...pick(rest, ...EventsByTriggerNeed),
          ...pickDataAttrs(rest)
        })
      : child
  )

  return (
    <Trigger
      ref={propRef}
      popup={content}
      placement={placement}
      open={open}
      defaultOpen={defaultOpen}
      trigger={trigger}
      disabled={disabled}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      spacing={spacing}
      unmountOnExit={unmountOnExit}
      crossOffset={crossOffset}
      appendTo={appendTo}
      onClickOutside={onClickOutside}
      onOpenChange={onOpenChange}
      motion="stretch"
      ariaRole="menu"
    >
      {triggerEle}
    </Trigger>
  )
}
_Dropdown.displayName = 'Dropdown'

const RefDropdown = forwardRef(_Dropdown)
export const Dropdown = RefDropdown as typeof RefDropdown & {
  Menu: typeof DropdownMenu
  Item: typeof DropdownItem
  Title: typeof DropdownTitle
  close: typeof clickOutside
}
Dropdown.Menu = DropdownMenu
Dropdown.Item = DropdownItem
Dropdown.Title = DropdownTitle
Dropdown.close = clickOutside
