import './index.scss'

import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbTablePlus } from 'react-icons/tb'

import { ButtonProps, UI_EDITOR_PREFIX } from '../../../../common'
import CommandBtn from '../../../command-btn'

export default function RowAfterAddBtn(props: ButtonProps) {
	const { editor, tooltip = true } = props
	const { t } = useTranslation()
	const disabled = !editor.can().addRowAfter()
	if (disabled) {
		return null
	}
	const prefixCls = `${UI_EDITOR_PREFIX}-row-after-add-btn`
	return (
		<CommandBtn
			tooltip={t('react_rte.table.below_insert_row')}
			tooltipDisabled={!tooltip}
			className={cls(prefixCls)}
			onCommand={() => {
				editor.chain().focus().addRowAfter().run()
			}}
		>
			<TbTablePlus />
		</CommandBtn>
	)
}
