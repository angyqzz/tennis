import Vue from 'vue';
import App from './App.vue';

import Vuetify from 'vuetify';

Vue.use(Vuetify);

import router from './router';
import store from './store';

import 'vuetify/dist/vuetify.min.css';

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
