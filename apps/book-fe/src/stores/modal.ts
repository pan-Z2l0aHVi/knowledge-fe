import { create } from 'zustand'

export interface ModalState {
	preferences_modal_open: boolean
	open_preferences_modal: () => void
	close_preferences_modal: () => void
}

export const useModalStore = create<ModalState>()(set => ({
	preferences_modal_open: false,
	login_modal_open: false,

	open_preferences_modal: () => set({ preferences_modal_open: true }),

	close_preferences_modal: () => set({ preferences_modal_open: false })
}))
