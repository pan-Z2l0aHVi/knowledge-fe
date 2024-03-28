import type { CodeOptions } from '@tiptap/extension-code'
import TiptapCode from '@tiptap/extension-code'

import CodeBtn from '../components/code-btn'

export default TiptapCode.extend<
  CodeOptions & {
    menu: typeof CodeBtn
    bubble: typeof CodeBtn
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      menu: CodeBtn,
      bubble: CodeBtn
    }
  }
})
