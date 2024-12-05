<template>
  <div class="bg-login mb-2">
    <div class="transparent-layer"></div>

    <div class="content container">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import LoginForm from '@forms/LoginForm.vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style lang="scss" scoped>
.subtitle {
  font-weight: lighter;
}
.bg-login {
  // border: 1px solid red;
  background-image: url('/login-bg-image.png');
  background-size: cover;
  background-position: center;
  position: relative; /* Añadido para permitir que la capa se posicione correctamente */
  display: flex;
  align-items: center;
  justify-content: center;

  .transparent-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(243, 238, 233, 0.81);
  }

  .content {
    position: relative; /* Añadido para que el contenido esté encima de la capa transparente */
    z-index: 1; /* Añadido para asegurarse de que el contenido esté encima de la capa */
    display: flex;
    flex-direction: column;

    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .content {
    position: relative; /* Añadido para que el contenido esté encima de la capa transparente */
    z-index: 1; /* Añadido para asegurarse de que el contenido esté encima de la capa */
    display: flex;
    flex-direction: column;
    max-width: 50%;
    justify-content: center;
  }
}
</style>
