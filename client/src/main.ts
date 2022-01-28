import Vue from "vue";
import App from "./App.vue";
// import router from "./router";
import store from "./store";
import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

Vue.config.productionTip = false;
// const socketConnection = SocketIO("http://localhost:8080");
const socketConnection = SocketIO("http://52.41.20.112:2105");
// const socketConnection = SocketIO("http://52.41.20.112:80"); // banned by firewell

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
  // router,
  store,
  sockets: {
    connect: function () {
      console.log("websocket connected");
    },
  },
  render: (h) => h(App),
}).$mount("#app");
