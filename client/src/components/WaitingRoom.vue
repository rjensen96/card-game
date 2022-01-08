<template>
  <div>
    <p id="roomIdLabel">Room code</p>
    <h1 id="roomId">{{ getRoomId }}</h1>
    <proctor-board />
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
import ProctorBoard from "./game/ProctorBoard.vue";

// todo: use vuetify https://vuetifyjs.com/en/components/icons/

export default Vue.component("waiting-room", {
  name: "WaitingRoom",

  data() {
    return {
      socket: io(),
      nameInput: "",
    };
  },
  components: {
    WaitingPersona,
    ProctorBoard,
  },
  computed: {
    getRoomId(): string {
      return this.$store.state.roomId;
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
    confirmedName(): boolean {
      return this.$store.state.gamename !== "";
    },
  },
  methods: {
    confirmName(): void {
      // validate name.
      const isLetters = (str: string) => {
        return [...str.toUpperCase()].every((chr) => chr >= "A" && chr <= "Z");
      };

      this.$store.commit("setProctorMessage", "");

      if (isLetters(this.nameInput)) {
        const playerId = this.$store.state.playerId;
        this.$socket.emit("setGamename", {
          gamename: this.nameInput,
          playerId,
        });
        // this.$store.commit("setGamename", this.nameInput);
        // this.confirmedName = true;
      }
    },
    startGame(): void {
      const playerId = this.$store.state.playerId;
      this.$socket.emit("startGame", { playerId });
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#roomIdLabel {
  font-size: 30px;
  margin: 60px 0px 0px 0px;
}

#roomId {
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
  justify-content: center;
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
