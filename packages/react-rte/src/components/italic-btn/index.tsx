import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { PiTextItalicBold } from 'react-icons/pi'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function ItalicBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-italic-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.italic')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      active={editor.isActive('italic')}
      disabled={!editor.can().toggleItalic()}
      onCommand={() => {
        editor.chain().focus().toggleItalic().run()
      }}
    >
      <PiTextItalicBold />
    </CommandBtn>
  )
}
