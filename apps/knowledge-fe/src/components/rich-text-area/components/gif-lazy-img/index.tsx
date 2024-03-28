import { useBoolean, useIntersection } from '@youknown/react-hook/src'
import { Loading } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import type { HTMLAttributes } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { parse_gif_frame } from '@/utils/gif'

interface GIFLazyImageProps extends HTMLAttributes<HTMLElement> {
  src: string
}
export default function GIFLazyImage(props: GIFLazyImageProps) {
  const { src, className, ...rest } = props
  const [final_src, set_final_src] = useState('')
  const [first_frame, set_first_frame] = useState('')
  const [playing, { setReverse: toggle_play }] = useBoolean(false)

  const fetch_gif_first_frame = useCallback(async (): Promise<string> => {
    const response = await fetch(src)
    const buff = await response.arrayBuffer()
    const first_frame_base64 = await new Promise<string>((resolve, reject) => {
      try {
        parse_gif_frame(buff, (i, base64) => {
          if (!i) {
            resolve(base64)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
    return first_frame_base64
  }, [src])

  useEffect(() => {
    if (playing) {
      set_final_src(src)
    } else {
      set_final_src(first_frame)
    }
  }, [first_frame, playing, src])

  const container_ref = useRef<HTMLDivElement>(null)
  const loaded_ref = useRef(false)
  const is_intersection = useIntersection(container_ref)
  useEffect(() => {
    if (!loaded_ref.current && is_intersection) {
      fetch_gif_first_frame()
        .then(base64 => {
          set_first_frame(base64)
        })
        .catch(err => {
          console.error('get gif first frame error: ', err)
          set_final_src(src)
        })
        .finally(() => {
          loaded_ref.current = true
        })
    }
  }, [fetch_gif_first_frame, is_intersection, src])

  return final_src ? (
    <div ref={container_ref} className="relative sm:w-max <sm:w-100% max-w-full cursor-pointer" onClick={toggle_play}>
      <img loading="lazy" src={final_src} className={className} {...rest} />
      {playing || (
        <div
          className={cls(
            'absolute left-50% top-50% translate-x--50% translate-y--50%',
            'flex justify-center items-center w-40px h-40px bg-[rgba(0,0,0,0.6)] backdrop-blur-xl',
            'color-#fff text-16px font-600 rd-full'
          )}
        >
          GIF
        </div>
      )}
    </div>
  ) : (
    <div
      ref={container_ref}
      className={cls(className, 'flex items-center justify-center min-w-120px min-h-120px bg-bg-2 rd-radius-m')}
      {...rest}
    >
      <Loading spinning />
    </div>
  )
}
