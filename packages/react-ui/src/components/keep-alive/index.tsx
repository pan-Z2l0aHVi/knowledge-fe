import type { FC, ReactNode } from 'react'
import { Suspense, useEffect, useRef } from 'react'

export interface RepeaterProps {
  children: ReactNode
  show: boolean
}
const Repeater = (props: RepeaterProps) => {
  const { children, show } = props
  const resolveRef = useRef<() => void>()
  useEffect(
    () => () => {
      resolveRef.current?.()
    },
    []
  )
  if (!show) {
    throw new Promise<void>(resolve => {
      resolveRef.current = resolve
    })
  }
  return <>{children}</>
}

export interface KeepAliveProps extends RepeaterProps {
  fallback?: ReactNode
}
export const KeepAlive: FC<KeepAliveProps> = props => {
  const { children, show, fallback } = props
  return (
    <Suspense fallback={fallback}>
      <Repeater show={show}>{children}</Repeater>
    </Suspense>
  )
}
KeepAlive.displayName = 'KeepAlive'
