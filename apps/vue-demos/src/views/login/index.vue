<template>
  <div class="p-16px flex flex-col items-center">
    <h1>Login</h1>
    <van-button @click="handleLoginGithub">Github</van-button>
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { QS, uuid } from '@youknown/utils/src'
import { computed } from 'vue'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const CLIENT_ID = '623037fcf1a6cb4ad6d8'
const getLoginURL = () => {
  return QS.stringify({
    base: `https://github.com/login/oauth/authorize`,
    query: {
      client_id: CLIENT_ID,
      state: uuid(),
      redirect_uri: 'http://127.0.0.1:5173/login'
    }
  })
}

const handleLoginGithub = () => {
  location.href = getLoginURL()
}

const route = useRoute()
const code = computed(() => route.query.code)
const login = () => {
  if (!code.value) return
  console.log('login by code:', code.value)
}
watch(code, login, {
  immediate: true
})
</script>
