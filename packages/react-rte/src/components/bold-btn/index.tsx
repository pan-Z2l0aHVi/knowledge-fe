import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { PiTextBBold } from 'react-icons/pi'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function BoldBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-bold-btn`
  return (
    <CommandBtn
      className={cls(prefixCls)}
      tooltip={t('react_rte.bold')}
      tooltipDisabled={!tooltip}
      active={editor.isActive('bold')}
      disabled={!editor.can().toggleBold()}
      onCommand={() => {
        editor.chain().focus().toggleBold().run()
      }}
    >
      <PiTextBBold />
    </CommandBtn>
  )
}
