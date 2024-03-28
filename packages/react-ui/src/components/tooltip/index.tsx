import './tooltip.scss'

import { checkHoverSupported, cls, pick, pickDataAttrs } from '@youknown/utils/src'
import type { ComponentProps, ForwardedRef, ReactNode } from 'react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'

import { UI_PREFIX } from '../../constants'
import { EventsByTriggerNeed, Trigger } from '../trigger'

export interface TooltipProps extends Omit<ComponentProps<typeof Trigger>, 'popup' | 'motion' | 'title'> {
  title?: ReactNode
}

const _Tooltip = (props: TooltipProps, propRef: ForwardedRef<HTMLElement>) => {
  const {
    children,
    title = '',
    placement = 'top',
    open,
    defaultOpen,
    trigger = 'hover',
    mouseEnterDelay,
    mouseLeaveDelay,
    spacing,
    crossOffset,
    disabled,
    unmountOnExit = true,
    appendTo,
    onClickOutside,
    onOpenChange,
    ...rest
  } = props

  const prefixCls = `${UI_PREFIX}-tooltip`

  const popup = <div className={cls(`${prefixCls}-content`)}>{title}</div>
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
      popup={popup}
      placement={placement}
      open={open}
      defaultOpen={defaultOpen}
      trigger={trigger}
      disabled={(trigger === 'hover' && !checkHoverSupported()) || disabled}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      spacing={spacing}
      unmountOnExit={unmountOnExit}
      crossOffset={crossOffset}
      appendTo={appendTo}
      onClickOutside={onClickOutside}
      onOpenChange={onOpenChange}
      motion="grow"
      ariaRole="tooltip"
    >
      {triggerEle}
    </Trigger>
  )
}
_Tooltip.displayName = 'Tooltip'
export const Tooltip = forwardRef(_Tooltip)
