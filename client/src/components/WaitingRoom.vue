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
    <div class="personas">
      <waiting-persona
        v-for="player in playersInRoom"
        :player="player"
        :key="player.key"
      />
    </div>
    <div class="bottomRow">
      <button id="start" :disabled="startIsDisabled" @click="startGame()">
        Start
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import io from "socket.io-client";
import { Player } from "../types/player";
import WaitingPersona from "./WaitingPersona.vue";

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
  components: {
    WaitingPersona,
  },
  computed: {
    getRoomCode(): string {
      return this.$store.state.roomCode;
    },
    playersInRoom(): Player[] {
      return this.$store.state.playersInRoom;
    },
    startIsDisabled(): boolean {
      const players: Player[] = this.$store.state.playersInRoom;
      const rv: boolean =
        players.length < 2 ||
        players.length > 6 ||
        players.some((player) => player.gamename === "");

      return rv;
    },
  },
  methods: {
    confirmName(): void {
      // validate name.
      const isLetters = (str: string) => {
        return [...str.toUpperCase()].every((chr) => chr >= "A" && chr <= "Z");
      };

      if (isLetters(this.nameInput)) {
        this.$socket.emit("setGamename", { gamename: this.nameInput });
        this.$store.commit("setGamename", this.nameInput);
        this.confirmedName = true;
      }
    },
    startGame(): void {
      this.$socket.emit("startGame", true);
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

.bottomRow {
  position: fixed;
  bottom: 50px;
  width: 100vw;
}

.personas {
  display: flex;
  justify-content: space-around;
}

#start {
  margin: 0px auto;
  height: 100px;
  width: 200px;
  font-size: 50px;
  bottom: 50px;
}

#start:disabled {
  background-color: gray;
  cursor: auto;
}
</style>
