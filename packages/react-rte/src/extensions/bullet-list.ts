import TiptapBulletList, { BulletListOptions } from '@tiptap/extension-bullet-list'

import BulletListItem from '../components/bullet-list-item'

export default TiptapBulletList.extend<
	BulletListOptions & {
		insert: typeof BulletListItem
	}
>({
	addOptions() {
		return {
			...this.parent?.(),
			insert: BulletListItem
		}
	}
})