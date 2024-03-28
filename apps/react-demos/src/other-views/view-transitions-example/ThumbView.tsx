import { useStartViewTransition } from '@youknown/react-hook/src'
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Image, List } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getParamID, preLocation } from './'
import { list } from './data'

export default () => {
  const navigate = useNavigate()
  const goDetail = (id: string) => {
    navigate(`/component/view_transitions/detail/${id}`)
  }

  const isBack = preLocation?.pathname.startsWith('/component/view_transitions/detail')
  const [detailID, setDetailID] = useState(() => {
    if (isBack) {
      return getParamID()
    }
    return ''
  })
  const startViewTransition = useStartViewTransition()

  return (
    <>
      <h2>Thumb View</h2>

      <List className="gallery">
        {list.map(item => (
          <List.Item
            key={item.id}
            className="cursor-pointer"
            suffix={
              <Image
                className={cls('w-80px h-60px', {
                  'feed-cover-transition': detailID === item.id
                })}
                src={item.cover}
              />
            }
            onClick={() => {
              setDetailID(item.id)
              const transition = startViewTransition(() => {
                goDetail(item.id)
              })
              transition.finished.finally(() => {
                setDetailID('')
              })
            }}
          >
            <div
              className={cls({
                'feed-title-transition': detailID === item.id
              })}
            >
              {item.title}
            </div>
          </List.Item>
        ))}
      </List>
    </>
  )
}
