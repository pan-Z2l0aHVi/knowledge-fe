<template>
  <div class="flex flex-col items-center mt-24px">
    <button @click="reload">Reload</button>
    <div ref="containerRef" class="max-h-480px w-100% overflow-auto bg-#fff">
      <ul v-if="data" class="p-16px">
        <li v-for="item in data" :key="item.id" class="mb-32px">{{ item.content }}</li>
      </ul>
      <div ref="lowerRef" class="h-32px line-height-32px text-center">
        <span v-if="loading">loading...</span>
        <span v-else-if="noMore">-- No more --</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useInfinity } from '@/hooks'

const LIST_TOTAL = 204
const allList = Array.from(Array(LIST_TOTAL)).map((_, index) => ({
  id: index,
  content: `${index + 1}----${100 + Math.random() * 100}`
}))

function mockFetchInfinity(params: { page: number; page_size: number }) {
  return new Promise<
    {
      id: number
      content: string
    }[]
  >(resolve => {
    const span = 2000 * Math.random()
    setTimeout(() => {
      const { page, page_size } = params
      const begin = (page - 1) * page_size
      const list = allList.slice(begin, begin + page_size)
      resolve(list)
      console.warn('Fake fetch list', `${Math.round(span)}ms`, params, list)
    }, span)
  })
}

const containerRef = ref<HTMLElement | null>(null)
const lowerRef = ref<HTMLElement | null>(null)

const fetcher = (): ReturnType<typeof mockFetchInfinity> =>
  mockFetchInfinity({
    page: page.value,
    page_size: pageSize.value
  })
const { page, pageSize, data, noMore, loading, reload } = useInfinity(fetcher, {
  initialPageSize: 50,
  target: lowerRef,
  observerInit: () => ({
    root: containerRef.value
  })
})
</script>
