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
    usersUpdate: function (data) {
      // console.log("the users data thing!", data);
    },
  },
  render: (h) => h(App),
}).$mount("#app");
