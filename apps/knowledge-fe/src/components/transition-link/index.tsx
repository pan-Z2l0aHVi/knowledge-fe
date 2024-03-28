import { cls } from '@youknown/utils/src'
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

import { useTransitionNavigate } from '@/hooks/use-transition-navigate'

const TransitionLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>((props, ref) => {
  const { className, onClick, to, replace, state, relative, preventScrollReset, style, ...rest } = props
  const navigate = useTransitionNavigate()

  return (
    <Link
      ref={ref}
      className={cls(className, 'custom-focus-outline')}
      style={{ textDecoration: 'none', color: 'inherit', ...style }}
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
export default TransitionLink
