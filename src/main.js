import Vue from 'vue'
import VueCompositionAPI, { createApp, h } from '@vue/composition-api'
import vuetify from '@/plugins/vuetify' // path to vuetify export

import App from './App.vue'
import router from './router'


Vue.use(VueCompositionAPI)
// Vue.use(Vuetify)

const app = createApp({
  router,
  vuetify,
  render: () => h(App)
})
// app.use(vuetify)
app.mount('#app')

