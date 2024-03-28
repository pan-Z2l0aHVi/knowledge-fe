<template>
  <div class="rich-text-editor-page">
    <editor-content class="rich-text-container" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import '@/assets/rich-text.scss'

import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
const editor = useEditor({
  content: localStorage.getItem('editorHTML') ?? '',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: '请输入内容'
    })
  ],
  onUpdate({ editor }) {
    localStorage.setItem('editorHTML', editor.getHTML())
  }
})
</script>

<style lang="scss" scoped>
.rich-text-editor-page {
  :deep(.ProseMirror) {
    outline: none;
    p.is-editor-empty:first-child::before {
      color: #adb5bd;
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  }
}
</style>
