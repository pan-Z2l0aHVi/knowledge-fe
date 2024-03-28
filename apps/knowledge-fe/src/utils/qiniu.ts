import { storage } from '@youknown/utils/src'
import type { QiniuError, QiniuNetworkError, QiniuRequestError } from 'qiniu-js'
import type { UploadProgress } from 'qiniu-js/esm/upload'

import { get_qiniu_token } from '@/apis/bucket'

import { with_api } from './request'
const QINIU_TOKEN_KEY = 'qiniu_token'

interface Options {
  progress?(progress: UploadProgress): void
  complete?(url: string): void
  error?(err: QiniuError | QiniuRequestError | QiniuNetworkError): void
}

async function refresh_token() {
  const [err, res] = await with_api(get_qiniu_token)()
  if (err) {
    return refresh_token()
  }
  const token = res.token
  storage.session.set(QINIU_TOKEN_KEY, token)
  return token
}

export async function upload_qiniu(file: File, options?: Options) {
  let token = storage.session.get<string>(QINIU_TOKEN_KEY)
  if (!token) {
    token = await refresh_token()
  }
  const qiniu = await import('qiniu-js')
  const observable = qiniu.upload(
    file,
    null,
    token,
    {},
    {
      useCdnDomain: true
    }
  )
  observable.subscribe({
    next(res) {
      console.log('qiniu sdk next res: ', res)
      options?.progress?.(res)
    },
    complete(res) {
      console.log('qiniu sdk complete res: ', res)
      const url = `${import.meta.env.VITE_CDN_BASE_URL}/${res.hash}`
      options?.complete?.(url)
    },
    error(err) {
      console.error('qiniu sdk error err: ', err)
      if (err.name) {
        storage.session.remove(QINIU_TOKEN_KEY)
        upload_qiniu(file, options)
        return
      }
      options?.error?.(err)
    }
  })
}
