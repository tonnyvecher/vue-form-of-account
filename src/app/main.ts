import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@mdi/font/css/materialdesignicons.css'
import App from '../app/App.vue'

import vuetify from '../plugins/vuetify'

createApp(App).use(createPinia()).use(vuetify).mount('#app')
