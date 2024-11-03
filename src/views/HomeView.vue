<template>
  <main class="home">
    <Title title="Panel de control" />
    <Banner />
  </main>
</template>
<script lang="ts">
import Banner from '@/components/home/Banner.vue'
import Title from '@/components/Title.vue'

export default {
  mounted() {
    window.scrollTo(0, 0)
  },
  components: {
    Banner,
    Title
  }
}
</script>
<style lang="scss" scoped>
.home {
  margin-bottom: 50px;
}
</style>
