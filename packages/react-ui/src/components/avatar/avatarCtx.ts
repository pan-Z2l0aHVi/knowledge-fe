import { createContext } from 'react'

export interface AvatarContext {
  size: 'small' | 'medium' | 'large' | number
  round: boolean
  bordered: boolean
}
export const AvatarCtx = createContext<Partial<AvatarContext>>({})
