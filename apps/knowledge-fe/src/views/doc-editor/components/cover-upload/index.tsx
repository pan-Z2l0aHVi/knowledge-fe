import { useBoolean } from '@youknown/react-hook/src'
import { Button, Image, Loading, Space, Toast, Upload } from '@youknown/react-ui/src'
import type { ComponentProps } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiTrashSimpleBold } from 'react-icons/pi'
import { TbPhotoEdit, TbPhotoPlus } from 'react-icons/tb'

import type { Doc } from '@/apis/doc'
import { update_doc } from '@/apis/doc'
import { IMAGE_ACCEPT } from '@/consts'
import { useUIStore } from '@/stores'
import { upload_cloudflare_r2 } from '@/utils/cloudflare-r2'
import { with_api } from '@/utils/request'

type UploadFiles = ComponentProps<typeof Upload>['value']
interface CoverUploadProps {
  doc_id: string
  on_updated: (doc: Doc) => void
  cover?: string
}
export default function CoverUpload(props: CoverUploadProps) {
  const { cover = '', doc_id, on_updated } = props
  const { t } = useTranslation()
  const is_mobile = useUIStore(state => state.is_mobile)
  const [file_list, set_file_list] = useState<UploadFiles>([])
  const [updating, { setTrue: start_updating, setFalse: stop_updating }] = useBoolean(false)
  const save_doc_cover = async (cover_url: string) => {
    const [err, res] = await with_api(update_doc)({
      doc_id,
      cover: cover_url
    })
    if (err) {
      return
    }
    on_updated(res)
  }

  const upload_cover = (file: File) =>
    new Promise<string>(async (resolve, reject) => {
      Image.crop({
        file,
        title: t('heading.cover'),
        initialAspectRatio: 16 / 9,
        onCancel: () => {
          set_file_list([])
          reject('Crop cancel')
        },
        async onCrop(result) {
          start_updating()
          try {
            const { compressImage } = await import('@youknown/img-wasm/src')
            const compressed_file = await compressImage(result, 1600, 1200)
            upload_cloudflare_r2(compressed_file, {
              complete(url) {
                save_doc_cover(url).finally(() => {
                  stop_updating()
                  resolve(url)
                })
              },
              error(err) {
                Toast.error(t('upload.img.fail'))
                stop_updating()
                reject(err)
              }
            })
          } catch (err) {
            Toast.error(t('upload.img.fail'))
            stop_updating()
            reject(err)
          }
        }
      })
    })

  const preview_cover = file_list?.[file_list.length - 1]?.previewURL ?? ''
  const upload_ref = useRef<HTMLInputElement>(null)
  const final_cover = preview_cover || cover

  return (
    <Loading className="w-100%!" spinning={updating}>
      {final_cover ? (
        <div className="group relative">
          <Image
            className="w-100% max-h-30vh min-h-80px b-1 b-solid b-divider rd-radius-m"
            src={final_cover}
            previewSrc={final_cover}
            canPreview
            alt="Cover"
          />
          <Space className="[@media(hover:hover)]-group-hover-display-flex! sm:display-none! absolute right-16px bottom-16px">
            <Upload
              accept={IMAGE_ACCEPT}
              ref={upload_ref}
              headless
              action={upload_cover}
              value={file_list}
              onChange={set_file_list}
            >
              <Button
                round={is_mobile}
                prefixIcon={<TbPhotoEdit className="text-16px color-primary" />}
                onClick={() => {
                  upload_ref.current?.click()
                }}
              >
                {t('cover.change')}
              </Button>
            </Upload>

            <Button
              round={is_mobile}
              prefixIcon={<PiTrashSimpleBold className="text-16px color-danger" />}
              onClick={() => {
                save_doc_cover('')
              }}
            >
              <span className="color-danger">{t('cover.remove')}</span>
            </Button>
          </Space>
        </div>
      ) : (
        <Upload accept={IMAGE_ACCEPT} headless action={upload_cover} value={file_list} onChange={set_file_list}>
          <div className="flex items-center w-max p-[4px_12px] bg-bg-2 rd-full color-text-2 [@media(hover:hover)]-hover-color-primary">
            <TbPhotoPlus className="mr-8px text-16px" />
            {t('cover.add')}
          </div>
        </Upload>
      )}
    </Loading>
  )
}
