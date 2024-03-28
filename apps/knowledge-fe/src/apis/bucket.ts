import { net } from '@/utils/request'

export const get_qiniu_token = () =>
  net.fetch<{
    token: string
  }>('/proxy/common/qiniu_token')

export interface GetR2SignedURLParams {
  key: string
}
export const get_r2_signed_url = (params: GetR2SignedURLParams) =>
  net.fetch<{
    url: string
  }>('/proxy/common/r2_signed_url', {
    params
  })
