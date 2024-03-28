import { Image } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import type { DOMNode } from 'html-react-parser'
import parse, { domToReact, Element, Text } from 'html-react-parser'
import type { ForwardedRef, HTMLAttributes } from 'react'
import { forwardRef, useMemo, useRef } from 'react'

import { useUIStore } from '@/stores'
import { BASE_NODE_ID } from '@/utils'

import CodeBlock from './components/code-block'
import GIFLazyImage from './components/gif-lazy-img'
import Heading from './components/heading'

interface RichTextAreaProps extends HTMLAttributes<HTMLDivElement> {
  html: string
}
const RichTextArea = (props: RichTextAreaProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { className, html } = props

  const is_mobile = useUIStore(state => state.is_mobile)
  const node_id_ref = useRef(BASE_NODE_ID)

  const classnames = cls(className, 'rich-text-container')

  const rich_text_content = useMemo(() => {
    node_id_ref.current = BASE_NODE_ID
    return parse(html, {
      replace(node) {
        if (!(node instanceof Element)) {
          return
        }

        if (['h1', 'h2', 'h3', 'h4'].includes(node.name)) {
          const level = Number(node.name.slice(-1))
          // 节点遍历规则与 prase_heading_tree 保持一致，则节点自增 ID 一致
          node_id_ref.current++
          return (
            <Heading level={level} labelledby={String(node_id_ref.current)}>
              {domToReact(node.children as DOMNode[])}
            </Heading>
          )
        }

        if (node.name === 'img') {
          const { src } = node.attribs
          const width = parseFloat(node.attribs.width)
          const height = parseFloat(node.attribs.height)
          const has_w_h = !Number.isNaN(width) && !Number.isNaN(height)

          if (src.endsWith('.gif')) {
            const style = has_w_h
              ? is_mobile
                ? {
                    width: '100%',
                    aspectRatio: width / height
                  }
                : { width, height }
              : {}
            return <GIFLazyImage src={src} style={style} />
          }

          const style = has_w_h ? { width, height } : {}
          return <Image canPreview previewSrc={src} src={src} style={style} />
        }

        if (node.name === 'pre' && node.firstChild instanceof Element && node.firstChild.name === 'code') {
          const code_str = node.firstChild.children
            .filter<Text>((child): child is Text => child.type === 'text')
            .map(child => child.data)
            .join('')

          let language = ''
          const language_cls = node.firstChild.attribs?.class ?? ''
          if (language_cls) {
            ;[, language] = language_cls.split('language-')
          }
          return <CodeBlock language={language} code={code_str} />
        }
      }
    })
  }, [html, is_mobile])

  return (
    <div ref={ref} className={classnames}>
      {rich_text_content}
    </div>
  )
}

export default forwardRef(RichTextArea)
