import { cls } from '@youknown/utils/src'
import { createElement, type HTMLAttributes } from 'react'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: number
  labelledby?: string
}
export default function Heading(props: HeadingProps) {
  const { className, children, level = 1, labelledby, ...rest } = props

  // unocss 不支持拼接字符串
  let heading_cls = ''
  if (level === 1) {
    heading_cls = 'before:content-["#"]'
  } else if (level === 2) {
    heading_cls = 'before:content-["##"]'
  } else if (level === 3) {
    heading_cls = 'before:content-["###"]'
  } else if (level === 4) {
    heading_cls = 'before:content-["####"]'
  }

  return createElement(
    `h${level}`,
    {
      className: cls(
        heading_cls,
        'relative before:absolute before:left--56px',
        'before:hidden sm:hover-before:display-block before:w-48px before-text-right before-whitespace-nowrap before:color-primary',
        className
      ),
      'aria-labelledby': labelledby,
      ...rest
    },
    children
  )
}
