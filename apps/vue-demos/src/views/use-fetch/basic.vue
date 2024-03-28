<template>
  <div class="min-h-100vh flex flex-col items-center justify-center">
    <button @click="loadData">Fetch</button>
    <div class="mt-24px">
      <div v-if="loading">Loading...</div>
      <div v-else>{{ data?.content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import uuid from '@/utils/uuid'

let reqID = 0
const mockRequest = () =>
  new Promise<{
    id: number
    content: string
  }>(resolve => {
    const duration = Math.random() * 3000
    const currentID = ++reqID
    setTimeout(() => {
      const res = {
        id: currentID,
        content: uuid()
      }
      console.log(`${currentID}---${res.content}`)
      resolve(res)
    }, duration)
  })

const data = ref()
const loading = ref(false)
const loadData = async () => {
  loading.value = true
  try {
    const res = await mockRequest()
    data.value = res
  } catch (error) {
    console.error('error: ', error)
  } finally {
    loading.value = false
  }
}
</script>
