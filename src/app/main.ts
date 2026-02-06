import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const app = createApp(App)

app.use(createPinia())
app.use(createVuetify())

app.mount('#app')
