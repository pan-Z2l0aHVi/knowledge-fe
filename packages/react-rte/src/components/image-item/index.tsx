import './index.scss'

import type { Editor } from '@tiptap/react'
import { Dropdown } from '@youknown/react-ui/src'
import { cls } from '@youknown/utils/src'
import { useTranslation } from 'react-i18next'
import { TbPhotoPlus } from 'react-icons/tb'

import { UI_EDITOR_PREFIX } from '../../common'

interface UploadResult {
  src: string
  alt?: string
  title?: string
  width?: number
  height?: number
}
interface ImageItemProps {
  editor: Editor
  onCustomUpload?: (file: File) => Promise<UploadResult>
}
export default function ImageItem(props: ImageItemProps) {
  const { editor, onCustomUpload } = props

  const { t } = useTranslation()

  const handleFiles = async (input: HTMLInputElement) => {
    const { files } = input
    if (!files || !files.length) {
      return
    }
    Dropdown.close()
    if (!onCustomUpload) {
      return
    }
    for await (const file of files) {
      try {
        const imgRes = await onCustomUpload(file)
        editor.chain().focus().setImage(imgRes).setTextSelection(editor.state.selection.to).run()
      } catch (error) {
        console.error('onCustomUpload error: ', error)
      }
    }
  }

  const prefixCls = `${UI_EDITOR_PREFIX}-img-item`
  return (
    <Dropdown.Item
      prefix={
        <div className={cls(prefixCls)}>
          <TbPhotoPlus />
        </div>
      }
      onClick={() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = true
        input.accept = 'image/*'
        input.onchange = () => {
          handleFiles(input)
        }
        input.click()
      }}
    >
      {t('react_rte.image.text')}
    </Dropdown.Item>
  )
}
