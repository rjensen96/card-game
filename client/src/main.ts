import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

Vue.config.productionTip = false;
const socketConnection = SocketIO("http://localhost:3000");

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socketConnection,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

new Vue({
  router,
  store,
  sockets: {
    connect: function () {
      console.log("ws connected!");
    },
    roomNotification: function (data) {
      console.log("roomNotification:", data);
    },
    joinConfirmation: function (data) {
      console.log("joinConfirmation:", data);
    },
  },
  render: (h) => h(App),
}).$mount("#app");
