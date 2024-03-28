import './index.scss'

import { useControllable } from '@youknown/react-hook/src'
import { Divider, Popover, Space } from '@youknown/react-ui/src'
import { cls, omit } from '@youknown/utils/src'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { TbTableOptions } from 'react-icons/tb'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'
import CellMergeBtn from './components/cell-merge-btn'
import CellSplitBtn from './components/cell-split-btn'
import ColAfterAddBtn from './components/col-after-add-btn'
import ColBeforeAddBtn from './components/col-before-add-btn'
import ColDeleteBtn from './components/col-delete-btn'
import RowAfterAddBtn from './components/row-after-add-btn'
import RowBeforeAddBtn from './components/row-before-add-btn'
import RowDeleteBtn from './components/row-delete-btn'
import TableDeleteBtn from './components/table-delete-btn'

interface TableOperatorProps extends ButtonProps, ComponentProps<typeof Popover> {}
export default function TableOperator(props: TableOperatorProps) {
  const { editor, tooltip = true, trigger = 'click', ...rest } = omit(props, 'defaultOpen', 'open', 'onOpenChange')

  const { t } = useTranslation()
  const [open, onOpenChange] = useControllable(props, {
    defaultValue: false,
    defaultValuePropName: 'defaultOpen',
    valuePropName: 'open',
    trigger: 'onOpenChange'
  })

  const prefixCls = `${UI_EDITOR_PREFIX}-table-operator`
  const verticalDivider = <Divider className={`${prefixCls}-divider`} size="small" direction="vertical" />
  const tableOperatorsPopup = (
    <Space size="small" align="center">
      <CellMergeBtn editor={editor} />
      <CellSplitBtn editor={editor} />
      <ColBeforeAddBtn editor={editor} />
      <ColAfterAddBtn editor={editor} />
      <RowBeforeAddBtn editor={editor} />
      <RowAfterAddBtn editor={editor} />
      <RowDeleteBtn editor={editor} />
      <ColDeleteBtn editor={editor} />
      {verticalDivider}
      <TableDeleteBtn editor={editor} />
    </Space>
  )

  return (
    <Popover
      placement="bottom"
      content={tableOperatorsPopup}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      {...rest}
    >
      <CommandBtn
        className={cls(prefixCls)}
        arrow
        tooltip={t('react_rte.table.operation')}
        tooltipDisabled={!tooltip}
        active={open}
        onCommand={() => {
          if (trigger === 'manual') {
            onOpenChange?.(!open)
          }
        }}
      >
        <TbTableOptions />
      </CommandBtn>
    </Popover>
  )
}
