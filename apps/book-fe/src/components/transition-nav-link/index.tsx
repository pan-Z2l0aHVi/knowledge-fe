import { cls, is } from '@youknown/utils/src'
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { NavLink } from 'react-router-dom'

import { useTransitionNavigate } from '@/hooks/use-transition-navigate'

const TransitionNavLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof NavLink>>((props, ref) => {
  const { className, onClick, to, replace, state, relative, preventScrollReset, ...rest } = props
  const navigate = useTransitionNavigate()

  let merged_cls = className
  if (is.string(className)) {
    merged_cls = cls(className, 'custom-focus-outline')
  } else if (is.function(className)) {
    merged_cls = (...args) => cls(className(...args), 'custom-focus-outline')
  }

  return (
    <NavLink
      ref={ref}
      className={merged_cls}
      to={to}
      replace={replace}
      state={state}
      relative={relative}
      preventScrollReset={preventScrollReset}
      onClick={e => {
        onClick?.(e)
        e.preventDefault()

        navigate(to, {
          replace,
          state,
          relative,
          preventScrollReset
        })
      }}
      {...rest}
    />
  )
})
export default TransitionNavLink
