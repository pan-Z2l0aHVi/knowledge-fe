import './index.scss'

import { useBoolean } from '@youknown/react-hook/src'
import { Divider, Dropdown } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { createElement, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HiPlusSm } from 'react-icons/hi'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export type insertListItem =
  | '-' // divider
  | 'blockquote'
  | 'image'
  | 'table'
  | 'bulletList'
  | 'orderedList'
  | 'codeBlock'
  | 'horizontalRule'
interface InsertPickerProps extends ButtonProps {
  list?: insertListItem[]
}
export default function InsertPicker(props: InsertPickerProps) {
  const { editor, tooltip = true, list } = props
  const { t } = useTranslation()
  const [open, { setBool: setOpen }] = useBoolean(false)

  const optionList = useMemo(() => {
    const defaultList = [
      'image',
      'table',
      '-',
      'blockquote',
      'codeBlock',
      'horizontalRule',
      '-',
      'bulletList',
      'orderedList'
    ]
    return list ?? defaultList
  }, [list])

  const extensions = editor.extensionManager.extensions.filter(ext => ext.options.insert)
  const ele = optionList.map((opt, index) => {
    if (opt === '-') {
      return <Divider key={index} size="small" />
    }
    const extension = extensions.find(ext => ext.name === opt)
    if (extension) {
      const { insert, onCustomUpload } = extension.options
      const basicProps = {
        key: extension.name,
        editor,
        extension
      }
      if (extension.name === 'image') {
        return createElement(insert, {
          ...basicProps,
          onCustomUpload
        })
      }
      return createElement(insert, basicProps)
    }
    return null
  })

  const prefixCls = `${UI_EDITOR_PREFIX}-insert-picker`
  return optionList.length > 0 ? (
    <Dropdown
      trigger="click"
      onOpenChange={setOpen}
      content={<Dropdown.Menu className={`${prefixCls}-dropdown`}>{ele}</Dropdown.Menu>}
    >
      <CommandBtn
        className={cls(`${prefixCls}-label`)}
        tooltip={t('react_rte.insert')}
        tooltipDisabled={!tooltip}
        arrow
        active={open}
      >
        <div className={`${prefixCls}-icon`}>
          <HiPlusSm color="#fff" size={18} />
        </div>
      </CommandBtn>
    </Dropdown>
  ) : null
}
