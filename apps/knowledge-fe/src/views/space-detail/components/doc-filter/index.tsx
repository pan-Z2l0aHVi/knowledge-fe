import type { FormInstance } from '@youknown/react-hook/src'
import { Button, Form, Input, Select, Space } from '@youknown/react-ui/src'
import { useTranslation } from 'react-i18next'

interface DocFilterProps {
  form: FormInstance
  loading: boolean
  on_cancel: () => void
}
export default function DocFilter(props: DocFilterProps) {
  const { form, loading, on_cancel } = props
  const { t } = useTranslation()
  return (
    <div className="p-[32px_24px_32px_16px]">
      <Form form={form} labelWidth={120}>
        <Form.Field label="keywords" labelText={t('form.keywords')}>
          <Input className="<sm:w-100%!" placeholder={t('placeholder.input')} />
        </Form.Field>
        <Form.Field label="sort_by" labelText={t('form.order_by')}>
          <Select
            menuList={[
              {
                label: t('form.update_time'),
                value: 'update_time'
              },
              {
                label: t('form.creation_time'),
                value: 'creation_time'
              }
            ]}
          />
        </Form.Field>
        <Form.Field label="sort_type" labelText={t('form.order')}>
          <Select
            menuList={[
              {
                label: t('form.new'),
                value: 'desc'
              },
              {
                label: t('form.old'),
                value: 'asc'
              }
            ]}
          />
        </Form.Field>
        <Form.Field labelText=" ">
          <Space>
            <Button className="min-w-80px" onClick={on_cancel}>
              {t('cancel.text')}
            </Button>
            <Button className="min-w-80px" type="submit" primary loading={loading}>
              {t('filter.text')}
            </Button>
          </Space>
        </Form.Field>
      </Form>
    </div>
  )
}
