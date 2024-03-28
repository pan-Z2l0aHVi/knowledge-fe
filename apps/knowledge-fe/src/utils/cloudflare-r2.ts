import { uuid } from '@youknown/utils/src'

import { get_r2_signed_url } from '@/apis/bucket'

import { with_api } from './request'

interface UploadProgress {
  loaded: number
  total: number
  percent: number
}
interface Options {
  progress?(progress: UploadProgress): void
  complete?(url: string): void
  error?(err: any): void
}
export async function upload_cloudflare_r2(file: File, options?: Options) {
  const id = uuid()
  const key = `${id}/${file.name}`

  const [err, res] = await with_api(get_r2_signed_url)({ key })
  if (err) {
    options?.error?.(err)
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.open('PUT', res.url, true)
  xhr.setRequestHeader('Content-Type', file.type)
  xhr.upload.addEventListener('progress', event => {
    if (event.lengthComputable) {
      options?.progress?.({
        loaded: event.loaded,
        total: event.total,
        percent: (event.loaded / event.total) * 100
      })
    }
  })
  xhr.onload = () => {
    if (xhr.status === 200) {
      const r2_url = `${import.meta.env.VITE_CDN_BASE_URL}/${key}`
      options?.complete?.(r2_url)
    } else {
      options?.error?.(xhr.statusText)
    }
  }
  xhr.onerror = err => {
    options?.error?.(err)
  }
  xhr.send(file)
}
