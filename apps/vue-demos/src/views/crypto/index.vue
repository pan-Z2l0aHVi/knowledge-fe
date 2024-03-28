<template>
  <div class="flex items-center justify-center h-300px p-16px">
    <div class="break-all">
      <p>待加密的明文：{{ plaintext }}</p>
      <p>加密后的密文：{{ ciphertext }}</p>
      <p>解密后的明文：{{ decryptedText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CryptoJS from 'crypto-js'
import { ref } from 'vue'

import { decrypt, encrypt } from '@/utils/ase'

const plaintext = ref(CryptoJS.enc.Base64.parse('Hello, World!').toString())

const ciphertext = ref(encrypt(plaintext.value))

const decryptedText = ref(decrypt(ciphertext.value))
</script>

<style scoped lang="scss"></style>
