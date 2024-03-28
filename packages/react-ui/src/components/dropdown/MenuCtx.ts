import { createContext } from 'react'

export interface MenuContext {
  closeAfterItemClick: boolean
  closeDropdown: () => void
}
export const MenuCtx = createContext<Partial<MenuContext>>({})
