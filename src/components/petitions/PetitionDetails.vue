<template>
  <div
    class="modal fade modal-lg"
    id="modal-petition-details"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="modal-petition-details-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modal-petition-details-label">
            Detalles de la solicitud
          </h1>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="close(wasUpdated || false)"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Template -->
          <h2 class="fs-5">Plantilla</h2>
          <div class="row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <span class="fs-6">Nombre:</span>
              <p>{{ petition?.WebTemplate?.name }}</p>
              <span class="fs-6">Precio actual: &nbsp;</span>
              <span>${{ petition?.WebTemplate?.price }} MXN</span>
              <br />

              <span class="fs-6">Precio al momento de realizar la solicitud:</span>
              <p class="highlight">${{ petition?.price_day }} MXN</p>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <img
                v-if="petition?.WebTemplate.ThumbnailImage?.link"
                :src="petition?.WebTemplate.ThumbnailImage?.link"
                alt="Imagen principal"
                class="img-fluid main-image"
              />
            </div>
          </div>

          <hr />
          <!-- Customer -->
          <h2 class="fs-5">Cliente</h2>
          <div class="row">
            <div class="col">
              <span class="fs-6">Nombre y apellidos: &nbsp;</span>
              <span>{{ petition?.Customer?.name }} {{ petition?.Customer?.surname }}</span>
              <br />

              <span class="fs-6">Correo electrónico: &nbsp;</span>
              <a class="fs-6" :href="`mailto:${petition?.Customer?.email}`">
                {{ petition?.Customer?.email }}
              </a>
              <br />

              <span class="fs-6">Teléfono de contacto: &nbsp;</span>
              <a class="fs-6" :href="`tel:${petition?.Customer?.phone}`">{{
                petition?.Customer?.phone
              }}</a>
            </div>
          </div>

          <hr />
          <!-- Request -->
          <h2 class="fs-5">Solicitud</h2>
          <div class="row">
            <div class="col">
              <span class="fs-6">Asunto:</span>
              <p>{{ petition?.subject }}</p>
              <span class="fs-6">Mensaje:</span>
              <p>{{ petition?.description }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            style="color: white"
            @click="updatePetition"
            :disabled="loading.update"
          >
            {{ petition?.readed ? 'Marcar como no leído' : 'Marcar como leído' }}
          </button>

          <button type="button" class="btn btn-secondary" @click="close(wasUpdated || false)">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { usePetitionsStore, type Petition } from '@/stores/petitions'
import { useToast } from 'vue-toast-notification'

const usePetitions = usePetitionsStore()
const toast = useToast()

// Props
const props = defineProps<{
  id?: number | null //  Optional Event
}>()

//  Emits
const emit = defineEmits(['close'])

//  Variables
const loading = ref({
  details: false,
  update: false
})
const petition = ref<Petition | null>(null)
const wasUpdated = ref(false)

//  Functions
const getPetition = async (id: number) => {
  try {
    loading.value.details = true

    const fetchedPetition = await usePetitions.getOnePetition(id)

    petition.value = fetchedPetition
  } catch (error) {
    toast.open({
      message: 'Error al obtener detalles de la solicitud',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    loading.value.details = false
  }
}

const updatePetition = async () => {
  if (!petition.value?.id) return

  try {
    loading.value.update = true

    await usePetitions.updatePetition(petition.value.id, {
      readed: !petition.value.readed
    })

    petition.value.readed = !petition.value.readed
    wasUpdated.value = true
  } catch (error) {
    toast.open({
      message: 'Error al actualizar la solicitud',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    loading.value.update = false
  }
}

const close = (refresh: Boolean) => {
  const modalElement = document.getElementById('modal-petition-details')
  if (!modalElement) return

  const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)

  if (loading.value.update) return

  modalInstance.hide()
  emit('close', refresh)
}

const showModal = () => {
  const modalElement = document.getElementById('modal-petition-details')
  if (!modalElement) return
  const modalInstance = new Modal(modalElement)
  modalInstance.show()
}

onMounted(() => {
  showModal()
})

// Watch for changes in props.id
watch(
  () => props.id,
  (id) => {
    if (id) {
      getPetition(id)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.modal-content {
  padding: 20px;
}

.highlight {
  font-weight: 600;
}

.main-image {
  max-width: 320px;
  max-height: 150px;
  object-fit: cover;
}
</style>
