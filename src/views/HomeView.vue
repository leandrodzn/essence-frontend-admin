<template>
  <main class="home">
    <Title title="Panel de control" />
    <Banner />
  </main>
</template>
<script setup lang="ts">
import Banner from '@components/home/Banner.vue'
import Title from '@components/Title.vue'
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>
<style lang="scss" scoped>
.home {
  margin-bottom: 50px;
}
</style>
