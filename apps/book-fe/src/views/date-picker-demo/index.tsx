import { useTranslation } from 'react-i18next'

import Demo from '@/app/components/demo'

import DatePickerMDX from './date-picker.mdx'

export default function DatePickerDemo() {
  const { t } = useTranslation()

  return <Demo heading={t('page.title.date_picker')} component={DatePickerMDX} />
}
