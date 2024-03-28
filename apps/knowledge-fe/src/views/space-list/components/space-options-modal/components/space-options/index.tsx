import { useFetch } from '@youknown/react-hook/src'
import { Button, Form, Input, Loading, Space } from '@youknown/react-ui/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { get_space_info } from '@/apis/space'
import { validate_max_length, validate_required } from '@/utils/validators'

const SPACE_NAME_MAX_LEN = 30
const SPACE_DESC_MAX_LEN = 120

interface SpaceOptionsProps {
  hide_modal: () => void
  space_id?: string
  on_save: (name: string, desc: string) => Promise<void>
}
export default function SpaceOptions(props: SpaceOptionsProps) {
  const { hide_modal, space_id, on_save } = props
  const is_edit = !!space_id
  const { t } = useTranslation()
  const [saving, set_saving] = useState(false)
  const form = Form.useForm({
    defaultState: {
      name: '',
      desc: ''
    },
    async onFulfilled(state) {
      set_saving(true)
      await on_save(state.name, state.desc)
      set_saving(false)
    }
  })
  const { loading } = useFetch(get_space_info, {
    ready: is_edit,
    params: [{ space_id: space_id! }],
    onSuccess(data) {
      form.setState({
        name: data.name,
        desc: data.desc
      })
    }
  })

  return (
    <Loading className="w-100%!" spinning={loading}>
      <Form className="sm:p-[24px_24px_0_24px] <sm:p-[16px_16px_0_16px]" form={form} labelWidth={104}>
        <Form.Field
          label="name"
          labelText={t('space.name')}
          validators={[validate_required(), validate_max_length(SPACE_NAME_MAX_LEN)]}
        >
          <Input className="w-100%!" placeholder={t('placeholder.input')} />
        </Form.Field>
        <Form.Field
          label="desc"
          labelText={t('introduction')}
          validators={[validate_required(), validate_max_length(SPACE_DESC_MAX_LEN)]}
        >
          <Input.Textarea className="w-100%!" autosize maxRows={4} placeholder={t('placeholder.input')} />
        </Form.Field>
        <Form.Field className="mb-0! <sm:relative" labelText=" ">
          <Space className="<sm:absolute <sm:right-0">
            <Button className="min-w-80px" onClick={hide_modal}>
              {t('cancel.text')}
            </Button>
            <Button className="min-w-80px" type="submit" primary loading={saving}>
              {is_edit ? t('save.text') : t('create.text')}
            </Button>
          </Space>
        </Form.Field>
      </Form>
    </Loading>
  )
}
