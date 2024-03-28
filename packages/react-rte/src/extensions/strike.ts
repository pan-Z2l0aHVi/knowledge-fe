import type { StrikeOptions } from '@tiptap/extension-strike'
import TiptapStrike from '@tiptap/extension-strike'

import StrikeBtn from '../components/strike-btn'

export default TiptapStrike.extend<
  StrikeOptions & {
    menu: typeof StrikeBtn
    bubble: typeof StrikeBtn
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      menu: StrikeBtn,
      bubble: StrikeBtn
    }
  }
})
