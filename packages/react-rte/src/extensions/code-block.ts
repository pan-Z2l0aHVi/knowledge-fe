import type { CodeBlockLowlightOptions } from '@tiptap/extension-code-block-lowlight'
import TiptapCodeBlock from '@tiptap/extension-code-block-lowlight'

import CodeBlockItem from '../components/code-block-item'
import { loadLanguages, lowlight } from '../utils/load-langs'

export default TiptapCodeBlock.extend<
  CodeBlockLowlightOptions & {
    insert: typeof CodeBlockItem
    floating: typeof CodeBlockItem
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight,
      insert: CodeBlockItem,
      floating: CodeBlockItem
    }
  },

  onCreate() {
    loadLanguages()
  }
})
