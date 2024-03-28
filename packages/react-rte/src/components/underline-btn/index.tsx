import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { PiTextUnderlineBold } from 'react-icons/pi'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function UnderlineBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-underline-btn`
  return (
    <CommandBtn
      className={cls(prefixCls)}
      tooltip={t('react_rte.underline')}
      tooltipDisabled={!tooltip}
      active={editor.isActive('underline')}
      disabled={!editor.can().toggleUnderline()}
      onCommand={() => {
        editor.chain().focus().toggleUnderline().run()
      }}
    >
      <PiTextUnderlineBold />
    </CommandBtn>
  )
}
