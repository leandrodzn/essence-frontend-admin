<template>
  <div class="dropdown">
    <button class="btn btn-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      <vue-feather
        type="user"
        size="30px"
        stroke="rgb(150, 61, 130)"
        fill="rgb(150, 61, 130)"
      ></vue-feather>
    </button>
    <ul class="dropdown-menu" style="">
      <span class="mx-2 mb-2">
        Hola
        <span style="color: var(--primary)">
          {{ useLogin?.userLogged?.name || '' }}
          {{ useLogin?.userLogged?.surname || '' }}
        </span>
      </span>
      <li>
        <a class="dropdown-item cursor-pointer" @click="logout"> Cerrar sesión </a>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { useLoginStore } from '../stores/login'
export default {
  setup() {
    const useLogin = useLoginStore()
    return { useLogin }
  },
  methods: {
    logout() {
      this.useLogin.logout()
    }
  }
}
</script>
