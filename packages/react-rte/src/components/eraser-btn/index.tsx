import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbEraser } from 'react-icons/tb'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function EraserBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-eraser-btn`
  return (
    <CommandBtn
      className={cls(prefixCls)}
      tooltip={t('react_rte.clear_format')}
      tooltipDisabled={!tooltip}
      disabled={!editor.can().unsetAllMarks()}
      onCommand={() => {
        editor.chain().focus().clearNodes().unsetAllMarks().run()
      }}
    >
      <TbEraser />
    </CommandBtn>
  )
}
