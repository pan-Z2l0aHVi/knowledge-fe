import { useEffect, useState } from 'react'

interface Coordinate {
  x: number
  y: number
}
export function useClickCoordinate(conditionFn: (coordinate: Coordinate) => boolean = () => true): [number, number] {
  const [{ x, y }, setCoordinate] = useState<Coordinate>({ x: 0, y: 0 })
  useEffect(() => {
    function getCoordinate(event: MouseEvent) {
      const coordinate = { x: event.clientX, y: event.clientY }
      if (conditionFn(coordinate)) setCoordinate(coordinate)
    }
    document.addEventListener('click', getCoordinate)
    return () => {
      document.removeEventListener('click', getCoordinate)
    }
  }, [conditionFn])
  return [x, y]
}
