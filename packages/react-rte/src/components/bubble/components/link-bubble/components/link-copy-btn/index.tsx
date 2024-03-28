import './index.scss'

import { Toast } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import copy from 'copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { TbCopy } from 'react-icons/tb'

import type { ButtonProps } from '../../../../../../common'
import { UI_EDITOR_PREFIX } from '../../../../../../common'
import CommandBtn from '../../../../../command-btn'

export default function LinkCopyBtn(props: ButtonProps) {
  const { editor, tooltip = true } = props
  const { t } = useTranslation()
  const prefixCls = `${UI_EDITOR_PREFIX}-link-copy-btn`
  return (
    <CommandBtn
      tooltip={t('react_rte.link.copy')}
      tooltipDisabled={!tooltip}
      className={cls(prefixCls)}
      disabled={!editor.isActive('link')}
      onCommand={() => {
        const href = editor.getAttributes('link').href
        if (href) {
          copy(href)
          Toast.success(t('react_rte.link.copy_success'))
        }
      }}
    >
      <TbCopy />
    </CommandBtn>
  )
}
