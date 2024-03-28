import '@youknown/css/src/rte.scss'

import type { MDXComponents } from 'mdx/types'
import { isValidElement } from 'react'

import ButtonMDX from './button.mdx'
import CodeBlock from './code-block'
const components: MDXComponents = {
  pre: props => {
    if (isValidElement(props.children)) {
      const { className = '', children = '' } = props.children.props
      let language = ''
      if (className) {
        ;[, language] = className.split('language-')
      }
      return <CodeBlock language={language} code={children} />
    }
  }
}

export default () => {
  return (
    <div className="rich-text-container">
      <ButtonMDX components={components} />
    </div>
  )
}
