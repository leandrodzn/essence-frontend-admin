<template>
  <div class="form text-center mt-2">
    <h2 class="title">Panel de control</h2>
    <div class="mb-3">Inicie sesión con sus credenciales</div>
    <form class="mb-4" @submit.prevent="login">
      <div class="form-floating mb-3">
        <input
          v-model="emailValue"
          class="form-control"
          type="email"
          placeholder="Correo electrónico"
          id="floatingInputSubject"
          :class="{ error: v$.email.$errors.length }"
        />
        <label for="floatingInputSubject">Correo electrónico</label>
        <div v-if="v$.email.$error" class="validation-text">
          {{ errorParser(v$.email.$errors, 'Correo electrónico') }}
        </div>
      </div>
      <div class="mb-4">
        <div class="input-group">
          <div class="form-floating">
            <input
              v-model="password"
              class="form-control"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              id="floatingInputSubject"
              :class="{ error: v$.password.$errors.length }"
            />
            <label for="floatingInputSubject">Contraseña</label>
          </div>
          <button
            class="btn btn-outline-primary d-flex align-items-center justify-content-center"
            type="button"
            @click="showPassword = !showPassword"
          >
            <vue-feather :type="showPassword ? 'eye-off' : 'eye'" size="15"></vue-feather>
          </button>
        </div>
        <div v-if="v$.password.$error" class="validation-text mb-2">Contraseña es requerida</div>
      </div>

      <!-- <RouterLink to="/history" class="forgot-password">
          ¿Olvidaste tu contraseña?
        </RouterLink> -->

      <button type="submit" class="btn btn-primary" style="color: white">Iniciar sesión</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { useLoginStore } from '@stores/login'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import { errorParser } from '@/utils'

const useLogin = useLoginStore()
const toast = useToast()
const router = useRouter()

const showPassword = ref(false)

const state = reactive({
  email: '',
  password: ''
})

const rules = {
  email: { required, email },
  password: { required }
}

const v$ = useVuelidate(rules, state)

const login = async () => {
  const isFormCorrect = await v$.value.$validate()

  if (!isFormCorrect) return

  const data = {
    email: state.email,
    password: state.password
  }

  try {
    const response = await useLogin.login({ data })

    toast.open({
      message: `Ha iniciado sesión como ${response.user.name} ${response.user.surname}`,
      type: 'info',
      position: 'top-right',
      dismissible: true
    })

    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (error) {
    toast.open({
      message: 'Error al iniciar sesión',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  }
}

const { email: emailValue, password } = toRefs(state)
</script>
<style lang="scss" scoped>
.error {
  border: 1px solid var(--dark-purple);
}

.title {
  font-weight: bold;
  color: var(--primary);
}
.form {
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // width: 100%;

  .validation-text {
    // font-weight: 400;
    margin: 5px;
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: var(--primary);
  }

  .forgot-password {
    font-weight: 400;
    font-size: 95%;
    color: var(--primary);

    &:hover {
      font-weight: 500;
    }
  }
}

.register-link {
  font-weight: 500;
  font-size: 120%;

  &:hover {
    font-weight: 700;
  }
}
</style>
