<template>
  <div>
    <div class="flex">
      <game-settings />
      <section id="playerList">
        <p id="roomIdLabel">Room code</p>
        <h1 id="roomId">{{ getRoomId }}</h1>
        <div id="nameForm" v-if="!confirmedName">
          <input
            type="text"
            placeholder="Your name"
            :maxlength="10"
            v-model="nameInput"
          />
          <button @click="confirmName()">Confirm</button>
          <proctor-board />
        </div>
        <div class="personas">
          <waiting-persona
            v-for="player in playersInRoom"
            :player="player"
            :key="player.key"
          />
        </div>

        <button id="start" :disabled="startIsDisabled" @click="startGame()">
          Start
        </button>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import io from "socket.io-client";
import { Player } from "../types/player";
import WaitingPersona from "../components/waiting-room/WaitingPersona.vue";
import ProctorBoard from "../components/common/ProctorBoard.vue";
import GameSettings from "../components/waiting-room/GameSettings.vue";

// todo: use vuetify https://vuetifyjs.com/en/components/icons/

export default Vue.component("waiting-room", {
  name: "WaitingRoom",
  data() {
    return {
      socket: io(),
      nameInput: "",
      prevNumPlayers: 1,
    };
  },
  components: {
    WaitingPersona,
    ProctorBoard,
    GameSettings,
  },
  computed: {
    getRoomId(): string {
      return this.$store.state.roomId;
    },
    playersInRoom(): Player[] {
      return this.$store.state.playersInRoom;
    },
    numPlayers(): number {
      return this.$store.state.playersInRoom.length;
    },
    startIsDisabled(): boolean {
      const players: Player[] = this.$store.state.playersInRoom;
      const rv: boolean =
        players.length < 2 ||
        // players.length > 6 ||
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
      const phases = this.$store.state.gameSettings.phases;
      this.$socket.emit("startGame", { playerId, phases });
    },
  },
  updated() {
    // when a new player joins, creator should broadcast the current settings.
    // this component updates when a new player joins, so we will send the data from here.
    const { isCreator, playerId } = this.$store.state;
    if (this.numPlayers > this.prevNumPlayers && isCreator) {
      // ensure that the update was due to an increase in the number of players (a join)
      this.prevNumPlayers = this.numPlayers;

      const { phases, presetName } = this.$store.state.gameSettings;

      console.log("sending settings...", phases);
      this.$socket.emit("gameSettings", { phases, presetName, playerId });
    }
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

#playerList {
  width: 100%;
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

.flex {
  display: flex;
}

.bottomRow {
  position: fixed;
  bottom: 50px;
  width: 100vw;
}

.personas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 40px;
}

#start {
  // margin: 0px auto;
  height: 80px;
  width: 150px;
  font-size: 40px;
}

#start:disabled {
  background-color: gray;
  cursor: auto;
}
</style>
