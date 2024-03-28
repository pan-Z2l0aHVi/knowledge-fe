import './index.scss'

import { useControllable } from '@youknown/react-hook/src'
import { Button, Divider, Popover, Tooltip } from '@youknown/react-ui/src'
import { cls, omit } from '@youknown/utils/src'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiSolidChevronDown } from 'react-icons/bi'
import { RiMarkPenLine } from 'react-icons/ri'

import { ButtonProps, UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

interface HighlightPickerProps extends ButtonProps, ComponentProps<typeof Popover> {}
export default function HighlightPicker(props: HighlightPickerProps) {
  const { editor, tooltip = true, trigger = 'click', ...rest } = omit(props, 'defaultOpen', 'open', 'onOpenChange')
  const { t } = useTranslation()
  const options = [
    '#ffffff',
    '#cccccc',
    '#999999',
    '#666666',
    '#333333',
    '#000000',
    '#ffa8a8',
    '#ffd800',
    '#faf594',
    '#a2ddb8',
    '#40a9ff',
    '#b197fc',
    '#d83931',
    '#de7802',
    '#dc9b04',
    '#21a121',
    '#245bdb',
    '#6425d0'
  ]
  const [inkColor, setInkColor] = useState('#faf594')
  const [open, onOpenChange] = useControllable(props, {
    defaultValue: false,
    defaultValuePropName: 'defaultOpen',
    valuePropName: 'open',
    trigger: 'onOpenChange'
  })

  const hasActive = options.some(opt => editor.isActive('highlight', { color: opt }))

  const select = (opt: string) => {
    setInkColor(opt)
    editor.chain().focus().setHighlight({ color: opt }).run()
  }

  const highlightDisabled = !editor.can().toggleHighlight()
  const prefixCls = `${UI_EDITOR_PREFIX}-highlight-picker`

  const popContentEle = (
    <div className={`${prefixCls}-popup`}>
      <Button style={{ width: '100%' }} onClick={() => editor.chain().focus().unsetHighlight().run()}>
        {t('react_rte.no_bg')}
      </Button>
      <Divider />
      <div className={`${prefixCls}-colors-wrapper`}>
        {options.map(opt => {
          return (
            <div
              key={opt}
              className={cls(`${prefixCls}-color-item`, {
                active: editor.isActive('highlight', { color: opt })
              })}
              onClick={() => select(opt)}
              style={{ backgroundColor: opt }}
            ></div>
          )
        })}
      </div>
    </div>
  )

  return (
    <Tooltip disabled={!tooltip} placement="bottom" title={t('react_rte.mark')}>
      <div className={prefixCls}>
        <CommandBtn
          className={cls(`${prefixCls}-setter`)}
          tooltipDisabled
          active={hasActive}
          disabled={highlightDisabled}
          onCommand={() => {
            editor.chain().focus().toggleHighlight({ color: inkColor }).run()
          }}
        >
          <RiMarkPenLine size={15} />
          <div className={`${prefixCls}-line`} style={{ backgroundColor: inkColor }}></div>
        </CommandBtn>

        <Popover
          disabled={highlightDisabled}
          trigger={trigger}
          open={open}
          onOpenChange={onOpenChange}
          placement="bottom-start"
          crossOffset={-26}
          content={popContentEle}
          {...rest}
        >
          <button
            className={cls(`${prefixCls}-arrow-btn`, {
              active: open,
              disabled: highlightDisabled
            })}
            onClick={() => {
              if (trigger === 'manual') {
                onOpenChange?.(!open)
              }
            }}
          >
            <BiSolidChevronDown />
          </button>
        </Popover>
      </div>
    </Tooltip>
  )
}
