import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'

export function useBoolean(initialState: boolean | (() => boolean)): [
  boolean,
  {
    setBool: Dispatch<SetStateAction<boolean>>
    setTrue: () => void
    setFalse: () => void
    setReverse: () => void
  }
] {
  const [bool, setBool] = useState(initialState)

  const setTrue = useCallback(() => {
    setBool(true)
  }, [])
  const setFalse = useCallback(() => {
    setBool(false)
  }, [])
  const setReverse = useCallback(() => {
    setBool(p => !p)
  }, [])

  return [bool, { setBool, setTrue, setFalse, setReverse }]
}
