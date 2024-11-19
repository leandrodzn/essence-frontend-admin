<template>
  <main>
    <Title title="Editar plantilla" />
    <div class="container-content">
      <WebTemplateForm :item="webTemplateItem" />
    </div>
  </main>
</template>
<script setup lang="ts">
import Title from '@/components/Title.vue'
import WebTemplateForm from '@/forms/WebTemplateForm.vue'
import { useWebTemplatesStore, type WebTemplate } from '@/stores/web-templates'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'

// Variables
const useWebTemplates = useWebTemplatesStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const busy = ref(false)

const webTemplateItem = ref({} as WebTemplate)

// Functions
const getWebTemplate = async () => {
  try {
    busy.value = true

    let idValue = route.params.id

    if (!idValue || !Number.isInteger(Number(idValue))) {
      router.push({ name: 'templates' })
      return
    }

    let id = Number(idValue)

    const webTemplate = await useWebTemplates.getOneWebTemplate(id)

    webTemplateItem.value = webTemplate
  } catch (error) {
    // If the error is a NotFound error, redirect to the templates view
    if ((error as { name: string })?.name === 'NotFound') {
      toast.open({
        message: 'Plantilla no encontrada',
        type: 'error',
        position: 'top-right',
        dismissible: true
      })
      router.push({ name: 'templates' })
      return
    } else {
      // If the error is not a NotFound error, show a toast with the error
      toast.open({
        message: 'Error al obtener plantilla',
        type: 'error',
        position: 'top-right',
        dismissible: true
      })
    }
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  getWebTemplate()
})
</script>
<style lang="scss" scoped>
.container-content {
  // align-items: start;
  width: 100%;
  background-color: #ede6de;
  margin-bottom: 20px;
  padding: 45px 30px 15px 30px;
}
</style>
