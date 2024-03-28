import { checkDarkMode, checkMobile, delay, onDarkModeChange, onMobileChange, setRootStyle } from '@youknown/utils/src'
import { cloneDeep } from 'lodash-es'
import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

import { change_i18n_lang } from '@/utils/i18n'

export const enum THEME {
  LIGHT = 1,
  DARK = 2,
  SYSTEM = 3
}
export const enum I18N_LANG {
  SYSTEM = 'system',
  ZH = 'zh',
  EN = 'en'
}
export interface UIState {
  is_mobile: boolean
  progress_percent: number
  progress_visible: boolean
  primary_color: string
  radius: number[]
  theme: THEME
  i18n_lang: I18N_LANG
  menu_drawer_open: boolean
  set_is_mobile: (is_mobile: boolean) => void
  set_progress_percent: (percent: number) => void
  show_progress: () => void
  hide_progress: () => void
  start_progress: () => void
  stop_progress: () => Promise<void>
  set_primary_color: (primary_color: string) => void
  set_radius: (radius: number[]) => void
  set_theme: (theme: THEME) => void
  set_i18n_lang: (lang: I18N_LANG) => void
  set_menu_drawer_open: (open: boolean) => void
}

const ui_state_creator: StateCreator<UIState> = (set, get) => ({
  is_mobile: checkMobile(),
  progress_percent: 0,
  progress_visible: false,
  primary_color: '#af52de',
  radius: [4, 8, 12],
  theme: THEME.SYSTEM,
  i18n_lang: I18N_LANG.SYSTEM,
  menu_drawer_open: false,

  set_is_mobile: (is_mobile: boolean) =>
    set({
      is_mobile
    }),

  set_progress_percent: percent =>
    set({
      progress_percent: percent
    }),

  show_progress: () => set({ progress_visible: true }),

  hide_progress: () => set({ progress_visible: false }),

  start_progress: async () => {
    const { show_progress, set_progress_percent } = get()
    const roll_step_percent = () => Math.round(Math.random() * 20)
    const roll_delay = () => {
      const duration = Math.random() * 1500 + 500
      return delay(duration)
    }
    const roll_step = async () => {
      const { progress_percent, progress_visible } = get()
      const next_per = progress_percent + roll_step_percent()
      if (next_per > 95 || !progress_visible) {
        return
      }
      set_progress_percent(next_per)
      await roll_delay()
      roll_step()
    }
    set_progress_percent(0)
    show_progress()
    roll_step()
  },

  stop_progress: async () => {
    const { set_progress_percent, hide_progress } = get()
    set_progress_percent(100)
    hide_progress()
  },

  set_primary_color: primary_color => set({ primary_color }),
  set_radius: radius => set({ radius }),
  set_theme: theme => set({ theme }),
  set_i18n_lang: lang => set({ i18n_lang: lang }),
  set_menu_drawer_open: open => set({ menu_drawer_open: open })
})

const compute_is_dark_theme = (theme: THEME) => {
  switch (theme) {
    case THEME.SYSTEM:
      return checkDarkMode()
    case THEME.LIGHT:
      return false
    case THEME.DARK:
      return true
  }
}
const primary_color_effect = async (primary_color: UIState['primary_color']) => {
  setRootStyle({
    '--ui-color-primary': primary_color
  })
  const { mix } = await import('chroma-js')
  setRootStyle({
    '--ui-color-primary-hover': mix(primary_color, '#fff', 0.1).hex(),
    '--ui-color-primary-active': mix(primary_color, '#000', 0.2).hex()
  })
}
const radius_effect = (radius: UIState['radius']) => {
  const [s, m, l] = radius
  setRootStyle({
    '--ui-radius-s': `${s}px`,
    '--ui-radius-m': `${m}px`,
    '--ui-radius-l': `${l}px`
  })
}
const i18n_lang_effect = (i18n_lang: UIState['i18n_lang']) => {
  if (i18n_lang === I18N_LANG.SYSTEM) {
    const system_lang = navigator.language.slice(0, 2)
    change_i18n_lang(system_lang)
  } else {
    change_i18n_lang(i18n_lang)
  }
}
const theme_effect = (theme: UIState['theme']) => {
  const root = document.querySelector<HTMLElement>(':root') as HTMLElement
  if (compute_is_dark_theme(theme)) {
    root.classList.add('dark-theme')
    root.classList.remove('light-theme')
  } else {
    root.classList.add('light-theme')
    root.classList.remove('dark-theme')
  }
}

export const is_dark_theme_getter = (state: UIState) => compute_is_dark_theme(state.theme)
export const force_update_ui_store = () => useUIStore.setState(cloneDeep(useUIStore.getState()))

export const useUIStore = create<UIState>()(
  subscribeWithSelector(
    persist(ui_state_creator, {
      name: 'ui-store-persist',
      storage: createJSONStorage(() => localStorage, {
        reviver(key, val) {
          if (key === 'is_mobile') {
            return checkMobile()
          }
          return val
        }
      }),
      onRehydrateStorage() {
        return state => {
          if (!state) {
            return
          }
          theme_effect(state.theme)
          primary_color_effect(state.primary_color)
          radius_effect(state.radius)
          i18n_lang_effect(state.i18n_lang)
        }
      }
    })
  )
)

onDarkModeChange(() => {
  const { theme } = useUIStore.getState()
  if (theme === THEME.SYSTEM) {
    force_update_ui_store()
    theme_effect(theme)
  }
})
onMobileChange(() => {
  useUIStore.setState({ is_mobile: checkMobile() })
})

useUIStore.subscribe(state => state.primary_color, primary_color_effect)
useUIStore.subscribe(state => state.radius, radius_effect)
useUIStore.subscribe(state => state.i18n_lang, i18n_lang_effect)
useUIStore.subscribe(state => state.theme, theme_effect)
