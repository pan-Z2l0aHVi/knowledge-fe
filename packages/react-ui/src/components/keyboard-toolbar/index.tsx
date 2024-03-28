import { checkIOS, cls } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useLayoutEffect, useState } from 'react'

import { UI_PREFIX } from '../../constants'

// TODO:
export interface KeyboardToolbarProps extends HTMLAttributes<HTMLDivElement> {
  panel?: ReactNode
}
const _KeyboardToolbar = (props: KeyboardToolbarProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, children, panel } = props

  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useLayoutEffect(() => {
    const vv = window.visualViewport
    if (checkIOS() && vv) {
      const initialHeight = vv.height
      const resizeFn = () => {
        setTimeout(() => {
          setKeyboardHeight(initialHeight - vv.height - vv.offsetTop)
        }, 50)
      }
      vv.addEventListener('resize', resizeFn)
      return () => {
        vv.removeEventListener('resize', resizeFn)
      }
    }
  }, [])

  const prefixCls = `${UI_PREFIX}-keyboard-toolbar`
  return (
    <div ref={ref} className={cls(prefixCls, className)}>
      {children}
      {keyboardHeight ? (
        <div className={cls(`${prefixCls}-placeholder`)} style={{ height: keyboardHeight }}></div>
      ) : (
        panel
      )}
    </div>
  )
}

_KeyboardToolbar.displayName = 'KeyboardToolbar'
export const KeyboardToolbar = forwardRef(_KeyboardToolbar)
