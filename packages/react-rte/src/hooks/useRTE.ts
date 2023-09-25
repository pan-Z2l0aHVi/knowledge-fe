import { DependencyList } from 'react'

import CharacterCount from '@tiptap/extension-character-count'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import History from '@tiptap/extension-history'
import ListItem from '@tiptap/extension-list-item'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder, { PlaceholderOptions } from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import { EditorOptions, useEditor } from '@tiptap/react'

interface RTEOptions extends Partial<EditorOptions> {
	placeholder?: PlaceholderOptions['placeholder']
}
export function useRTE(options?: RTEOptions, deps?: DependencyList) {
	const extensions = options?.extensions ?? []
	const placeholder = options?.placeholder ?? ''
	return useEditor(
		{
			...options,
			extensions: extensions.concat([
				Document,
				Text,
				Paragraph,
				Dropcursor.configure({
					color: 'var(--ui-color-primary)',
					width: 4
				}),
				Gapcursor,
				History,
				CharacterCount,
				ListItem,
				Placeholder.configure({
					placeholder,
					includeChildren: true
				})
			])
		},
		deps
	)
}
