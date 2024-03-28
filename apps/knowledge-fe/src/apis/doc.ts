import { net } from '@/utils/request'

import type { Profile } from './user'

export interface Doc {
  doc_id: string
  content: string
  summary: string
  title: string
  cover: string
  space_id: string
  author_id: string
  author: Profile
  public: boolean
  creation_time: string
  update_time: string
}
export interface Draft {
  content: string
  summary: string
  creation_time: string
}

export interface GetDocInfoParams {
  doc_id: string
}
export const get_doc_info = (params: GetDocInfoParams) =>
  net.fetch<Doc>('/proxy/doc/info', {
    params
  })

export interface CreateDocPayload {
  space_id: string
  title: string
  content?: string
  summary?: string
  cover?: string
}
export const create_doc = (payload: CreateDocPayload) =>
  net.fetch<Doc>('/proxy/doc/create', {
    method: 'post',
    payload
  })

export interface UpdateDocPayload {
  doc_id: string
  content?: string
  summary?: string
  title?: string
  cover?: string
  public?: boolean
}
export const update_doc = (payload: UpdateDocPayload) =>
  net.fetch<Doc>('/proxy/doc/update', {
    method: 'post',
    payload,
    silent: true
  })

export interface DeleteDocPayload {
  doc_ids: string[]
}
export const delete_doc = (payload: DeleteDocPayload) =>
  net.fetch<void>('/proxy/doc/delete', {
    method: 'post',
    payload
  })

export interface DocsParams {
  page: number
  page_size: number
  space_id?: string
  author_id?: string
  keywords?: string
  sort_by?: string
  sort_type?: string
}
export const search_docs = (params: DocsParams) =>
  net.fetch<{
    total: number
    list: Doc[]
  }>('/proxy/doc/docs', {
    params
  })

export interface GetDocDraftParams {
  doc_id: string
  page: number
  page_size: number
}
export const get_doc_drafts = (params: GetDocDraftParams) =>
  net.fetch<Draft[]>('/proxy/doc/drafts', {
    params
  })

export interface UpdateDocDraftPayload {
  doc_id: string
  content: string
}
export const update_doc_drafts = (payload: UpdateDocDraftPayload) =>
  net.fetch<Draft>('/proxy/doc/update_drafts', {
    method: 'put',
    payload
  })
