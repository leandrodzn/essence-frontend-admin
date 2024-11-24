<template>
  <div>
    <!-- Loading... -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else class="table-responsive">
      <!-- Button to add a new event -->
      <div class="text-center my-4 d-flex align-items-center justify-content-center">
        <button
          class="btn btn-primary d-flex align-items-center justify-content-center"
          title="Agregar"
          @click="createTemplate"
        >
          <vue-feather type="plus" size="20px" stroke="white" />
        </button>
      </div>
      <!-- Table with web templates -->
      <table v-if="webTemplatesList.length" class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col" class="col-name">Nombre</th>
            <th scope="col" class="col-price">Precio</th>
            <th scope="col" class="col-thumbnail">Portada</th>
            <th scope="col" class="col-link">Enlace</th>
            <th scope="col" class="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="webTemplate in webTemplatesList" :key="webTemplate.id">
            <td>{{ webTemplate.name }}</td>
            <td>${{ webTemplate.price }}</td>
            <td>
              <img
                v-if="webTemplate.ThumbnailImage?.link"
                :src="webTemplate.ThumbnailImage?.link"
                alt="Imagen principal"
                class="img-fluid main-image"
              />
            </td>
            <td>
              <a :href="webTemplate.link" target="_blank" rel="noopener noreferrer">
                Ver ejemplo
              </a>
            </td>
            <td>
              <div class="d-flex align-items-center justify-content-start">
                <button
                  class="btn btn-primary btn-sm m-2 d-flex align-items-center justify-content-center"
                  title="Editar"
                  @click="() => editTemplate(webTemplate)"
                >
                  <vue-feather type="edit" size="20px" stroke="white" />
                </button>
                <button
                  class="btn btn-dark btn-sm d-flex align-items-center justify-content-center"
                  title="Eliminar"
                  :disabled="webTemplate.busy"
                  @click="() => showModalConfirmationDelete(webTemplate)"
                >
                  <vue-feather type="trash-2" size="20px" stroke="white" />
                </button>
              </div>
              
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center my-4">No se encontraron plantillas.</div>
    </div>

    <!-- Modal Confirmation Delete -->
    <ConfirmationModal
      v-if="showModalWebTemplateDelete"
      :title="'Eliminar plantilla'"
      :message="'¿Está seguro de eliminar esta plantilla?'"
      @cancel="resetWebTemplateDelete"
      @confirm="deleteTemplate"
    />
  </div>
</template>
<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { useWebTemplatesStore, type WebTemplate } from '@stores/web-templates'
import { useToast } from 'vue-toast-notification'
import ConfirmationModal from '@components/ConfirmationModal.vue'
import { useRouter } from 'vue-router'

// Variables
const router = useRouter()
const useWebTemplates = useWebTemplatesStore()
const toast = useToast()
const loading = ref(false)
const webTemplatesList = ref<WebTemplateListItem[]>([])
const showModalWebTemplateDelete = ref(false)
const webTemplateItemToDelete = ref<WebTemplateListItem | undefined | null>(null)

// Types
interface WebTemplateListItem extends WebTemplate {
  busy: boolean
}

// Functions
const getWebTemplates = async () => {
  try {
    loading.value = true
    const fetchedWebTemplates = await useWebTemplates.getWebTemplates()

    webTemplatesList.value = fetchedWebTemplates.map((webTemplate) => ({
      ...webTemplate,
      busy: false
    }))
  } catch (error) {
    toast.open({
      message: 'Error al obtener plantillas',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    loading.value = false
  }
}

const createTemplate = () => {
  router.push({ name: 'new-template' })
}

const editTemplate = (webTemplate: WebTemplate) => {
  if (!webTemplate?.id) return

  router.push({ name: 'edit-template', params: { id: webTemplate.id } })
}

const showModalConfirmationDelete = (webTemplate: WebTemplateListItem) => {
  if (!webTemplate?.id) return

  webTemplateItemToDelete.value = webTemplate
  showModalWebTemplateDelete.value = true
}

const resetWebTemplateDelete = () => {
  showModalWebTemplateDelete.value = false
  webTemplateItemToDelete.value = null
}

const deleteTemplate = async () => {
  if (!webTemplateItemToDelete.value?.id) return

  try {
    webTemplateItemToDelete.value.busy = true
    await useWebTemplates.deleteWebTemplate(webTemplateItemToDelete.value.id)
    toast.open({
      message: 'Plantilla eliminada',
      type: 'success',
      position: 'top-right',
      dismissible: true
    })
    getWebTemplates()
  } catch (error) {
    toast.open({
      message: 'Error al eliminar plantilla',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    webTemplateItemToDelete.value.busy = false
    resetWebTemplateDelete()
  }
}

// Lifecycle
onMounted(() => {
  getWebTemplates()
})
</script>
<style lang="scss" scoped>
.col-name {
  width: 30%;
}

.col-price {
  width: 20%;
}

.col-thumbnail {
  width: 20%;
}

.col-link {
  width: 15%;
}

.col-actions {
  width: 15%;
}

.col-name,
.col-actions,
.col-price,
.col-thumbnail,
.col-link {
  font-weight: bold;
}

.main-image {
  width: 90px;
  height: 40px;
  object-fit: cover;
}
</style>
