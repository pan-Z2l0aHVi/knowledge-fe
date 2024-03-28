import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbArrowBackUp } from 'react-icons/tb'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function UndoBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-undo-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.undo')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      disabled={!editor.can().undo()}
      onCommand={() => {
        editor.chain().focus().undo().run()
      }}
    >
      <TbArrowBackUp />
    </CommandBtn>
  )
}
