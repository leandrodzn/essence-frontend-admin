import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VueFeather from 'vue-feather'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component(VueFeather.name as string, VueFeather)

app.mount('#app')
