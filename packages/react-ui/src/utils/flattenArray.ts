export function flattenArray<T extends Record<string, any> & { children?: T[] }>(arr: T[]) {
  const result: T[] = []

  function flatten(item: T) {
    result.push(item)
    if (item.children && Array.isArray(item.children)) {
      item.children.forEach(flatten)
    }
  }
  arr.forEach(flatten)
  return result
}
