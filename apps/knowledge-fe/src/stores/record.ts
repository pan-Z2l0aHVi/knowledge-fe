import { uuid } from '@youknown/utils/src'
import { create, StateCreator } from 'zustand'

import type { RecordValue } from '@/utils/idb'
import { clear_records, delete_record, find_records, insert_record } from '@/utils/idb'

export interface RecordState {
  record_list: RecordValue[]
  recording: (record: Omit<RecordValue, 'creation_time' | 'id'>) => Promise<void>
  init_records: () => Promise<void>
  delete_record: (record_id: string) => Promise<void>
  clear_records: () => Promise<void>
}

const record_state_creator: StateCreator<RecordState> = set => ({
  record_list: [],

  recording: async record => {
    const record_item: RecordValue = {
      ...record,
      id: uuid(),
      creation_time: new Date()
    }
    await insert_record(record_item)
    set(state => ({
      record_list: [record_item, ...state.record_list]
    }))
  },

  init_records: async () => {
    const records = await find_records()
    set({ record_list: records })
  },

  delete_record: async record_id => {
    await delete_record(record_id)
    set(state => ({
      record_list: state.record_list.filter(record => record.id !== record_id)
    }))
  },

  clear_records: async () => {
    await clear_records()
    set({ record_list: [] })
  }
})

export const useRecordStore = create<RecordState>()(record_state_creator)
