<template>
  <div class="container">
    <h1 class="title">{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  title: string
}>()
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.title {
  color: rgb(150, 61, 130);
}
</style>
