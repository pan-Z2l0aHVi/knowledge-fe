import { useDebounce } from '@youknown/react-hook/src'
import { Button } from '@youknown/react-ui/src'
import { cls, is } from '@youknown/utils/src'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { IoChevronBackSharp } from 'react-icons/io5'
import { TbArrowLeft } from 'react-icons/tb'

import { useTransitionNavigate } from '@/hooks/use-transition-navigate'
import { useUIStore } from '@/stores'

interface HeaderProps {
  children?: ReactNode
  heading: ReactNode
  footer?: ReactNode
  bordered?: 'auto' | 'visible' | 'hidden'
}

export default function Header(props: HeaderProps) {
  const { children, heading, footer, bordered = 'auto' } = props

  const is_mobile = useUIStore(state => state.is_mobile)
  const navigate = useTransitionNavigate()
  const [border_visible, set_border_visible] = useState(false)

  useEffect(() => {
    if (bordered === 'visible') {
      set_border_visible(true)
    } else if (bordered === 'hidden') {
      set_border_visible(false)
    }
  }, [bordered])

  const scroll_handler = useDebounce(
    () => {
      set_border_visible(document.documentElement.scrollTop > 0)
    },
    100,
    { leading: true }
  )
  useEffect(() => {
    if (bordered === 'auto') {
      window.addEventListener('scroll', scroll_handler, {
        passive: true
      })
      return () => {
        window.removeEventListener('scroll', scroll_handler)
      }
    }
  }, [bordered, scroll_handler])

  const back_btn = (
    <Button
      className="sm:mr-16px"
      square
      text
      onClick={() => {
        navigate(-1)
        if (window.history.length <= 1) {
          navigate('/', { replace: true })
        }
      }}
    >
      {is_mobile ? (
        <IoChevronBackSharp className="text-18px color-primary" />
      ) : (
        <TbArrowLeft className="text-18px color-primary" />
      )}
    </Button>
  )

  return (
    <header
      className={cls(
        'sm:pl-32px sm:pr-32px <sm:pl-8px <sm:pr-8px',
        'sticky top-0 z-20 bg-bg-0',
        border_visible &&
          'before:content-empty before:absolute before:left-0 before:bottom-0 before:w-100% before:b-b-1 before:b-b-solid before:b-b-divider'
      )}
    >
      {is_mobile ? (
        <>
          <div className="relative min-h-48px flex items-center justify-between">
            {back_btn}
            {is.null(heading) || (
              <h1 className="absolute left-50% translate-x--50% whitespace-nowrap font-600 text-16px max-w-40vw truncate">
                {heading}
              </h1>
            )}
            {children}
          </div>
          {footer}
        </>
      ) : (
        <>
          <div className="sm:min-h-56px flex items-center justify-between">
            <div className="flex items-center">
              {back_btn}
              {is.null(heading) || <h1 className="<whitespace-nowrap font-600 text-16px">{heading}</h1>}
            </div>
            {children}
          </div>
          {footer}
        </>
      )}
    </header>
  )
}
