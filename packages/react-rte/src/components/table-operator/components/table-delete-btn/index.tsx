import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbTableOff } from 'react-icons/tb'

import type { ButtonProps } from '../../../../common'
import { UI_EDITOR_PREFIX } from '../../../../common'
import CommandBtn from '../../../command-btn'

export default function CellMergeBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const disabled = !editor.can().deleteTable()
  if (disabled) {
    return null
  }
  const prefixCls = `${UI_EDITOR_PREFIX}-table-delete-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.table.delete')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      onCommand={() => {
        editor.chain().focus().deleteTable().run()
      }}
    >
      <TbTableOff />
    </CommandBtn>
  )
}
