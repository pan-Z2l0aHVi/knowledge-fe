import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbTableRow } from 'react-icons/tb'

import type { ButtonProps } from '../../../../common'
import { UI_EDITOR_PREFIX } from '../../../../common'
import CommandBtn from '../../../command-btn'

export default function RowDeleteBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const disabled = !editor.can().deleteRow()
  if (disabled) {
    return null
  }
  const prefixCls = `${UI_EDITOR_PREFIX}-row-delete-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.table.rm_row')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      onCommand={() => {
        editor.chain().focus().deleteRow().run()
      }}
    >
      <TbTableRow />
    </CommandBtn>
  )
}
