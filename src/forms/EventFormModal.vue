<template>
  <div
    class="modal fade modal-lg"
    id="modal-event-form-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="modal-event-form-label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modal-event-form-label">
            {{ props.item?.id ? 'Actualizar evento' : 'Nuevo evento' }}
          </h1>
          <button type="button" class="btn-close" aria-label="Close" @click="close(false)"></button>
        </div>
        <div class="modal-body form">
          <form class="mb-4 mt-4" @submit.prevent="save">
            <div class="form-floating mb-3">
              <input
                v-model="name"
                class="form-control"
                type="text"
                placeholder="Nombre"
                id="floatingInputSubject"
                :class="{ error: v$.name.$errors.length }"
              />
              <label for="floatingInputSubject">Nombre</label>
              <div v-if="v$.name.$error" class="validation-text">Nombre es requerido</div>
            </div>
            <div class="form-floating mb-3">
              <input
                v-model="description"
                class="form-control"
                type="text"
                placeholder="Descripción"
                id="floatingInputDescription"
                :class="{ error: v$.description.$errors.length }"
              />
              <label for="floatingInputDescription">Descripción</label>
              <div v-if="v$.description.$error" class="validation-text">
                Descripción es requerida
              </div>
            </div>

            <div class="d-flex justify-content-between mt-2">
              <button type="button" class="btn btn-outline-primary" @click="close(false)">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" style="color: white">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { Modal } from 'bootstrap'
import { useEventsStore, type Event } from '@/stores/events'
import { useToast } from 'vue-toast-notification'

const useEvents = useEventsStore()
const toast = useToast()

// Props
const props = defineProps<{
  item?: Event | null //  Optional Event
}>()

//  Emits
const emit = defineEmits(['close'])

//  Variables
const busy = ref(false)
const name = ref('')
const description = ref('')

// Validation
const rules = {
  name: { required },
  description: { required }
}
const v$ = useVuelidate(rules, { name, description })

// Watch for changes in props.item and update name and description
watch(
  () => props.item,
  (newItem) => {
    if (newItem?.id) {
      name.value = newItem?.name || ''
      description.value = newItem?.description || ''
    }
  },
  { immediate: true }
)

//  Functions
const save = async () => {
  const isFormCorrect = await v$.value.$validate()

  if (!isFormCorrect) return

  try {
    busy.value = true

    if (props.item?.id) {
      const updateData = {
        name: name.value,
        description: description.value,
        id: props.item.id
      }
      await useEvents.updateEvent(updateData)
    } else {
      const createData = {
        name: name.value,
        description: description.value
      }
      await useEvents.createEvent(createData)
    }

    toast.open({
      message: props.item?.id ? 'Evento actualizado' : 'Evento creado',
      type: 'success',
      position: 'top-right',
      dismissible: true
    })
  } catch (error) {
    console.log(error)
    toast.open({
      message: props.item?.id ? 'Error al actualizar evento' : 'Error al crear evento',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    busy.value = false
    close(true)
  }
}

const close = (refresh: Boolean) => {
  const modalElement = document.getElementById('modal-event-form-modal')
  if (!modalElement) return

  const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)

  if (busy.value) return

  modalInstance.hide()
  emit('close', refresh)
}

const showModal = () => {
  const modalElement = document.getElementById('modal-event-form-modal')
  if (!modalElement) return
  const modalInstance = new Modal(modalElement)
  modalInstance.show()
}

onMounted(() => {
  showModal()
})
</script>

<style lang="scss" scoped>
.error {
  border: 1px solid var(--dark-purple);
}

.modal-content {
  padding: 20px;
}

.form {
  display: flex;
  flex-direction: column;

  .validation-text {
    // font-weight: 400;
    margin: 5px;
    font-size: 80%;
    color: var(--primary);
  }
}
</style>
