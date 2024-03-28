import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { CgArrowsMergeAltH } from 'react-icons/cg'

import type { ButtonProps } from '../../../../common'
import { UI_EDITOR_PREFIX } from '../../../../common'
import CommandBtn from '../../../command-btn'

export default function CellMergeBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const disabled = !editor.can().mergeCells()
  if (disabled) {
    return null
  }
  const prefixCls = `${UI_EDITOR_PREFIX}-cell-merge-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.table.merge_cells')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      onCommand={() => {
        editor.chain().focus().mergeCells().run()
      }}
    >
      <CgArrowsMergeAltH />
    </CommandBtn>
  )
}
