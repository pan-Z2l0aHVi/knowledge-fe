import { cls } from '@youknown/utils/src'
import { TbX } from 'react-icons/tb'

import { useBannerVisible } from '@/hooks/use-banner-visible'

export default function Banner() {
  const [visible, { hide }] = useBannerVisible()
  const text = 'Hello~'

  if (!visible) {
    return null
  }

  return (
    <div
      className={cls(
        'relative flex justify-center items-center flex-wrap break-all p-[4px_40px] min-h-40px color-primary',
        'before:content-empty before:absolute before:left-0 before-top-0 before:w-100% before:h-100% before:opacity-30 before:bg-primary'
      )}
    >
      {text}
      <div
        className="absolute right-8px flex items-center justify-center w-24px h-24px cursor-pointer [@media(hover:hover)]-hover-color-primary-hover"
        onClick={hide}
      >
        <TbX className="text-16px" />
      </div>
    </div>
  )
}
