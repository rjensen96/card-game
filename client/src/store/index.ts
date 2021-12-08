import { getEmptyChatMessageArray } from "@/types/chat-message";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: "",
    room: "",
    chats: getEmptyChatMessageArray(),
  },
  mutations: {
    setUserRoom(state, data) {
      state.user = data.user;
      state.room = data.room;
      console.log("updated vuex!");
    },
    addChatMessage(state, data) {
      state.chats.push(data);
    },
  },
  actions: {
    SOCKET_joinConfirmation({ commit }, data) {
      commit("setUserRoom", data);
    },
    SOCKET_chatMessage({ commit }, data) {
      commit("addChatMessage", data);
    },
  },
  modules: {},
});
