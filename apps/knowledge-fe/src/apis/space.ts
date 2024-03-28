import { net } from '@/utils/request'

export interface DocSpace {
  space_id: string
  name: string
  desc: string
}

export interface CreateSpacePayload {
  name: string
  desc: string
}
export const create_doc_space = (payload: CreateSpacePayload) =>
  net.fetch<DocSpace>('/proxy/space/create', {
    method: 'post',
    payload
  })

export interface UpdateSpacePayload {
  space_id: string
  name?: string
  desc?: string
}
export const update_doc_space = (payload: UpdateSpacePayload) =>
  net.fetch<DocSpace>('/proxy/space/update', {
    method: 'post',
    payload
  })

export interface DeleteSpacePayload {
  space_ids: string[]
}
export const delete_doc_space = (payload: DeleteSpacePayload) =>
  net.fetch<void>('/proxy/space/delete', {
    method: 'post',
    payload
  })

export interface GetSpacesQuery {
  keywords?: string
}
export const get_spaces = (params?: GetSpacesQuery) =>
  net.fetch<{
    total: number
    list: DocSpace[]
  }>('/proxy/space/search', {
    params: {
      page: 1,
      page_size: 50,
      ...params
    }
  })

export interface GetSpaceInfoQuery {
  space_id: string
}
export const get_space_info = (params: GetSpaceInfoQuery) =>
  net.fetch<DocSpace>('/proxy/space/info', {
    params
  })
