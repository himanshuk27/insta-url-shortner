import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./quasar";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

// set axios base url to our api server endpoint
axios.defaults.baseURL = process.env.VUE_APP_APIENDPOINT;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
