<template>
  <main>
    <Title title="Solicitudes" />
    <div class="container-petitions">
      <PetitionsList />
    </div>
  </main>
</template>
<script lang="ts" setup>
import PetitionsList from '@/components/petitions/PetitionsList.vue'
import Title from '@/components/Title.vue'
</script>
<style lang="scss" scoped>
.container-petitions {
  // align-items: start;
  width: 100%;
  // background-color: #ede6de;
  margin-bottom: 20px;
  padding: 20px;
}
</style>
