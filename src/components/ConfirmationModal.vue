<template>
  <div
    class="modal fade"
    id="confirmation-modal"
    tabindex="-1"
    aria-labelledby="confirmation-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmation-modal-label">{{ title }}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cancel">Cancelar</button>
          <button type="button" class="btn btn-primary" style="color: white" @click="confirm">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps<{
  title: string
  message: string
}>()

const emit = defineEmits(['confirm', 'cancel'])

let modalInstance: Modal | null = null

const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
  emit('cancel')
}

const confirm = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
  emit('confirm')
}

const cancel = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
  emit('cancel')
}

onMounted(() => {
  const modalElement = document.getElementById('confirmation-modal')
  if (modalElement) {
    modalInstance = new Modal(modalElement)
    modalInstance.show()
  }
})
</script>

<style scoped>
.modal-content {
  padding: 20px;
}
</style>
