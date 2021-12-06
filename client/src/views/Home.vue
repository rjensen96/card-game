<template>
  <div class="home">
    <h1>Join a room {{ this.getName }}</h1>
    <input type="text" placeholder="Name" /><br />
    <input type="text" placeholder="Room" /><br />
    <button v-on:click="pingServer">Join</button>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import io from "socket.io-client";

// below also does work and doesn't have the stupid vetur red underline.
export default Vue.extend({
  name: "Home",
  data() {
    return {
      socket: io(),
      users: [],
    };
  },
  created() {
    this.socket.on("usersUpdate", (data) => {
      console.log("from websocket:", data);
      this.users = data.users;
    });
  },
  computed: {
    getName(): string {
      return this.$store.state.name;
    },
  },
  methods: {
    pingServer(): void {
      console.log("emitting...");
      this.$socket.emit("blahdump", "WHAT");
    },
  },
});
</script>
