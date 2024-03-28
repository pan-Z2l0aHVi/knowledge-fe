import { useComposeRef, useEvent } from '@youknown/react-hook/src'
import { Button } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import type { ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { TbArrowBack } from 'react-icons/tb'
import scrollIntoView from 'scroll-into-view-if-needed'

import { RouteItem } from '@/router/routes'

interface ResultListProps {
  footer?: ReactNode
  result: RouteItem[]
  selection: RouteItem | null
  set_selection: (next_selection: RouteItem | null) => void
  go_detail: (route: RouteItem | null) => void
}
const ResultList = forwardRef<HTMLDivElement, ResultListProps>((props, prop_ref) => {
  const { result, selection, set_selection, go_detail, footer } = props
  const len = result.length
  const select_item_path = selection?.path ?? ''
  const item_ref_map = useRef<Record<string, HTMLDivElement | null>>({})
  const list_ref = useRef<HTMLDivElement>(null)
  const ref = useComposeRef(list_ref, prop_ref)

  const selection_index = result.findIndex(item => item.path === select_item_path)
  const into_view = (el: HTMLElement | null) => {
    if (el) {
      scrollIntoView(el, {
        scrollMode: 'if-needed',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }

  const keydown_handler = useEvent((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (select_item_path) {
          go_detail(selection)
        }
        break
      case 'ArrowUp': {
        const next_index = selection_index <= 0 ? len - 1 : selection_index - 1
        const next_selection = result[next_index]
        set_selection(next_selection)
        into_view(item_ref_map.current[next_selection.path])
        break
      }
      case 'ArrowDown': {
        const next_index = selection_index >= len - 1 ? 0 : selection_index + 1
        const next_selection = result[next_index]
        set_selection(next_selection)
        into_view(item_ref_map.current[next_selection.path])
        break
      }
    }
  })
  useEffect(() => {
    document.addEventListener('keydown', keydown_handler)
    return () => {
      document.removeEventListener('keydown', keydown_handler)
    }
  }, [keydown_handler])

  return (
    <div ref={ref} className="z-1 overflow-y-auto overflow-y-overlay h-100% p-12px pl-16px pr-16px">
      {result.map(item => {
        const selected = selection?.path === item.path
        return (
          <div
            key={item.path}
            ref={node => {
              item_ref_map.current[item.path] = node
            }}
            className={cls(
              'flex items-center justify-between rd-radius-m b-1 b-solid b-divider p-8px mb-12px',
              '[@media(hover:hover)]-hover-shadow-shadow-m cursor-pointer',
              {
                'b-primary shadow-[inset_0_0_0_1px_var(--ui-color-primary)]!': selected,
                '[@media(hover:hover)]-hover-shadow-[inset_0_0_0_1px_var(--ui-color-primary),var(--ui-shadow-m)]!':
                  selected
              }
            )}
            onClick={() => set_selection(item)}
            onDoubleClick={() => go_detail(item)}
          >
            <div className="flex-1 w-0 pl-8px">
              <div className="line-clamp-1 font-600 color-text-2">{item.meta?.title?.()}</div>
            </div>
            <Button text square onClick={() => go_detail(item)}>
              <TbArrowBack className="color-primary text-16px" />
            </Button>
          </div>
        )
      })}
      {footer}
    </div>
  )
})

export default ResultList
