import { Button, Popover, Space } from '@youknown/react-ui/src'
import { useTranslation } from 'react-i18next'
import { MdOutlineWifiTetheringErrorRounded } from 'react-icons/md'
import { TbHome, TbReload } from 'react-icons/tb'
import { useRouteError } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError() as Error
  const { t } = useTranslation()
  console.error('routeError', error)
  const error_pop = <div className="max-w-300px">{error.message}</div>
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Popover trigger="click" placement="top" content={error_pop}>
        <div className="mb-16px cursor-pointer">
          <MdOutlineWifiTetheringErrorRounded className="text-56px color-text-3 hover-color-primary" />
        </div>
      </Popover>
      <h1 className="mb-24px">{t('route_error')}</h1>
      <Space>
        <Button
          round
          prefixIcon={<TbReload className="text-16px" />}
          onClick={() => {
            location.reload()
          }}
        >
          {t('reload&retry')}
        </Button>
        <Button
          primary
          round
          prefixIcon={<TbHome className="text-16px" />}
          onClick={() => {
            location.replace('/')
          }}
        >
          {t('return_homepage')}
        </Button>
      </Space>
    </div>
  )
}
