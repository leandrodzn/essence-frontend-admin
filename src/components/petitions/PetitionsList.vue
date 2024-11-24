<template>
  <div>
    <!-- Loading... -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else class="table-responsive">
      <!-- Table with web templates -->
      <table v-if="petitionsList.length" class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col" class="col-name">Plantilla</th>
            <th scope="col" class="col-date">Fecha</th>
            <th scope="col" class="col-customer">Cliente</th>
            <th scope="col" class="col-price">Precio al solicitar</th>
            <th scope="col" class="col-thumbnail">Portada</th>
            <th scope="col" class="col-state">Estado</th>
            <th scope="col" class="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="petition in petitionsList" :key="petition.id">
            <td>{{ petition?.WebTemplate?.name }}</td>
            <td>{{ getDateTime(petition?.created_at) }}</td>
            <td>{{ petition?.Customer?.name }} {{ petition?.Customer?.surname }}</td>
            <td>${{ petition.price_day }} MXN</td>
            <td>
              <img
                v-if="petition?.WebTemplate.ThumbnailImage?.link"
                :src="petition?.WebTemplate.ThumbnailImage?.link"
                alt="Imagen principal"
                class="img-fluid main-image"
              />
            </td>
            <td>
              <span :class="`badge text-bg-${petition.readed ? 'primary' : 'dark'}`">
                {{ petition.readed ? 'Leído' : 'No leído' }}
              </span>
              <span class="badge text-bg-dark" v-if="!petition.show_customer">
                Eliminada por cliente
              </span>
            </td>
            <td>
              <div class="d-flex align-items-center justify-content-start">
                <button
                  class="btn btn-primary btn-sm m-2 d-flex align-items-center justify-content-center"
                  title="Ver detalles"
                  @click="() => seePetitionDetails(petition)"
                >
                  <vue-feather type="info" size="20px" stroke="white" />
                </button>
                <button
                  class="btn btn-dark btn-sm d-flex align-items-center justify-content-center"
                  title="Eliminar"
                  :disabled="petition.busy"
                  @click="() => showModalConfirmationDelete(petition)"
                >
                  <vue-feather type="trash-2" size="20px" stroke="white" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center my-4">No se encontraron solicitudes.</div>
    </div>

    <!-- Modal Petition Details -->
    <PetitionDetails
      v-if="showModalPetitionDetails"
      :id="petitionItemId"
      @close="onCloseModalDetails"
    />

    <!-- Modal Confirmation Delete -->
    <ConfirmationModal
      v-if="showModalPetitionDelete"
      :title="'Eliminar solicitud'"
      :message="'¿Está seguro de eliminar esta solicitud? Será removida de la lista y se actualizará su estado para el cliente'"
      @cancel="resetPetitionDelete"
      @confirm="deletePetition"
    />
  </div>
</template>
<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { usePetitionsStore, type Petition } from '@stores/petitions'
import { useToast } from 'vue-toast-notification'
import { getDateTime } from '@/utils'
import ConfirmationModal from '@components/ConfirmationModal.vue'
import PetitionDetails from '@components/petitions/PetitionDetails.vue'

// Variables
const usePetitions = usePetitionsStore()
const toast = useToast()
const loading = ref(false)
const petitionsList = ref<PetitionListItem[]>([])
const showModalPetitionDelete = ref(false)
const petitionToDelete = ref<PetitionListItem | undefined | null>(null)
const showModalPetitionDetails = ref(false)
const petitionItemId = ref<number | undefined | null>(null)

// Types
interface PetitionListItem extends Petition {
  busy: boolean
}

//* Functions
const getPetitions = async () => {
  try {
    loading.value = true
    const fetchedPetitions = await usePetitions.getPetitions()

    petitionsList.value =
      fetchedPetitions?.rows?.map((petition) => ({
        ...petition,
        busy: false
      })) || []
  } catch (error) {
    toast.open({
      message: 'Error al obtener solicitudes',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    loading.value = false
  }
}

// Details
const seePetitionDetails = (petition: PetitionListItem) => {
  if (!petition?.id) return

  petitionItemId.value = petition.id
  showModalPetition()
}

const showModalPetition = () => {
  showModalPetitionDetails.value = true
}

const onCloseModalDetails = (refresh: Boolean) => {
  showModalPetitionDetails.value = false
  if (refresh) {
    getPetitions()
  }
}

// Delete
const showModalConfirmationDelete = (petition: PetitionListItem) => {
  if (!petition?.id) return

  petitionToDelete.value = petition
  showModalPetitionDelete.value = true
}

const resetPetitionDelete = () => {
  showModalPetitionDelete.value = false
  petitionToDelete.value = null
}

const deletePetition = async () => {
  if (!petitionToDelete.value?.id) return

  try {
    petitionToDelete.value.busy = true
    await usePetitions.deletePetition(petitionToDelete.value.id)
    toast.open({
      message: 'Solicitud eliminada',
      type: 'success',
      position: 'top-right',
      dismissible: true
    })
    getPetitions()
  } catch (error) {
    toast.open({
      message: 'Error al eliminar solicitud',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    petitionToDelete.value.busy = false
    resetPetitionDelete()
  }
}

// Lifecycle
onMounted(() => {
  getPetitions()
})
</script>
<style lang="scss" scoped>
.col-name {
  width: 20%;
}

.col-price {
  width: 13%;
}

.col-thumbnail {
  width: 13%;
}

.col-date {
  width: 15%;
}

.col-customer {
  width: 15%;
}

.col-state {
  width: 12%;
}

.col-actions {
  width: 12%;
}

.col-name,
.col-actions,
.col-price,
.col-thumbnail,
.col-date,
.col-customer,
.col-state {
  font-weight: bold;
}

.main-image {
  width: 90px;
  height: 40px;
  object-fit: cover;
}
</style>
