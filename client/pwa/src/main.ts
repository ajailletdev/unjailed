import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import Vuetify from 'vuetify'
import vuetify from './plugins/vuetify'
import { tokenRequestInterceptor, tokenResponseInterceptor } from './interceptors/http-auth.interceptor'

Vue.use(Vuetify);
Vue.use(VueAxios, axios);

axios.interceptors.request.use(tokenRequestInterceptor);
//TODO: better
axios.interceptors.response.use(tokenResponseInterceptor);


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

