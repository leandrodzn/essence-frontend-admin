<template>
  <main>
    <Title title="Eventos" />
    <div class="container-events">
      <EventsList />
    </div>
  </main>
</template>
<script lang="ts">
import EventsList from '@/components/events/EventsList.vue'
import Title from '@/components/Title.vue'
export default {
  components: {
    EventsList,
    // eslint-disable-next-line vue/no-reserved-component-names
    Title
  }
}
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
