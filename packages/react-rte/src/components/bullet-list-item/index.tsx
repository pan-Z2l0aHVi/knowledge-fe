import './index.scss'

import type { Editor } from '@tiptap/react'
import { Dropdown } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { PiListDashesBold } from 'react-icons/pi'

import { UI_EDITOR_PREFIX } from '../../common'

export default function BulletListItem(props: { editor: Editor }) {
  const { editor } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-bullet-list-item`
  return (
    <Dropdown.Item
      prefix={
        <div
          className={cls(prefixCls, {
            active: editor.isActive('bulletlist'),
            disabled: !editor.can().toggleBulletList()
          })}
        >
          <PiListDashesBold />
        </div>
      }
      closeAfterItemClick
      onClick={() => {
        editor.chain().focus().toggleBulletList().run()
      }}
    >
      {t('react_rte.bulletlist')}
    </Dropdown.Item>
  )
}
