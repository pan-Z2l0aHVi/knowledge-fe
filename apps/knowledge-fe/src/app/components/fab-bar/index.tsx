import { Button, Space, Tooltip } from '@youknown/react-ui/src'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { GrGithub } from 'react-icons/gr'
import { RiBookOpenLine } from 'react-icons/ri'
import { TbMessagePlus } from 'react-icons/tb'
import { useLocation } from 'react-router-dom'
import scrollIntoView from 'scroll-into-view-if-needed'

import BackTop from '../back-top'

interface FabItem {
  id: string
  title?: string
  icon: ReactNode
  handler?: () => void
}
export default function FabBar() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const fab_list: FabItem[] = [
    {
      id: 'github',
      icon: <GrGithub className="text-20px" />,
      handler: () => {
        window.open('https://github.com/pan-Z2l0aHVi/youknown/tree/master/apps/knowledge-fe')
      }
    },
    {
      id: 'book',
      icon: <RiBookOpenLine className="text-20px" />,
      handler: () => {
        window.open('https://youknown.cc/book/')
      }
    }
  ]
  if (pathname === '/browse/feed-detail') {
    fab_list.unshift({
      id: 'comment',
      title: t('comment.text'),
      icon: <TbMessagePlus className="text-20px" />,
      handler: () => {
        const container = document.getElementById('feed-comment-area')
        if (container) {
          scrollIntoView(container, {
            scrollMode: 'if-needed',
            block: 'nearest',
            inline: 'nearest',
            behavior: 'instant'
          })
        }
        const comment_input = document.querySelector<HTMLInputElement>('#feed-comment-area .tiptap.ProseMirror')
        comment_input?.focus()
      }
    })
  }
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
