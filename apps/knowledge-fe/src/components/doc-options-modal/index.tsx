import { useBoolean, useFetch, useUpdate } from '@youknown/react-hook/src'
import { Button, CloseIcon, Dialog, Form, Input, Loading, Radio, Space, Toast } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Doc } from '@/apis/doc'
import { get_doc_info, update_doc } from '@/apis/doc'
import PicUpload from '@/components/pic-upload'
import { DOC_TITLE_MAX_LEN } from '@/consts'
import { is_dark_theme_getter, useUIStore } from '@/stores'
import { with_api } from '@/utils/request'
import { validate_max_length, validate_required } from '@/utils/validators'

interface DocOptionsModalProps {
  open: boolean
  doc_info: Doc
  hide_modal: () => void
  on_updated?: (doc: Doc) => void
}

export default function DocOptionsModal(props: DocOptionsModalProps) {
  const { open, hide_modal, doc_info, on_updated } = props
  const { doc_id } = doc_info
  const { t } = useTranslation()
  const is_dark_theme = useUIStore(is_dark_theme_getter)
  const [cover_uploading, set_cover_uploading] = useState(false)
  const [save_loading, { setTrue: show_save_loading, setFalse: hide_save_loading }] = useBoolean(false)

  const save_doc = async () => {
    const state = form.getState()
    show_save_loading()
    const [err, res] = await with_api(update_doc)({
      doc_id,
      title: state.title,
      cover: state.cover,
      public: !!state.is_publish
    })
    hide_save_loading()
    if (err) {
      return
    }
    Toast.success(t('save.success'))
    on_updated?.(res)
    hide_modal()
  }

  const update = useUpdate()
  const form = Form.useForm({
    defaultState: {
      title: '',
      cover: '',
      is_publish: 0
    },
    onStateChange(org) {
      const state = form.getState()
      console.log('org: ', org, state[org.label])
      switch (org.label) {
        case 'cover':
          break

        case 'is_publish':
          update()
          break

        default:
          break
      }
    },
    onFulfilled({ is_publish }) {
      if (doc_info.public && !is_publish) {
        Dialog.confirm({
          title: t('heading.delete_feed'),
          content: t('feed.delete_tip'),
          overlayClassName: cls(
            'backdrop-blur-xl',
            is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
          ),
          okDanger: true,
          okText: t('confirm'),
          cancelText: t('cancel.text'),
          closeIcon: null,
          onOk: () => {
            save_doc()
          }
        })
      } else {
        save_doc()
      }
    }
  })

  const { loading: initial_loading } = useFetch(get_doc_info, {
    params: [{ doc_id }],
    ready: open,
    onSuccess(data) {
      form.setState({
        title: data.title,
        cover: data.cover,
        is_publish: data.public ? 1 : 0
      })
    }
  })

  const form_ele = (
    <Form className="sm:p-[24px_24px_0_24px] <sm:p-[16px_16px_0_16px]" form={form} labelWidth={120}>
      <Form.Field
        label="cover"
        labelText={t('form.cover')}
        validators={[
          async cover => {
            if (form.getState().is_publish && !cover) {
              return Promise.reject(t('validate.cover_required'))
            }
          }
        ]}
      >
        <PicUpload uploading={cover_uploading} set_uploading={set_cover_uploading} />
      </Form.Field>
      <Form.Field
        label="title"
        labelText={t('form.title')}
        validators={[validate_required(), validate_max_length(DOC_TITLE_MAX_LEN)]}
      >
        <Input className="sm:w-280px! <sm:w-100%!" />
      </Form.Field>
      <Form.Field label="is_publish" labelText={t('form.feed_setting')}>
        <Radio.Group
          options={[
            {
              label: 0,
              child: t('form.private')
            },
            {
              label: 1,
              child: t('form.public')
            }
          ]}
        />
      </Form.Field>
      <Form.Field labelText=" " className="<sm:relative mb-0!">
        <Space className="<sm:absolute <sm:right-0">
          <Button className="min-w-80px" onClick={hide_modal}>
            {t('cancel.text')}
          </Button>
          <Button className="min-w-80px" disabled={cover_uploading} loading={save_loading} type="submit" primary>
            {t('save.text')}
          </Button>
        </Space>
      </Form.Field>
    </Form>
  )

  return (
    <Dialog
      className="!w-480px"
      overlayClassName={cls(
        'backdrop-blur-xl',
        is_dark_theme ? '!bg-[rgba(0,0,0,0.2)]' : '!bg-[rgba(255,255,255,0.2)]'
      )}
      open={open}
      onCancel={hide_modal}
      unmountOnExit
      header={
        <div className="flex justify-between sm:p-[24px_24px_0] <sm:p-[16px_16px_0]">
          <span className="text-16px font-500">{t('heading.doc_setting')}</span>
          <CloseIcon onClick={hide_modal} />
        </div>
      }
      footer="" // 底部占位，不让 Loading 覆盖
      closeIcon={null}
    >
      <Loading className="w-100%!" spinning={initial_loading}>
        {form_ele}
      </Loading>
    </Dialog>
  )
}
