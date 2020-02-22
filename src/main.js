require("dotenv").config();
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./quasar";
import axios from "axios";

const apiPort = process.env.API_PORT | 3000;
Vue.use({
  install(Vue) {
    Vue.prototype.$api = axios.create({
      baseURL: `http://localhost:${apiPort}/api/`
    });
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
