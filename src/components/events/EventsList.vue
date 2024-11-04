<template>
  <div>
    <!-- Loading... -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <!-- Button to add a new event -->
      <div class="text-center my-4 d-flex align-items-center justify-content-center">
        <button
          class="btn btn-primary d-flex align-items-center justify-content-center"
          title="Agregar"
          @click="createEvent"
        >
          <vue-feather type="plus" size="20px" stroke="white" />
        </button>
      </div>
      <!-- Table with events -->
      <table v-if="events.length" class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col" class="col-name">Nombre</th>
            <th scope="col" class="col-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.name }}</td>
            <td class="d-flex align-items-center justify-content-start">
              <button
                class="btn btn-primary btn-sm m-2 d-flex align-items-center justify-content-center"
                title="Editar"
                @click="() => editEvent(event)"
              >
                <vue-feather type="edit" size="20px" stroke="white" />
              </button>
              <button
                class="btn btn-dark btn-sm d-flex align-items-center justify-content-center"
                title="Eliminar"
                :disabled="event.busy"
                @click="() => showModalConfirmationDelete(event)"
              >
                <vue-feather type="trash-2" size="20px" stroke="white" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center my-4">No se encontraron eventos.</div>
    </div>

    <!-- Modal Event -->
    <EventFormModal v-if="showModalEvent" :item="eventItem" @close="onCloseModalEvent" />

    <!-- Modal Confirmation Delete -->
    <ConfirmationModal
      v-if="showModalEventDelete"
      :title="'Eliminar evento'"
      :message="'¿Está seguro de eliminar este evento?'"
      @cancel="resetEventDelete"
      @confirm="deleteEvent"
    />
  </div>
</template>
<script setup lang="ts">
// Imports
import { ref, onMounted } from 'vue'
import { useEventsStore, type Event } from '@stores/events'
import { useToast } from 'vue-toast-notification'
import EventFormModal from '@/forms/EventFormModal.vue'
import ConfirmationModal from '@components/ConfirmationModal.vue'

// Variables
const useEvents = useEventsStore()
const toast = useToast()
const loading = ref(false)
const events = ref<EventListItem[]>([])
const showModalEvent = ref(false)
const eventItem = ref<Event | undefined | null>(null)
const showModalEventDelete = ref(false)
const eventItemToDelete = ref<EventListItem | undefined | null>(null)

// Types
interface EventListItem extends Event {
  busy: boolean
}

// Functions
const getEvents = async () => {
  try {
    loading.value = true
    const fetchedEvents = await useEvents.getEvents()

    events.value = fetchedEvents.map((event) => ({
      ...event,
      busy: false
    }))
  } catch (error) {
    toast.open({
      message: 'Error al obtener eventos',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    loading.value = false
  }
}

const showModalEventFunction = () => {
  showModalEvent.value = true
}

const createEvent = () => {
  eventItem.value = null
  showModalEventFunction()
}

const editEvent = (event: Event) => {
  eventItem.value = event
  showModalEventFunction()
}

const onCloseModalEvent = (refresh: Boolean) => {
  showModalEvent.value = false
  if (refresh) {
    getEvents()
  }
}

const showModalConfirmationDelete = (event: EventListItem) => {
  if (!event?.id) return

  eventItemToDelete.value = event
  showModalEventDelete.value = true
}

const resetEventDelete = () => {
  showModalEventDelete.value = false
  eventItemToDelete.value = null
}

const deleteEvent = async () => {
  if (!eventItemToDelete.value?.id) return

  try {
    eventItemToDelete.value.busy = true
    await useEvents.deleteEvent(eventItemToDelete.value.id)
    toast.open({
      message: 'Evento eliminado',
      type: 'success',
      position: 'top-right',
      dismissible: true
    })
    getEvents()
  } catch (error) {
    toast.open({
      message: 'Error al eliminar evento',
      type: 'error',
      position: 'top-right',
      dismissible: true
    })
  } finally {
    eventItemToDelete.value.busy = false
    resetEventDelete()
  }
}

// Lifecycle
onMounted(() => {
  getEvents()
})
</script>
<style lang="scss" scoped>
.col-name {
  width: 70%;
}

.col-actions {
  width: 30%;
}

.col-name,
.col-actions {
  font-weight: bold;
}
</style>
