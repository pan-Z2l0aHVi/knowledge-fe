import { cls } from '@youknown/utils/src'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

import { is_dark_theme_getter, useUIStore } from '@/stores'

interface MoreLoadingProps {
  ending_text?: string
}
function NoMore(props: MoreLoadingProps, ref: ForwardedRef<HTMLDivElement>) {
  const { t } = useTranslation()
  const { ending_text = t('load.no_more') } = props
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  return (
    <div
      ref={ref}
      className={cls(
        'relative flex justify-center items-center h-80px',
        'after:absolute after:content-empty after:w-280px after:h-1px after:bg-gradient-to-r',
        is_dark_theme ? 'from-#000 via-#fff to-#000' : 'from-#fff via-#666 to-#fff'
      )}
    >
      <div className="z-1 pl-8px pr-8px bg-bg-0 color-text-3">{ending_text}</div>
    </div>
  )
}
export default forwardRef(NoMore)
