import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authToken: null
  },
  mutations: {
    login(state, token) {
      state.authToken = token;
    }
  },
  getters: {
    getToken: state => {
      return state.authToken;
    }
  },
  actions: {},
  modules: {}
});
