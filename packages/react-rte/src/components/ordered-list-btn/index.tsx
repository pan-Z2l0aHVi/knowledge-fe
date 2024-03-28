import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { PiListNumbersBold } from 'react-icons/pi'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function OrderedListBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-ordered-list-btn`
  return (
    <CommandBtn
      className={cls(prefixCls)}
      tooltip={t('react_rte.orderlist')}
      tooltipDisabled={!tooltip}
      active={editor.isActive('orderlist')}
      disabled={!editor.can().toggleOrderedList()}
      onCommand={() => {
        editor.chain().focus().toggleOrderedList().run()
      }}
    >
      <PiListNumbersBold />
    </CommandBtn>
  )
}
