<template>
  <main>
    <Title title="Plantillas" />
    <div class="container-events">
      <TemplatesList />
    </div>
  </main>
</template>
<script lang="ts" setup>
import TemplatesList from '@/components/templates/TemplatesList.vue'
import Title from '@/components/Title.vue'
</script>
<style lang="scss" scoped>
.container-events {
  // align-items: start;
  width: 100%;
  // background-color: #ede6de;
  margin-bottom: 20px;
  padding: 20px;
}
</style>
