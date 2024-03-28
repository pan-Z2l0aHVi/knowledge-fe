import { useEffect, useState } from 'react'

interface Size {
  width: number
  height: number
}
export function useWindowResize(conditionFn: (size: Size) => boolean = () => true): [number, number] {
  const [{ width, height }, setSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight
  })
  useEffect(() => {
    function windowResize() {
      const size = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      if (conditionFn(size)) setSize(size)
    }
    window.addEventListener('resize', windowResize)
    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [conditionFn])
  return [width, height]
}
