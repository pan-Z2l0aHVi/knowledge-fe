import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { RiDoubleQuotesL } from 'react-icons/ri'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function BlockquoteBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-blockquote-btn`
  return (
    <CommandBtn
      className={cls(prefixCls)}
      tooltip={t('react_rte.blockquote')}
      tooltipDisabled={!tooltip}
      active={editor.isActive('blockquote')}
      disabled={!editor.can().toggleBlockquote()}
      onCommand={() => {
        editor.chain().focus().toggleBlockquote().run()
      }}
    >
      <RiDoubleQuotesL />
    </CommandBtn>
  )
}
