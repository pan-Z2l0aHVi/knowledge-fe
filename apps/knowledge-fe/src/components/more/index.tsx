import { cls } from '@youknown/utils/src'
import type { ButtonHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { TbDots } from 'react-icons/tb'

interface MoreProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}
const More = forwardRef<HTMLButtonElement, MoreProps>((props, ref) => {
  const { className, active = false, ...rest } = props
  return (
    <button
      ref={ref}
      type="button"
      className={cls(
        className,
        'm-0 p-0 cursor-pointer custom-focus-outline',
        'relative rd-full p-10px border-0 bg-bg-0',
        '[@media(hover:hover)]-hover-brightness-95 active-brightness-90!',
        'before:content-empty before:absolute before:left-0 before:top-0 before:w-100% before:h-100% before:bg-primary before:opacity-30 before:rd-inherit',
        active && 'opacity-50'
      )}
      {...rest}
    >
      <TbDots className="absolute translate-x--50% translate-y--50% color-primary text-16px" />
    </button>
  )
})

export default More
