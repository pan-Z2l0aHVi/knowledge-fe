import './index.scss'

import { useEffect } from 'react'
import type { Location } from 'react-router-dom'
import { Outlet, useLocation } from 'react-router-dom'

export let preLocation: Location

export const getParamID = () => {
  if (!preLocation) {
    return ''
  }
  return preLocation.pathname.split('/').slice(-1)[0]
}

export default () => {
  const location = useLocation()
  useEffect(() => {
    preLocation = location
  }, [location])
  return (
    <>
      <h1>View Transitions</h1>
      <Outlet />
    </>
  )
}
