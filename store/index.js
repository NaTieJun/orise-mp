import Vue from "vue";
import Vuex from "vuex";
import storage from "@/utils/storage";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    verificationKey: "", 
    distributionId:"", 
    hasLogin: storage.getHasLogin(),
    userInfo: storage.getUserInfo(),
    uuid: storage.getUuid(),
    token: "",
  },
  mutations: {
    login(state, userInfo) {
      state.userInfo = userInfo || {};
      state.userName =
        userInfo.Name || userInfo.Nickname || userInfo.Username || "匿名用户";
      state.hasLogin = true;
    },
    logout(state) {
      state.userName = "";
      state.hasLogin = false;
    },
  },
  actions: {},
});

export default store;
