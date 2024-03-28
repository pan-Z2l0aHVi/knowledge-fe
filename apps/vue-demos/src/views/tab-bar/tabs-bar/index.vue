<template>
  <div ref="containerRef" class="tabs-bar" :style="{ top: `${offsetTop}px` }">
    <van-tabs swipeable :active="active" @update:active="$emit('update:active')" @click-tab="handleClickTab">
      <van-tab v-for="tab in tabList" :key="tab.name" :title="tab.title" :to="tab.path"></van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface TabItem {
  name: string | number
  title: string
  path?: string
}
interface TabsBarProps {
  offsetTop?: number
  active?: number
  tabList?: TabItem[]
  container?: HTMLElement
}
const props = withDefaults(defineProps<TabsBarProps>(), {
  offsetTop: 0,
  active: 0,
  tabList: () => [],
  container: () => document.getElementById('app') as HTMLElement
})
const emit = defineEmits(['click-tab', 'update:active'])
const containerRef = ref<HTMLDivElement>()
const rectTop = ref(0)
const handleClickTab = (tab: TabItem) => {
  emit('click-tab', tab)

  const top = rectTop.value - props.offsetTop
  props.container.scrollTo({
    top,
    behavior: 'smooth'
  })
}
onMounted(() => {
  const containerRect = containerRef.value?.getBoundingClientRect()
  if (containerRect) {
    console.log('rect top', containerRect.top)
    rectTop.value = containerRect.top
  }
})
</script>

<style scoped lang="scss">
.tabs-bar {
  position: sticky;
  width: 100%;
}
</style>
