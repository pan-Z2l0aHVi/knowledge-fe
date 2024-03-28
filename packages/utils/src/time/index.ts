/**
 * 延时
 */
export function delay(duration = 0): Promise<number> {
  return new Promise(resolve => {
    const timer = window.setTimeout(() => {
      resolve(timer)
    }, duration)
  })
}

export const macroDefer = setTimeout

export const microDefer = Promise.prototype.then.bind(Promise.resolve())
