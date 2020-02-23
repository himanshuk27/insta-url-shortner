import Vue from "vue";
import Vuex from "vuex";
import { authenticateAndSetToken, registerUser } from "./actions/LoginAction";
import { postRequest, getRequest } from "./actions/apiRequest";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

const ls = new SecureLS({ isCompression: false });
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userLoggedIn: false,
    authToken: null
  },
  plugins: [
    // persist vuex store data in encrypted local storage
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      }
    })
  ],
  mutations: {
    setAuthToken(state, authToken) {
      state.userLoggedIn = true;
      state.authToken = authToken;
    },
    logUserOut(state) {
      state.userLoggedIn = false;
      state.authToken = null;
    }
  },
  actions: {
    // login user and set token action
    loginUser: ({ commit }, userCreds) => {
      return new Promise((resolve, reject) => {
        authenticateAndSetToken(userCreds)
          .then(res => {
            commit("setAuthToken", res);
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    // send user registration request
    registerUser: (context, userCreds) => {
      return new Promise((resolve, reject) => {
        registerUser(userCreds)
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    // new post request
    postRequest: (context, payload) => {
      return new Promise((resolve, reject) => {
        postRequest(payload, context.state.authToken)
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    // new get request
    getRequest: (context, url) => {
      return new Promise((resolve, reject) => {
        getRequest(url, context.state.authToken)
          .then(res => {
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  },
  getters: {
    getAuthToken: state => {
      return state.authToken;
    }
  },
  modules: {}
});
