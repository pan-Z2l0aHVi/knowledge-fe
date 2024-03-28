import './anchor.scss'

import { useComposeRef, useEvent } from '@youknown/react-hook/src'
import { cls, is } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { forwardRef, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'

import { UI_PREFIX } from '../../constants'
import { flattenArray } from '../../utils/flattenArray'

export interface AnchorItem {
  labelledby: string
  content: ReactNode
  handler?: MouseEventHandler<HTMLLIElement>
  children?: AnchorItem[]
}

export interface AnchorProps extends HTMLAttributes<HTMLDivElement> {
  items?: AnchorItem[]
  container?: Element
  offsetY?: number
}

const _Anchor = (props: AnchorProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, items = [], container = window, offsetY = 0, ...rest } = props
  const [selection, setSelection] = useState('')
  const flattenItems = useMemo(() => flattenArray(items), [items])
  const scriptScrollRef = useRef(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const mergedRef = useComposeRef(anchorRef, ref)
  const flattenItemsRef = useRef<Record<string, HTMLLIElement | null>>({})

  const LABELLEDBY = 'aria-labelledby'

  const getActiveLabelledby = useEvent(() => {
    const list: { top: number; labelledby: string }[] = []

    flattenItems.forEach(item => {
      const anchor = document.querySelector(`[${LABELLEDBY}="${item.labelledby}"]`)
      if (anchor) {
        const top = anchor.getBoundingClientRect().top
        const inView = top <= offsetY
        if (inView) {
          list.push({
            labelledby: item.labelledby,
            top
          })
        }
      }
    })
    if (list.length) {
      return list.reduce((prev, cur) => (prev.top > cur.top ? prev : cur)).labelledby
    }
  })

  const onScroll = useEvent(() => {
    if (scriptScrollRef.current) {
      scriptScrollRef.current = false
      return
    }
    const labelledby = getActiveLabelledby()
    if (labelledby) {
      // 选中 top 最大的一个激活
      setSelection(labelledby)
    }
  })

  useEffect(() => {
    const selected_anchor = flattenItemsRef.current[selection]
    if (selected_anchor) {
      scrollIntoView(selected_anchor, {
        scrollMode: 'if-needed',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [selection])

  useEffect(() => {
    container.addEventListener('scroll', onScroll, {
      passive: true
    })
    return () => {
      container.removeEventListener('scroll', onScroll)
    }
  }, [container, onScroll])

  const scrollToAnchor = (labelledby: string) => {
    const anchor = document.querySelector(`[aria-labelledby="${labelledby}"]`)
    if (anchor) {
      setSelection(labelledby)
      scriptScrollRef.current = true
      const scrollContainer = is.window(container) ? document.documentElement : container
      scrollContainer.scrollTop += anchor.getBoundingClientRect().top - offsetY
    }
  }

  const prefixCls = `${UI_PREFIX}-anchor`
  const PL = 16

  const renderItems = (anchorItems: AnchorItem[], depth = 1): ReactNode => {
    return (
      <>
        {anchorItems.map(item => {
          const isSelected = selection === item.labelledby
          return (
            <Fragment key={item.labelledby}>
              <li
                ref={node => {
                  flattenItemsRef.current[item.labelledby] = node
                }}
                title={String(item.content)}
                className={cls(`${prefixCls}-item`, {
                  selected: isSelected
                })}
                style={{
                  paddingLeft: PL * depth
                }}
                aria-current={isSelected}
                onClick={event => {
                  item.handler?.(event)
                  scrollToAnchor(item.labelledby)
                }}
              >
                {item.content}
              </li>
              {item.children?.length ? renderItems(item.children, depth + 1) : null}
            </Fragment>
          )
        })}
      </>
    )
  }

  return (
    <div ref={mergedRef} className={cls(className, prefixCls)} {...rest}>
      <ul className={`${prefixCls}-list`}>{renderItems(items)}</ul>
    </div>
  )
}

_Anchor.displayName = 'Anchor'

export const Anchor = forwardRef(_Anchor)
