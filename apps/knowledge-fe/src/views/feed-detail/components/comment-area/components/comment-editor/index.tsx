import { RTEMenuBar } from '@youknown/react-rte/src/components/menu-bar'
import { RTEContent } from '@youknown/react-rte/src/components/rich-text-content'
import Blockquote from '@youknown/react-rte/src/extensions/blockquote'
import Bold from '@youknown/react-rte/src/extensions/bold'
import Code from '@youknown/react-rte/src/extensions/code'
import CodeBlock from '@youknown/react-rte/src/extensions/code-block'
import Image from '@youknown/react-rte/src/extensions/image'
import Italic from '@youknown/react-rte/src/extensions/italic'
import Link from '@youknown/react-rte/src/extensions/link'
import Strike from '@youknown/react-rte/src/extensions/strike'
import { useRTE } from '@youknown/react-rte/src/hooks/useRTE'
import { Avatar, Button, Image as ImageUI, Space, Toast } from '@youknown/react-ui/src'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useModalStore, useUIStore, useUserStore } from '@/stores'
import { upload_cloudflare_r2 } from '@/utils/cloudflare-r2'

interface CommentEditorProps {
  auto_focus?: boolean
  send_loading?: boolean
  placeholder?: string
  btnText?: ReactNode
  avatar_visible?: boolean
  value: string
  on_change: (value: string) => void
  on_send: (value: string) => void
  on_cancel?: () => void
}

export default function CommentEditor(props: CommentEditorProps) {
  const {
    send_loading = false,
    auto_focus = false,
    avatar_visible = false,
    placeholder = '',
    btnText,
    value,
    on_change,
    on_send,
    on_cancel
  } = props

  const { t } = useTranslation()
  const is_mobile = useUIStore(state => state.is_mobile)
  const profile = useUserStore(state => state.profile)
  const has_login = useUserStore(state => state.has_login)
  const open_login_modal = useModalStore(state => state.open_login_modal)

  const editor = useRTE({
    extensions: [
      Bold,
      Italic,
      Strike,
      Code,
      Link,
      Blockquote,
      CodeBlock,
      Image.configure({
        onCustomUpload: file =>
          new Promise((resolve, reject) => {
            ImageUI.crop({
              file,
              onCancel: reject,
              async onCrop(result) {
                try {
                  const { compressImage } = await import('@youknown/img-wasm/src')
                  const compressed_file = await compressImage(result, 1600, 1200)
                  upload_cloudflare_r2(compressed_file, {
                    complete(url) {
                      resolve({
                        src: url
                      })
                    },
                    error(err) {
                      Toast.error(t('upload.img.fail'))
                      reject(err)
                    }
                  })
                } catch (err) {
                  Toast.error(t('upload.img.fail'))
                  reject(err)
                }
              }
            })
          })
      })
    ],
    autofocus: auto_focus ? 'end' : false,
    placeholder: () => placeholder,
    content: value,
    onUpdate({ editor }) {
      on_change(editor.getHTML())
    }
  })

  const handle_send = () => {
    on_send(value)
    on_change('')
    editor?.commands.clearContent()
  }

  useEffect(() => {
    editor?.setEditable(!send_loading)
  }, [editor, send_loading])

  if (!editor) return null

  return (
    <div className="flex items-start mt-8px mb-16px">
      {has_login ? (
        <>
          {avatar_visible && <Avatar className="mr-16px" size={32} round src={profile?.avatar} />}
          <div className="flex-1 pt-8px b-1 b-solid b-divider rd-radius-m">
            {is_mobile || (
              <div className="pl-8px pr-8px">
                <RTEMenuBar
                  editor={editor}
                  list={['|', 'heading', 'bold', 'italic', 'strike', 'code', '|', 'link']}
                  insertList={['image', 'blockquote', 'codeBlock']}
                />
              </div>
            )}
            <RTEContent
              className="comment-rich-text-reset text-14px"
              editor={editor}
              bubble={!is_mobile}
              bubbleList={['bold', 'italic', 'underline', 'strike', 'code', 'link']}
              floating={false}
            />
            <div className="flex justify-end pb-12px pr-12px">
              <Space>
                {on_cancel && (
                  <Button text round onClick={on_cancel}>
                    <span className="color-text-2">{t('cancel.text')}</span>
                  </Button>
                )}
                <Button primary round disabled={editor.isEmpty} loading={send_loading} onClick={handle_send}>
                  {btnText}
                </Button>
              </Space>
            </div>
          </div>
        </>
      ) : (
        <div
          className="flex-1 h-120px flex items-center justify-center bg-bg-2 color-text-3 rd-radius-m cursor-pointer"
          onClick={open_login_modal}
        >
          <span className="color-primary mr-4px">{t('login.text')}</span>
          {t('comment.then_join')}
        </div>
      )}
    </div>
  )
}
