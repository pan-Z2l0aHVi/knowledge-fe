import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import UploadMDX from './upload.mdx'

export default function UploadDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.upload')} component={UploadMDX} />
}
