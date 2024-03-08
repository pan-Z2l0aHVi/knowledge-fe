import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbLinkOff } from 'react-icons/tb'

import { ButtonProps, UI_EDITOR_PREFIX } from '../../../../../../common'
import CommandBtn from '../../../../../command-btn'

export default function UnLinkBtn(props: ButtonProps) {
	const { editor, tooltip = true } = props
	const { t } = useTranslation()
	const prefixCls = `${UI_EDITOR_PREFIX}-unlink-btn`
	return (
		<CommandBtn
			className={cls(prefixCls)}
			tooltip={t('react_rte.link.cancel')}
			tooltipDisabled={!tooltip}
			disabled={!editor.can().unsetLink()}
			onCommand={() => {
				editor.chain().unsetLink().focus().run()
			}}
		>
			<TbLinkOff />
		</CommandBtn>
	)
}
