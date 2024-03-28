import { Button, Space, Tooltip } from '@youknown/react-ui/src'
import type { ReactNode } from 'react'
import { GrGithub } from 'react-icons/gr'

import BackTop from '../back-top'

interface FabItem {
  id: string
  title?: string
  icon: ReactNode
  handler?: () => void
}
export default function FabBar() {
  const fab_list: FabItem[] = [
    {
      id: 'github',
      icon: <GrGithub className="text-20px" />,
      handler: () => {
        window.open('https://github.com/pan-Z2l0aHVi/youknown/tree/master/apps/book-fe')
      }
    }
  ]
  return (
    <Space className="z-9 fixed sm:bottom-32px sm:right-48px <sm:right-8px <sm:bottom-80px" direction="vertical">
      <BackTop />

      {fab_list.map(item => (
        <Tooltip key={item.id} title={item.title} disabled={!item.title}>
          <Button circle size="large" className="shadow-shadow-m" onClick={item.handler}>
            {item.icon}
          </Button>
        </Tooltip>
      ))}
    </Space>
  )
}
