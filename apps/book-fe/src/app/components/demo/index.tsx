import type { AnchorItem } from '@youknown/react-ui/src'
import { Anchor } from '@youknown/react-ui/src'
import { cls, uuid } from '@youknown/utils/src'
import type { MDXComponents } from 'mdx/types'
import type { ComponentType, ReactNode } from 'react'
import { isValidElement, memo, useRef, useState } from 'react'

import CodeBlock from '@/components/code-block'
import Heading from '@/components/heading'
import { useUIStore } from '@/stores'

import Header from '../header'

export interface DemoProps {
  heading: ReactNode
  component: ComponentType<{ components: MDXComponents }>
  anchor_visible?: boolean
}
export default function Demo(props: DemoProps) {
  const { heading, component: Component, anchor_visible = true } = props

  const is_mobile = useUIStore(state => state.is_mobile)
  const anchor_items_ref = useRef<AnchorItem[]>([])

  const [components] = useState<MDXComponents>(() => ({
    pre: ({ children }) => {
      if (isValidElement(children)) {
        const { className = '' } = children.props
        let language = ''
        if (className) {
          ;[, language] = className.split('language-')
        }
        return <CodeBlock language={language} code={children.props.children} />
      }
    },
    h1: ({ children }) => <Heading level={1}>{children}</Heading>,
    // memo(component, () => true) 强制只渲染一次
    h2: memo(
      ({ children }) => {
        const labelledby = uuid()
        anchor_items_ref.current.push({
          labelledby,
          content: children,
          children: []
        })
        return (
          <Heading level={2} labelledby={labelledby}>
            {children}
          </Heading>
        )
      },
      () => true
    ),
    h3: memo(
      ({ children }) => {
        const len = anchor_items_ref.current.length
        const parent = anchor_items_ref.current[len - 1]
        const labelledby = uuid()
        parent.children?.push({
          labelledby,
          content: children
        })
        return (
          <Heading level={3} labelledby={labelledby}>
            {children}
          </Heading>
        )
      },
      () => true
    ),
    h4: ({ children }) => <Heading level={4}>{children}</Heading>
  }))

  const with_anchor = anchor_visible && !is_mobile

  return (
    <>
      <Header heading={heading}></Header>

      <div
        className={cls('rich-text-container <sm:p-16px! sm:p-32px sm:m-[0_auto]', {
          flex: with_anchor
        })}
      >
        {with_anchor ? (
          <>
            <div className="w-720px">
              <Component components={components} />
            </div>
            <Anchor
              className="sticky top-120px w-200px max-h-60vh h-max overflow-y-auto ml-40px"
              offsetY={56}
              items={anchor_items_ref.current}
            />
          </>
        ) : (
          <Component components={components} />
        )}
      </div>
    </>
  )
}
