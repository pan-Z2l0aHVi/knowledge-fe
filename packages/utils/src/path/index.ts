import { is } from '../'

export function join(...paths: (string | undefined)[]): string {
  return (paths.filter(Boolean) as string[]).reduce((pre, cur) => {
    let path = cur.trim()
    if (path.startsWith('/')) {
      path = path.slice(1)
    }
    if (path.endsWith('/')) {
      path = path.slice(0, path.length - 1)
    }
    return `${pre}/${path}`
  }, '')
}

export default {
  join
}

interface Node {
  label: string
  children?: Node[]
}

export function objToTree(objOrJson: string | object): Node[] {
  const obj = is.string(objOrJson) ? JSON.parse(objOrJson) : objOrJson

  return Object.keys(obj).map(key => {
    const val = obj[key]

    if (is.object(val))
      return {
        label: `${key}: `,
        children: objToTree(val)
      }

    if (is.array(val)) {
      const children = objToTree(val)
      return {
        label: `${key}: `,
        children: [
          ...children,
          {
            label: `length: ${children.length}`
          }
        ]
      }
    }

    return {
      label: `${key}: ${val}`
    }
  })
}
