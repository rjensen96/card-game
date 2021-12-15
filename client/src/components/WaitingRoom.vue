<template>
  <div>
    <p id="roomCodeLabel">Room code</p>
    <h1 id="roomCode">{{ getRoomCode }}</h1>
    <div id="nameForm" v-if="!confirmedName">
      <input
        type="text"
        placeholder="Your name"
        :maxlength="10"
        v-model="nameInput"
      />
      <button @click="confirmName()">Confirm</button>
    </div>
    <div v-for="player in playersInRoom" :key="player.key">
      <p>NAME: {{ player.gamename }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import io from "socket.io-client";
import { Player } from "../types/player";
// todo: use vuetify https://vuetifyjs.com/en/components/icons/

export default Vue.component("waiting-room", {
  name: "WaitingRoom",
  data() {
    return {
      socket: io(),
      confirmedName: false,
      nameInput: "",
    };
  },
  computed: {
    getRoomCode(): string {
      return this.$store.state.roomCode;
    },
    playersInRoom(): Player[] {
      return this.$store.state.playersInRoom;
    },
  },
  methods: {
    confirmName(): void {
      // validate name.
      const isLetters = (str: string) => {
        return [...str.toUpperCase()].every((chr) => chr >= "A" && chr <= "Z");
      };

      if (isLetters(this.nameInput)) {
        console.log("confirming: ", this.$socket.id);
        this.$socket.emit("setGamename", { gamename: this.nameInput });
        console.log("postconfirm: ", this.$socket.id);
        this.confirmedName = true;
      }
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#roomCodeLabel {
  font-size: 30px;
  margin: 60px 0px 0px 0px;
}

#roomCode {
  font-size: 80px;
  margin: 10px 0px 50px 0px;
}

#nameForm {
  p {
    font-size: 20px;
  }

  input {
    width: 170px;
    font-size: 25px;
    border-radius: 20px;
    border: 1px solid rgb(107, 107, 107);
    padding: 5px 15px;
    text-align: center;
  }
}
</style>
