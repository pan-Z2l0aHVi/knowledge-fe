import { net } from '@/utils/request'

export interface Material {
  material_id: string
  type: number
  content: string
  name: string
  uploader_id: string
}

export interface MaterialSearchParams {
  page: number
  page_size: number
  type: number
  keywords: string
}
export const search_material = (params: MaterialSearchParams) =>
  net.fetch<{
    total: number
    list: Material[]
  }>('/proxy/material/search', {
    params
  })

export interface GetMaterialInfoParams {
  material_id: string
}
export const get_material_info = (params: GetMaterialInfoParams) =>
  net.fetch<Material>('/proxy/material/info', {
    params
  })

export interface UploadMaterialPayload {
  type: number
  url: string
}
export const upload_material = (payload: UploadMaterialPayload) =>
  net.fetch<Material>('/proxy/material/upload', {
    payload
  })
