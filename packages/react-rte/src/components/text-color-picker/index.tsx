import './index.scss'

import { useControllable } from '@youknown/react-hook/src'
import { Button, Divider, Popover, Tooltip } from '@youknown/react-ui/src'
import { cls, omit } from '@youknown/utils/src'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiFont, BiSolidChevronDown } from 'react-icons/bi'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

interface TextColorPickerProps extends ButtonProps, ComponentProps<typeof Popover> {}
export default function TextColorPicker(props: TextColorPickerProps) {
  const { editor, tooltip = true, trigger = 'click', ...rest } = omit(props, 'defaultOpen', 'open', 'onOpenChange')
  const { t } = useTranslation()
  const DEFAULT_COLOR = 'var(--ui-text-1)'
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

  const [inkColor, setInkColor] = useState(DEFAULT_COLOR)
  const [open, onOpenChange] = useControllable(props, {
    defaultValue: false,
    defaultValuePropName: 'defaultOpen',
    valuePropName: 'open',
    trigger: 'onOpenChange'
  })

  const hasActive = options.some(opt => editor.isActive('textStyle', { color: opt }))

  const handleSelect = (opt: string) => {
    setInkColor(opt)
    editor.chain().focus().setColor(opt).run()
  }

  const handleReset = () => {
    setInkColor(DEFAULT_COLOR)
    editor.chain().focus().setColor(DEFAULT_COLOR).run()
  }

  const setColorDisabled = !editor.can().setColor(inkColor)
  const prefixCls = `${UI_EDITOR_PREFIX}-text-color-picker`

  const contentEle = (
    <div
      className={`${prefixCls}-popup`}
      // onClick={event => {
      // 	event.stopPropagation()
      // }}
    >
      <Button style={{ width: '100%' }} onClick={handleReset}>
        {t('react_rte.restore')}
      </Button>
      <Divider />
      <div className={`${prefixCls}-wrapper`}>
        {options.map(opt => {
          return (
            <div
              key={opt}
              className={cls(`${prefixCls}-item`, {
                active: editor.isActive('textStyle', { color: opt })
              })}
              onClick={() => {
                handleSelect(opt)
              }}
              style={{ backgroundColor: opt }}
            ></div>
          )
        })}
      </div>
    </div>
  )

  return (
    <Tooltip disabled={!tooltip} placement="bottom" title={t('react_rte.text_color')}>
      <div className={prefixCls}>
        <CommandBtn
          className={cls(`${prefixCls}-setter`)}
          tooltipDisabled
          active={hasActive}
          disabled={setColorDisabled}
          onCommand={() => {
            editor.chain().focus().setColor(inkColor).run()
          }}
        >
          <BiFont size={15} />
          <div className={`${prefixCls}-line`} style={{ backgroundColor: inkColor }}></div>
        </CommandBtn>

        <Popover
          disabled={setColorDisabled}
          trigger={trigger}
          open={open}
          onOpenChange={onOpenChange}
          placement="bottom-start"
          crossOffset={-26}
          content={contentEle}
          {...rest}
        >
          <button
            className={cls(`${prefixCls}-arrow-btn`, {
              active: open,
              disabled: setColorDisabled
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
