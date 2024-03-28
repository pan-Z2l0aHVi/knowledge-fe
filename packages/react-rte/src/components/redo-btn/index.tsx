import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbArrowForwardUp } from 'react-icons/tb'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function RedoBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-redo-btn`
  return (
    <CommandBtn
      className={cls(prefixCls)}
      tooltip={t('react_rte.redo')}
      tooltipDisabled={!tooltip}
      disabled={!editor.can().redo()}
      onCommand={() => {
        editor.chain().focus().redo().run()
      }}
    >
      <TbArrowForwardUp />
    </CommandBtn>
  )
}
