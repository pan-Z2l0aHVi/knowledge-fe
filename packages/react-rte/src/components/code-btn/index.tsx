import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { HiCode } from 'react-icons/hi'

import type { ButtonProps } from '../../common'
import { UI_EDITOR_PREFIX } from '../../common'
import CommandBtn from '../command-btn'

export default function CodeBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-code-btn`
  return (
    <CommandBtn
      className={cls(prefixCls)}
      tooltip={t('react_rte.code')}
      tooltipDisabled={!tooltip}
      active={editor.isActive('code')}
      disabled={!editor.can().toggleCode()}
      onCommand={() => {
        editor.chain().focus().toggleCode().run()
      }}
    >
      <HiCode />
    </CommandBtn>
  )
}
