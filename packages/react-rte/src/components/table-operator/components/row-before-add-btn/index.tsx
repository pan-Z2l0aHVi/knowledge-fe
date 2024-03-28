import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbTablePlus } from 'react-icons/tb'

import type { ButtonProps } from '../../../../common'
import { UI_EDITOR_PREFIX } from '../../../../common'
import CommandBtn from '../../../command-btn'

export default function RowBeforeAddBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const disabled = !editor.can().addRowBefore()
  if (disabled) {
    return null
  }
  const prefixCls = `${UI_EDITOR_PREFIX}-row-before-add-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.table.above_insert_row')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      onCommand={() => {
        editor.chain().focus().addRowBefore().run()
      }}
    >
      <TbTablePlus />
    </CommandBtn>
  )
}
