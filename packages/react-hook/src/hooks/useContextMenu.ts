import type { MouseEvent } from 'react'
import { useCallback, useState } from 'react'

import { useControllable } from './useControllable'

export function useContextMenu(open?: boolean, onOpenChange?: (open: boolean) => void) {
  const [_open, _setOpen] = useControllable(
    { open, onOpenChange },
    {
      defaultValue: false,
      valuePropName: 'open',
      trigger: 'onOpenChange'
    }
  )
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const closeContextMenu = useCallback(() => {
    _setOpen(false)
  }, [_setOpen])

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      setX(event.clientX)
      setY(event.clientY)
      _setOpen(true)
    },
    [_setOpen]
  )
  const contextMenuProps = { x, y, open: _open, onOpenChange: _setOpen }
  return { onContextMenu, contextMenuProps, closeContextMenu }
}
