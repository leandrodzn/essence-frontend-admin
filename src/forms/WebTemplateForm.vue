<template>
  <div class="form text-center mt-2">
    <form class="mb-4" @submit.prevent="handleSave">
      <!-- Name -->
      <div class="form-floating mb-3">
        <input
          v-model="name"
          class="form-control"
          type="text"
          placeholder="Nombre"
          id="floatingInputName"
          :class="{ error: v$.name.$errors.length }"
        />
        <label for="floatingInputName">Nombre</label>
        <div v-if="v$.name.$error" class="validation-text">
          {{ errorParser(v$.name.$errors, 'Nombre') }}
        </div>
      </div>

      <!-- Description -->
      <div class="form-floating mb-3">
        <textarea
          v-model="description"
          class="form-control"
          placeholder="Descripción"
          id="floatingDescriptionTextarea"
          :class="{ error: v$.description.$errors.length }"
          style="height: 150px; min-height: 150px; max-height: 250px"
        ></textarea>
        <label for="floatingDescriptionTextarea">Descripción</label>
        <div v-if="v$.description.$error" class="validation-text">
          {{ errorParser(v$.description.$errors, 'Descripción') }}
        </div>
      </div>

      <!-- Events -->
      <div class="mb-3">
        <v-select
          v-model="events"
          label="Tipos de eventos"
          class="form-control pb-3"
          color="#963d82"
          item-color="#963d82"
          :class="{ error: v$.events.$errors.length }"
          variant="plain"
          multiple
          chips
          :items="eventsList"
          item-title="name"
          item-value="id"
          clearable
          hide-details
          :loading="loading.events"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="item.raw.description"></v-list-item>
          </template>
        </v-select>
        <div v-if="v$.events.$error" class="validation-text">
          {{ errorParser(v$.events.$errors, 'Tipos de eventos', 'array') }}
        </div>
      </div>

      <!-- Price -->
      <div class="mb-3">
        <div class="input-group mb-0">
          <span class="input-group-text">$</span>
          <div class="form-floating">
            <input
              v-model="price"
              type="number"
              class="form-control"
              id="floatingInputGroupPrice"
              placeholder="0"
              step="0.01"
              :class="{ error: v$.price.$errors.length }"
            />
            <label for="floatingInputGroupPrice">Precio</label>
          </div>
        </div>
        <div v-if="v$.price.$error" class="validation-text">
          {{ errorParser(v$.price.$errors, 'Precio') }}
        </div>
      </div>

      <!-- Link -->
      <div class="form-floating mb-3">
        <input
          v-model="link"
          class="form-control"
          type="text"
          placeholder="Enlace de ejemplo"
          id="floatingInputLink"
          :class="{ error: v$.link.$errors.length }"
        />
        <label for="floatingInputLink">Enlace de ejemplo</label>
        <div v-if="v$.link.$error" class="validation-text">
          {{ errorParser(v$.link.$errors, 'Enlace de ejemplo') }}
        </div>
      </div>

      <!-- Main image -->
      <div class="mb-4">
        <div class="text-left">
          <label for="formFileMainImage" class="form-label">Imagen principal</label>
          <input
            class="form-control"
            type="file"
            id="formFileMainImage"
            :accept="imagesTypes"
            @change="onMainImageChange"
            :class="{ error: v$.mainImageFile.$errors.length }"
          />
        </div>
        <div v-if="v$.mainImageFile.$error" class="validation-text">
          {{ errorParser(v$.mainImageFile.$errors, 'Imagen principal') }}
        </div>

        <div class="image-preview mt-3">
          <img
            v-if="mainImageFile"
            :src="mainImageFileUrl"
            alt="Imagen principal cargada"
            class="img-fluid main-image"
          />
          <img
            v-else-if="mainImage"
            :src="state.mainImage"
            alt="Imagen principal existente"
            class="img-fluid main-image"
          />
        </div>
      </div>

      <!-- Additional images -->
      <div class="mb-3">
        <div class="text-left">
          <label for="formFileAdditionalImages" class="form-label">Otras imágenes</label>
          <input
            class="form-control"
            type="file"
            id="formFileAdditionalImages"
            multiple
            :accept="imagesTypes"
            @change="onAdditionalImagesChange"
            :class="{ error: v$.additionalImagesFiles.$errors.length }"
          />
        </div>
        <div v-if="v$.additionalImagesFiles.$error" class="validation-text">
          {{ errorParser(v$.additionalImagesFiles.$errors, 'Otras imágenes', 'array') }}
        </div>
        <div class="image-preview mt-3 d-flex flex-wrap gap-3 justify-content-center">
          <!-- Show uploaded files -->
          <div
            v-if="additionalImagesFiles?.length"
            v-for="(file, index) in state.additionalImagesFiles"
            :key="'file-' + index"
          >
            <img :src="getImageFileUrl(file)" class="img-fluid additional-image" />
          </div>
          <!-- Show existing URLs -->
          <div
            v-else-if="additionalImages?.length"
            v-for="(url, index) in state.additionalImages"
            :key="'url' + index"
          >
            <img :src="url" class="img-fluid additional-image" />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="row justify-content-between">
        <div class="col-3 d-grid m-5">
          <button class="btn btn-dark" @click="sendToTemplates" :disabled="busy">Cancelar</button>
        </div>
        <div class="col-3 d-grid m-5">
          <button type="submit" class="btn btn-primary" style="color: white" :disabled="busy">
            Guardar
          </button>
        </div>
      </div>
    </form>

    <!-- Modal Confirmation Delete -->
    <ConfirmationModal
      v-if="showModalConfirmationSave"
      :title="'Confirmar guardado'"
      :message="'¿Está seguro de guardar la información de esta plantilla?'"
      @cancel="resetShowModal"
      @confirm="save"
    />
  </div>
</template>

<script setup lang="ts">
// Imports
import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import {
  required,
  requiredUnless,
  maxLength,
  minLength,
  minValue,
  decimal,
  url
} from '@vuelidate/validators'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import { errorParser } from '@/utils'
import { useEventsStore, type Event as EventStore } from '@stores/events'
import ConfirmationModal from '@components/ConfirmationModal.vue'
import {
  useWebTemplatesStore,
  type WebTemplateUpdate,
  type WebTemplate,
  type WebTemplateCreate
} from '@/stores/web-templates'

// Variables
const useEvents = useEventsStore()
const useWebTemplates = useWebTemplatesStore()
const toast = useToast()
const router = useRouter()
const imagesTypes = 'image/png, image/jpeg, image/webp'

// Reactive
const loading = reactive({
  events: false
})
const eventsList = ref([] as EventStore[])
const state = reactive({
  name: '',
  description: '',
  events: [] as Number[],
  price: 0,
  link: '',
  mainImage: '', // URL
  additionalImages: [] as string[], // URLs
  mainImageFile: null as File | null, // File uploaded
  additionalImagesFiles: [] as File[] | [] // Files uploaded
})
const showModalConfirmationSave = ref(false)
let dataToSave = reactive({} as WebTemplateCreate)
const busy = ref(false)

// Props
const props = defineProps<{
  item?: WebTemplate | null //  Optional Event
}>()

// Validation
const rules = {
  name: { required, maxLength: maxLength(255), minLength: minLength(3) },
  description: { maxLength: maxLength(1000) },
  events: { required },
  price: { required, decimal, minValue: minValue(0) },
  link: { required, url },
  mainImageFile: { requiredUnless: requiredUnless(() => !!props?.item?.id) },
  additionalImagesFiles: {
    requiredUnless: requiredUnless(() => !!props?.item?.id),
    minLength: minLength(2),
    maxLength: maxLength(2)
  }
}
const v$ = useVuelidate(rules, state)

// References to state
const {
  name,
  description,
  events,
  price,
  link,
  mainImage,
  additionalImages,
  mainImageFile,
  additionalImagesFiles
} = toRefs(state)

// Computed properties to generate URLs
const mainImageFileUrl = ref('')
const getImageFileUrl = (file: File) => URL.createObjectURL(file)

// Functions
const onMainImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null

  if (!validateFile(file)) return

  state.mainImageFile = file ? file : null
  mainImageFileUrl.value = file ? URL.createObjectURL(file) : ''
}

const onAdditionalImagesChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ? target.files : [])

  if (!files.every((file) => validateFile(file))) return

  state.additionalImagesFiles = files ? files : []
}

const validateFile = (file: File | null): boolean => {
  if (!file) return false

  const allowedTypes = imagesTypes.split(', ').map((type) => type.trim())

  const maxSize = 5 * 1024 * 1024 // 5MB in bytes

  if (!allowedTypes.includes(file.type)) {
    toast.open({
      message: 'El archivo debe ser una imagen',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
    return false
  }

  if (file.size > maxSize) {
    toast.open({
      message: 'El archivo no debe pesar más de 5MB',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
    return false
  }

  return true // File is valid
}

const sendToTemplates = () => {
  router.push({ name: 'templates' })
}

const handleSave = async () => {
  const isFormCorrect = await v$.value.$validate()

  if (!isFormCorrect) return

  const data: WebTemplateCreate = {
    name: name.value,
    description: description.value,
    events: events.value.map((event) => Number(event)),
    price: price.value,
    link: link.value,
    mainImage: mainImageFile.value as File,
    additionalImages: [...additionalImagesFiles.value]
  }

  dataToSave = data

  showModalConfirmationSave.value = true

  return
}

const save = async () => {
  try {
    resetShowModal()

    busy.value = true

    if (props.item?.id) {
      const updateData: WebTemplateUpdate = {
        ...dataToSave,
        id: props.item.id
      }
      await useWebTemplates.updateWebTemplate(updateData)
    } else {
      const createData = {
        ...dataToSave
      }
      await useWebTemplates.createWebTemplate(createData)
    }
    dataToSave = {} as WebTemplateCreate

    toast.open({
      message: props.item?.id ? 'Plantilla actualizada' : 'Plantilla creada',
      type: 'success',
      position: 'top-right',
      dismissible: true
    })
  } catch (error) {
    toast.open({
      message: props.item?.id ? 'Error al actualizar plantilla' : 'Error al crear plantila',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    setTimeout(() => {
      busy.value = false
      sendToTemplates()
    }, 100)
  }
}

const resetShowModal = () => {
  showModalConfirmationSave.value = false
}

// Async functions
const getEvents = async () => {
  try {
    loading.events = true
    eventsList.value = await useEvents.getEvents()
  } catch (error) {
    toast.open({
      message: 'Error al obtener eventos',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    loading.events = false
  }
}

// Lifecycle
onMounted(() => {
  getEvents()

  // Revoke URLS when unmounting the component to avoid memory leaks
  if (mainImageFileUrl.value) URL.revokeObjectURL(mainImageFileUrl.value)
  state.additionalImagesFiles.forEach((file) => URL.revokeObjectURL(getImageFileUrl(file)))
})

// Watch for changes in props.item and update state
watch(
  () => props.item,
  (newItem) => {
    if (newItem?.id) {
      // Update state with the item data
      state.name = newItem.name || ''
      state.description = newItem.description || ''
      state.events =
        newItem.WebTemplateEvents.map((webTemplateEvent) => webTemplateEvent.event) || []
      state.price = newItem.price || 0
      state.link = newItem.link || ''
      state.mainImage = newItem.ThumbnailImage.link || ''
      state.additionalImages = newItem.Images.map((image) => image.link) || []
      state.mainImageFile = null // Clean previously selected main image
      state.additionalImagesFiles = [] // Clean previously selected additional images
    } else {
      // Reset state
      Object.assign(state, {
        name: '',
        description: '',
        events: [],
        price: 0,
        link: '',
        mainImage: '',
        additionalImages: [],
        mainImageFile: null,
        additionalImagesFiles: []
      })
    }
  },
  { immediate: true } // Run the watcher immediately
)
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

  .text-left {
    text-align: left;
  }

  .main-image {
    width: 350px;
    height: 200px;
    object-fit: cover;
    aspect-ratio: 350/200;
  }

  .additional-image {
    width: 320px;
    height: 170px;
    object-fit: cover;
  }
}
</style>
