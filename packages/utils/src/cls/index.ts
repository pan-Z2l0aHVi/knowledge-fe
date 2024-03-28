import { is } from '../'

export default function cls(...args: any[]): string {
  return args
    .flat(Infinity)
    .map(arg => {
      if (is.boolean(arg)) return ''
      if (is.string(arg)) return arg
      if (is.array(arg))
        return Object.keys(arg).reduce((pre, cur, i) => {
          if (!arg[Number(cur)]) return pre
          if (i === 0) return cur
          return `${pre} ${cur}`
        }, '')
      if (is.object(arg))
        return Object.keys(arg).reduce((pre, cur, i) => {
          if (!arg[cur]) return pre
          if (i === 0) return cur
          return `${pre} ${cur}`
        }, '')
      return ''
    })
    .map(arg => arg.trim())
    .filter(Boolean)
    .join(' ')
}
