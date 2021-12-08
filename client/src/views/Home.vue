<template>
  <div class="home">
    <h1>Join a room {{ this.getName }}</h1>
    <input type="text" placeholder="Name" v-model="user" /><br />
    <input type="text" placeholder="Room" v-model="room" /><br />
    <button v-on:click="joinRoom()">Join</button>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import io from "socket.io-client";

export default Vue.extend({
  name: "Home",
  data() {
    return {
      socket: io(),
      user: "",
      room: "",
    };
  },
  computed: {
    getName(): string {
      return this.$store.state.name;
    },
  },
  methods: {
    joinRoom(): void {
      if (!this.user || !this.room) {
        // bail if values not supplied.
        return;
      }

      const payload = {
        user: this.user,
        room: this.room,
      };
      this.$socket.emit("joinRoom", payload);
      this.$router.push("About");
    },
  },
});
</script>
