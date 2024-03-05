import { useTranslation } from 'react-i18next'

import Header from '@/app/components/header'
import { components } from '@/utils/mdx-components'

import UploadMDX from './upload.mdx'

export default function UploadDemo() {
	const { t } = useTranslation()

	return (
		<>
			<Header heading={t('page.title.upload')}></Header>

			<div className="rich-text-container sm:p-32px <sm:p-16px! sm:m-[0_auto] sm:w-800px">
				<UploadMDX components={components} />
			</div>
		</>
	)
}