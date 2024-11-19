<template>
  <main>
    <Title title="Crear plantilla" />
    <div class="container-content">
      <WebTemplateForm />
    </div>
  </main>
</template>
<script setup lang="ts">
import Title from '@/components/Title.vue'
import WebTemplateForm from '@/forms/WebTemplateForm.vue'
</script>
<style lang="scss" scoped>
.container-content {
  // align-items: start;
  width: 100%;
  background-color: #ede6de;
  margin-bottom: 20px;
  padding: 45px 30px 15px 30px;
}
</style>
