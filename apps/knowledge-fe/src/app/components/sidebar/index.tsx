import { useBoolean, useEvent, useLatestRef } from '@youknown/react-hook/src'
import { Image, Tooltip } from '@youknown/react-ui/src'
import { cls, storage } from '@youknown/utils/src'
import { useEffect, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDotsVertical } from 'react-icons/tb'

import TransitionLink from '@/components/transition-link'

import Menu from './components/menu'
import My from './components/my'

const EXPAND_KEY = 'sidebar-expand'
const WIDTH_KEY = 'sidebar-width'
const DEFAULT_W = 240
const MIN_W = 160
const MAX_W = 400

export default function Sidebar() {
  const { t } = useTranslation()
  const [expand, { setReverse: toggle_expand }] = useBoolean(() => storage.local.get<boolean>(EXPAND_KEY) ?? true)
  const [sidebar_width, set_sidebar_width] = useState(() => storage.local.get<number>(WIDTH_KEY) ?? DEFAULT_W)
  const [dragging, { setTrue: start_drag, setFalse: stop_drag }] = useBoolean(false)
  const dragging_ref = useLatestRef(dragging)
  const [, start_transition] = useTransition()

  useEffect(() => {
    storage.local.set(EXPAND_KEY, expand)
  }, [expand])

  useEffect(() => {
    storage.local.set(WIDTH_KEY, sidebar_width)
  }, [sidebar_width])

  const handle_mousedown = useEvent(() => {
    start_drag()
    const mousemove_handler = (e: MouseEvent) => {
      if (!dragging_ref.current) return
      if (e.clientX > MAX_W) return
      if (e.clientX < MIN_W) return

      start_transition(() => {
        set_sidebar_width(e.clientX)
      })
    }
    const mouseup_handler = () => {
      stop_drag()
      document.removeEventListener('mousemove', mousemove_handler)
      document.removeEventListener('mouseup', mouseup_handler)
    }
    document.addEventListener('mousemove', mousemove_handler)
    document.addEventListener('mouseup', mouseup_handler, { once: true })
  })

  const handle_touch_start = useEvent(() => {
    start_drag()
    const touch_move_handler = (e: TouchEvent) => {
      if (!dragging_ref.current) return
      const touch = e.touches[0]
      if (touch.clientX > MAX_W) return
      if (touch.clientX < MIN_W) return

      start_transition(() => {
        set_sidebar_width(touch.clientX)
      })
    }
    const touch_stop_handler = () => {
      stop_drag()
      document.removeEventListener('touchmove', touch_move_handler)
      document.removeEventListener('touchend', touch_stop_handler)
      document.removeEventListener('touchcancel', touch_stop_handler)
    }
    document.addEventListener('touchmove', touch_move_handler)
    document.addEventListener('touchend', touch_stop_handler, { once: true })
    document.addEventListener('touchcancel', touch_stop_handler, { once: true })
  })

  let sidebar_style = {}
  if (expand) {
    sidebar_style = {
      width: sidebar_width
    }
  }

  const drag_divider = expand ? (
    <div
      className="group absolute right--8px top-0 pr-8px h-100% cursor-col-resize active-cursor-col-resize select-none"
      onMouseDown={handle_mousedown}
      onTouchStart={handle_touch_start}
    >
      <div
        className={cls('w-2px h-100% [@media(hover:hover)]-group-hover-bg-primary', {
          'bg-primary': dragging
        })}
      ></div>
    </div>
  ) : null

  return (
    <aside
      className={cls('z-12 sticky top-0 flex flex-col h-screen', 'b-r-1 b-r-solid b-r-divider bg-bg-2', {
        'transition-width-300': !dragging,
        'w-68px': !expand
      })}
      style={sidebar_style}
    >
      <div
        className={cls(
          'sticky top-0 p-12px bg-bg2',
          'after:content-empty after:absolute after:left-12px after:bottom-0 after:w-[calc(100%-24px)] after:h-1px after:bg-divider'
        )}
      >
        <TransitionLink className="block w-max ml-6px" to="/">
          <Image className="w-32px h-32px" alt="Branch" src="/branch.png" />
        </TransitionLink>
      </div>

      <Menu expand={expand} />

      <div
        className={cls(
          'sticky bottom-0 p-12px bg-bg-2',
          'after:content-empty after:absolute after:left-12px after:top-0 after:w-[calc(100%-24px)] after:h-1px after:bg-divider'
        )}
      >
        <My expand={expand} />

        <Tooltip title={expand ? t('fold') : t('unfold')} placement="right" spacing={20}>
          <button
            className="mt-16px border-0 bg-transparent w-44px h-32px flex items-center justify-center rd-radius-m custom-focus-outline
					active-bg-secondary-active [@media(hover:hover)]-hover-not-active-bg-secondary-hover cursor-pointer text-16px color-text-1"
            onClick={toggle_expand}
          >
            <TbDotsVertical />
          </button>
        </Tooltip>
      </div>

      {drag_divider}
    </aside>
  )
}
