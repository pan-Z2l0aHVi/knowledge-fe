import { Loading } from '@youknown/react-ui/src'
import type { ForwardedRef } from 'react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

interface MoreLoadingProps {
  loading_text?: string
}
function MoreLoading(props: MoreLoadingProps, ref: ForwardedRef<HTMLDivElement>) {
  const { t } = useTranslation()
  const { loading_text = t('load.ing') } = props
  return (
    <div ref={ref} className="flex justify-center items-center h-80px">
      <Loading spinning className="mr-8px" />
      <span className="color-text-3">{loading_text}</span>
    </div>
  )
}
export default forwardRef(MoreLoading)
