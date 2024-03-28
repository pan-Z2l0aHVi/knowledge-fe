import './tabs.scss'

import { useControllable, useNextTickState } from '@youknown/react-hook/src'
import { cls, omit } from '@youknown/utils/src'
import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { TbX } from 'react-icons/tb'

import { UI_PREFIX } from '../../constants'
import { Space } from '../space'

export interface TabOption<T> {
  key: T
  name: ReactNode
  disabled?: boolean
  closable?: boolean
}

export interface TabsProps<T> extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  type?: 'line' | 'round' | 'segment' | 'card'
  tabList?: TabOption<T>[]
  onTabListChange?: (tabList: TabOption<T>[]) => void
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
}

const _Tabs = <T extends string | number>(props: TabsProps<T>, propRef: ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    type = 'line',
    tabList = [],
    onTabListChange,
    ...rest
  } = omit(props, 'defaultValue', 'value', 'onChange')

  const [tabMap] = useState(() => new Map<T, HTMLElement | null>())
  const [, setSelectedIndex] = useNextTickState(0)
  const [value, setValue] = useControllable<T>(props)

  const changeFocus = (index: number) => {
    const tabKeys = Array.from(tabMap.keys())
    const selectedTabEle = tabMap.get(tabKeys[index])
    selectedTabEle?.focus()
  }

  const prefixCls = `${UI_PREFIX}-tabs`

  const tabListEle = tabList.map(opt => {
    const isActive = opt.key === value

    const removeTab = (focusAfterRemoved = false) => {
      tabMap.delete(opt.key)
      const nextTabList = tabList.filter(tab => tab.key !== opt.key)
      if (nextTabList.length) {
        let index = tabList.findIndex(tab => tab.key === opt.key)
        if (index > nextTabList.length - 1) {
          index = 0
        }
        if (focusAfterRemoved) {
          changeFocus(index)
        }
        if (isActive) {
          setValue(nextTabList[index].key)
        }
      }
      onTabListChange?.(nextTabList)
    }
    return (
      <div
        key={opt.key}
        ref={node => {
          if (opt.disabled) return
          tabMap.set(opt.key, node)
        }}
        role="tab"
        className={cls(`${prefixCls}-tab-item`, `${prefixCls}-tab-item-${type}`, {
          [`${prefixCls}-tab-item-${type}-active`]: isActive,
          [`${prefixCls}-tab-item-${type}-disabled`]: opt.disabled
        })}
        tabIndex={isActive ? 0 : -1}
        data-tabkey={opt.key}
        aria-selected={isActive}
        aria-disabled={opt.disabled}
        onClick={() => {
          if (opt.disabled) return
          setValue(opt.key)
        }}
        onKeyDown={event => {
          if (opt.disabled) return
          switch (event.key) {
            case ' ':
            case 'Enter':
              setValue(opt.key)
              break

            case 'Escape':
              if (opt.closable) {
                removeTab(true)
              }
              break

            case 'ArrowRight':
              setSelectedIndex(p => {
                return Math.min(p + 1, tabList.filter(tab => !tab.disabled).length - 1)
              }, changeFocus)
              break

            case 'ArrowLeft':
              setSelectedIndex(p => {
                return Math.max(p - 1, 0)
              }, changeFocus)
              break

            default:
              break
          }
        }}
      >
        {opt.name}
        {opt.closable && (
          <div
            className={`${prefixCls}-tab-item-close-icon`}
            onClick={event => {
              event.stopPropagation()
              removeTab()
            }}
          >
            <TbX />
          </div>
        )}
      </div>
    )
  })

  return (
    <div ref={propRef} className={cls(className, prefixCls)} role="tablist" {...rest}>
      {type === 'line' && <Space size="large">{tabListEle}</Space>}
      {type === 'round' && <Space size="large">{tabListEle}</Space>}
      {type === 'segment' && <div className={`${prefixCls}-segment-list`}>{tabListEle}</div>}
      {type === 'card' && <div className={`${prefixCls}-card-list`}>{tabListEle}</div>}
    </div>
  )
}
_Tabs.displayName = 'Tabs'

export const Tabs = forwardRef(_Tabs)
