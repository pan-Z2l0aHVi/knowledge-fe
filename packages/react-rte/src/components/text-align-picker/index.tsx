import './index.scss'

import { Popover, Tooltip } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlignCenter, TbAlignJustified, TbAlignLeft, TbAlignRight } from 'react-icons/tb'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function TextAlignPicker(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  interface Option {
    value: string
    label: string
    icon: ReactElement
  }
  const options: Option[] = [
    {
      value: 'left',
      label: t('react_rte.align.left'),
      icon: <TbAlignLeft />
    },
    {
      value: 'center',
      label: t('react_rte.align.center'),
      icon: <TbAlignCenter />
    },
    {
      value: 'right',
      label: t('react_rte.align.right'),
      icon: <TbAlignRight />
    },
    {
      value: 'justify',
      label: t('react_rte.align.justify'),
      icon: <TbAlignJustified />
    }
  ]

  let selection = options[0]
  for (const opt of options) {
    if (editor.isActive({ textAlign: opt.value })) {
      selection = opt
      break
    }
  }

  const handleSelect = (opt: Option) => {
    editor.chain().focus().setTextAlign(opt.value).run()
  }

  const textAlginDisabled = options.some(opt => !editor.can().setTextAlign(opt.value))
  const prefixCls = `${UI_EDITOR_PREFIX}-text-align-picker`

  return (
    <Popover
      disabled={textAlginDisabled}
      trigger="click"
      placement="bottom"
      content={
        <div className={`${prefixCls}-popup`}>
          {options.map(opt => {
            return (
              <Tooltip key={opt.value} placement="bottom" title={opt.label}>
                <button
                  className={cls(`${prefixCls}-icon-wrapper`, {
                    active: editor.isActive({ textAlign: opt.value }),
                    disabled: !editor.can().setTextAlign(opt.value)
                  })}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.icon}
                </button>
              </Tooltip>
            )
          })}
        </div>
      }
      onOpenChange={setOpen}
    >
      <CommandBtn
        className={cls(prefixCls)}
        tooltip={t('react_rte.align.method')}
        tooltipDisabled={!tooltip}
        active={open}
        disabled={textAlginDisabled}
        arrow
      >
        {selection.icon}
      </CommandBtn>
    </Popover>
  )
}
