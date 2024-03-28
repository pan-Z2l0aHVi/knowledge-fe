import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbExternalLink } from 'react-icons/tb'

import type { ButtonProps } from '../../../../../../common'
import { UI_EDITOR_PREFIX } from '../../../../../../common'
import CommandBtn from '../../../../../command-btn'

export default function LinkOpenBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-link-open-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.link.open')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      disabled={!editor.isActive('link')}
      onCommand={() => {
        const href = editor.getAttributes('link').href
        if (href) window.open(href)
      }}
    >
      <TbExternalLink />
    </CommandBtn>
  )
}
