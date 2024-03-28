import { useStartViewTransition } from '@youknown/react-hook/src'
import { Button, Image } from '@youknown/react-ui/src'
import { useNavigate, useParams } from 'react-router-dom'

import { list } from './data'

export default () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const startViewTransition = useStartViewTransition()
  const detail = list.find(item => item.id === id)
  if (!detail) {
    return <div>404</div>
  }
  return (
    <>
      <Button
        primary
        onClick={() => {
          startViewTransition(() => {
            navigate('/component/view_transitions/thumb')
          })
        }}
      >
        Go Back
      </Button>
      <h2>Detail View</h2>
      <h3>
        is <span className="font-bold color-orange">{id}</span> detail.
      </h3>
      <Image className="feed-cover-transition w-100% max-w-800px h-auto" src={detail.cover} />
      <div className="feed-title-transition text-32px font-700">{detail.title}</div>
    </>
  )
}
