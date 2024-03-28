import { Outlet, useParams } from 'react-router-dom'

import SpaceList from '@/views/space-list'

export default function Library() {
  const { space_id } = useParams()
  if (space_id) {
    return <Outlet />
  }
  return <SpaceList />
}
