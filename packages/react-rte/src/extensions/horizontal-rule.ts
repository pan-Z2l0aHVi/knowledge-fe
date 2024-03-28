import type { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule'
import TiptapHorizontalRule from '@tiptap/extension-horizontal-rule'

import HorizontalRuleItem from '../components/horizontal-rule-item'

export default TiptapHorizontalRule.extend<
  HorizontalRuleOptions & {
    insert: typeof HorizontalRuleItem
    floating: typeof HorizontalRuleItem
  }
>({
  addOptions() {
    return {
      ...this.parent?.(),
      insert: HorizontalRuleItem,
      floating: HorizontalRuleItem
    }
  }
})
