import { useCallback, useState } from 'react'

export function useUpdate(): () => void {
  const [, setState] = useState({})
  const update = useCallback(() => {
    setState({})
  }, [])
  return update
}
