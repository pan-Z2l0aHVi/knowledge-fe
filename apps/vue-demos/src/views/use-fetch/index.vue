<template>
  <div class="min-h-100vh flex flex-col items-center justify-center">
    <div class="flex">
      <button @click="doFetch">Fetch</button>
      <button class="ml-8px" @click="cancel">Cancel</button>
    </div>
    <div class="mt-24px">
      <div v-if="loading">Loading...</div>
      <div v-else>{{ data?.content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useFetch } from '@/hooks'
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

const params = ref([false])
const { data, loading, run, cancel } = useFetch(mockRequest, {
  params: params as any
})
const doFetch = () => {
  // params.value = [Math.random() > 0.5]
  run()
}
</script>
