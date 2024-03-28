import type { StateCreator } from 'zustand'
import { create } from 'zustand'

import { create_doc_space, delete_doc_space, DocSpace, get_spaces, update_doc_space } from '@/apis/space'

export interface SpaceState {
  space_list: DocSpace[]
  fetch_space_list: () => Promise<void>
  clear_space_list: () => void
  create_space: (name: string, desc: string) => Promise<void>
  update_space: (space_id: string, name: string, desc: string) => Promise<void>
  delete_spaces: (...space_ids: string[]) => Promise<void>
}

const space_state_creator: StateCreator<SpaceState> = (set, get) => ({
  space_list: [],

  clear_space_list: () => set({ space_list: [] }),

  fetch_space_list: async () => {
    const res = await get_spaces()
    set({ space_list: res.list })
  },

  create_space: async (name, desc) => {
    const new_space = await create_doc_space({ name, desc })
    set({
      space_list: [new_space, ...get().space_list]
    })
  },

  update_space: async (space_id, name, desc) => {
    const space = await update_doc_space({
      space_id,
      name,
      desc
    })
    set({
      space_list: get().space_list.map(item => (item.space_id === space.space_id ? space : item))
    })
  },

  delete_spaces: async (...space_ids) => {
    await delete_doc_space({
      space_ids
    })
    set({
      space_list: get().space_list.filter(item => !space_ids.includes(item.space_id))
    })
  }
})

export const useSpaceStore = create<SpaceState>()(space_state_creator)
