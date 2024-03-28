import presetRemToPx from '@unocss/preset-rem-to-px'
import { defineConfig, presetUno } from 'unocss'
import presetAutoprefixer from 'unocss-preset-autoprefixer'
import { presetScrollbar } from 'unocss-scrollbar-variant'

import { shortcuts, theme } from '../../build/unocss'

export default defineConfig({
  presets: [presetUno(), presetAutoprefixer(), presetRemToPx(), presetScrollbar()],
  shortcuts: {
    ...shortcuts
  },
  rules: [],
  theme: {
    ...theme
  }
})
