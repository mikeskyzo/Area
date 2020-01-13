import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import vuetify from './plugins/vuetify'
import { sync } from 'vuex-router-sync'
import store from './store/store'
import JsonViewer from 'vue-json-viewer'

Vue.use(JsonViewer)

Vue.config.productionTip = false

sync(store, router)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
