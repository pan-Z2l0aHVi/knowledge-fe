import './index.scss'

import { useControllable } from '@youknown/react-hook/src'
import { Button, Input, Popover, Space } from '@youknown/react-ui/src'
import { cls, omit } from '@youknown/utils/src'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiEditAlt } from 'react-icons/bi'
import { TbLink } from 'react-icons/tb'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

interface LinkPickerProps extends ButtonProps, ComponentProps<typeof Popover> {
  isEdit?: boolean
}
export default function LinkPicker(props: LinkPickerProps) {
  const {
    editor,
    tooltip = true,
    isEdit = false,
    trigger = 'click',
    ...rest
  } = omit(props, 'defaultOpen', 'open', 'onOpenChange')

  const { t } = useTranslation()
  const [href, setHref] = useState('')
  const [open, onOpenChange] = useControllable(props, {
    defaultValue: false,
    defaultValuePropName: 'defaultOpen',
    valuePropName: 'open',
    trigger: 'onOpenChange'
  })

  const saveLinkHref = () => {
    editor.chain().focus().setLink({ href }).run()
    onOpenChange?.(false)
  }
  const disabled = !editor.can().toggleLink({ href: '' })

  const prefixCls = `${UI_EDITOR_PREFIX}-link-picker`
  const linkPopup = (
    <Space size="small">
      <Input
        className={cls(`${prefixCls}-href-input`)}
        bordered={false}
        autoFocus
        placeholder={t('react_rte.placeholder.link')}
        value={href}
        onChange={setHref}
        onEnter={saveLinkHref}
        onClick={event => {
          event.stopPropagation()
        }}
      />
      <Button primary onClick={saveLinkHref}>
        {t('react_rte.ok')}
      </Button>
    </Space>
  )

  return (
    <Popover
      placement="bottom"
      disabled={disabled}
      content={linkPopup}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      {...rest}
    >
      <CommandBtn
        className={cls(prefixCls)}
        arrow
        tooltip={isEdit ? t('react_rte.link.edit') : t('react_rte.link.text')}
        tooltipDisabled={!tooltip}
        active={open}
        disabled={disabled}
        onCommand={() => {
          if (trigger === 'manual') {
            onOpenChange?.(!open)
          }
          const selectedLink: string = editor.getAttributes('link').href ?? ''
          setHref(selectedLink)
        }}
      >
        {isEdit ? <BiEditAlt /> : <TbLink />}
      </CommandBtn>
    </Popover>
  )
}
