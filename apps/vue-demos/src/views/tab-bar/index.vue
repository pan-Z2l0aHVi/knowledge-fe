<template>
  <div class="relative">
    <div class="fixed box-border w-100% p-8px bg-orange">
      <div class="flex items-center h-32px pl-16px rd-full bg-#fff color-#999">搜索</div>
    </div>
    <div class="h-400px bg-blue"></div>
    <TabsBar :offsetTop="96" :tabList="tabList"> </TabsBar>
    <div class="bg-indigo color-#fff">
      <div class="p-16px" v-for="n in 100" :key="n">content</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ref } from 'vue'

import TabsBar from './tabs-bar/index.vue'
const getAppEle = () => {
  return document.getElementById('app')
}

onMounted(() => {
  const app = getAppEle()
  app?.style.setProperty('height', '100vh')
  app?.style.setProperty('overflow-y', 'auto')
  document.body.style.setProperty('overflow', 'hidden')
})
onUnmounted(() => {
  const app = getAppEle()
  app?.style.removeProperty('height')
  app?.style.removeProperty('overflow-y')
  document.body.style.removeProperty('overflow')
})

const tabList = ref<InstanceType<typeof TabsBar>['$props']['tabList']>([
  {
    name: 'q',
    title: 'QQQ'
  },
  {
    name: 'w',
    title: 'WWW'
  },
  {
    name: 'e',
    title: 'EEE'
  },
  {
    name: 'r',
    title: 'RRR'
  },
  {
    name: 't',
    title: 'TTT'
  },
  {
    name: 'u',
    title: 'UUU'
  },
  {
    name: 'y',
    title: 'YYY'
  },
  {
    name: 'a',
    title: 'AAA'
  },
  {
    name: 's',
    title: 'SSS'
  }
])
</script>

<style scoped lang="scss"></style>
