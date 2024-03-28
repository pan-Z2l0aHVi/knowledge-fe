import './index.scss'

import type { Editor } from '@tiptap/react'
import { Dropdown } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbSpacingVertical } from 'react-icons/tb'

import { UI_EDITOR_PREFIX } from '../../common'

export default function HorizontalRuleItem(props: { editor: Editor }) {
  const { editor } = props
  const { t } = useTranslation()
  const disabled = !editor.can().setHorizontalRule()
  const prefixCls = `${UI_EDITOR_PREFIX}-horizontal-rule-item`
  return (
    <Dropdown.Item
      prefix={
        <div
          className={cls(prefixCls, {
            disabled
          })}
        >
          <TbSpacingVertical />
        </div>
      }
      closeAfterItemClick
      onClick={() => {
        if (disabled) return
        editor.chain().focus().setHorizontalRule().run()
      }}
    >
      {t('react_rte.divider')}
    </Dropdown.Item>
  )
}
