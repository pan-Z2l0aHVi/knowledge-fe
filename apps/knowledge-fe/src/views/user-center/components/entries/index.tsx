import { Button } from '@youknown/react-ui/src'
import { useTranslation } from 'react-i18next'
import { TbFolderHeart, TbHistory } from 'react-icons/tb'

import { useTransitionNavigate } from '@/hooks/use-transition-navigate'

export default function Entires() {
  const navigate = useTransitionNavigate()
  const { t } = useTranslation()

  const entry_list = [
    {
      title: t('page.title.history'),
      Icon: TbHistory,
      path: '/history'
    },
    {
      title: t('page.title.collection'),
      Icon: TbFolderHeart,
      path: '/collection'
    }
  ]

  return (
    <div className="flex items-center bg-bg-0 rd-radius-l p-4px mb-16px">
      {entry_list.map(entry => (
        <Button
          key={entry.path}
          className="w-72px! h-72px mr-16px"
          square
          text
          size="large"
          onClick={() => {
            navigate(entry.path)
          }}
        >
          <div className="flex flex-col items-center">
            <entry.Icon className="text-28px color-primary" />
            <div className="text-12px color-text-2 mt-4px whitespace-nowrap">{entry.title}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
