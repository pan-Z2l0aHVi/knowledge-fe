<template>
  <header class="z-20 sticky top-0 w-100% h-48px bg-#fff">
    <van-tabs v-if="route.name" v-model:active="active" swipeable>
      <van-tab v-for="tab in tabList" :key="tab.name" :title="tab.meta.title" :to="tab.path"></van-tab>
    </van-tabs>
  </header>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { navTabRoutes } from '@/router/routes'

const route = useRoute()
const tabList = ref(navTabRoutes)
const active = ref(0)
watchEffect(() => {
  if (route.name) {
    active.value = tabList.value.findIndex(tab => tab.name === route.name)
  }
})
</script>
