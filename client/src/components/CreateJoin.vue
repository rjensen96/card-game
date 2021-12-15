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
            v-model="roomCode"
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
      roomCode: "",
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
      // bail if values not supplied.
      // todo: refactor this and make a requests folder on client side.
      const url = `http://localhost:8080/rooms/${this.roomCode}/join`;
      const store = this.$store;

      async function requestJoin(socketId: string) {
        try {
          const resp = await axios.post(url, { socketId });
          if (resp.status === 200) {
            console.log("ok", resp.data);
            store.commit("setPlayersInRoom", resp.data.roomPlayerData);
            store.commit("setRoomCode", resp.data.roomId);
          } else {
            console.log(resp.status, resp.statusText);
          }
        } catch (error) {
          console.error(error);
        }
      }

      requestJoin(this.$socket.id);
      console.log("joining: ", this.$socket.id);

      // this.$socket.emit("joinRoom", payload);
      // this.$router.push("Game");
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

button {
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  height: 40px;
  width: 90px;
  font-size: 18px;
  cursor: pointer;
  transition-duration: 200ms;
}

button:hover {
  background-color: #54c558;
  transition: all;
  transition-duration: 300ms;
}
</style>
