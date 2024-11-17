import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueFeather from 'vue-feather'

// Vuetify
import vuetify from '@plugins/vuetify'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.component(VueFeather.name as string, VueFeather)

app.mount('#app')
