<template>
  <div class="home">
    <h1>Phase 10</h1>
    <div class="content">
      <div class="rightborder">
        <h2>Create a room</h2>
        <button v-on:click="createRoom()">Create</button>
      </div>
      <div>
        <h2>Join a room</h2>
        <div class="flex-center">
          <input
            type="text"
            placeholder="Code"
            v-model="roomId"
            :maxlength="4"
          />
          <button v-on:click="joinRoom()">Join</button>
        </div>
        <p v-if="this.codeIsInvalid" id="join-error">Invalid room code</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import io from "socket.io-client";
import axios from "axios";

export default Vue.component("create-join", {
  name: "CreateJoin",
  data() {
    return {
      socket: io(),
      roomId: "",
      joinDisabled: true,
      codeIsInvalid: false,
    };
  },
  computed: {
    getName(): string {
      return this.$store.state.name;
    },
  },
  methods: {
    joinRoom(): void {
      console.log("joining room: ", this.roomId);
      this.$socket.emit("joinRoom", { roomId: this.roomId });
    },
    createRoom(): void {
      this.$socket.emit("createRoom");
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h2 {
  font-size: 50px;
}

.content {
  text-align: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 100px 0px;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

#join-error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

.rightborder {
  border-right: 1px solid #999999;
}

input {
  height: 20px;
  border: 1px solid #999999;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 20px;
  width: 80px;
  padding: 10px;
  text-transform: uppercase;
  text-align: center;
}
</style>
