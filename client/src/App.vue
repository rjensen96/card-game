<template>
  <div id="app">
    <create-join v-if="notInRoom" />
    <waiting-room v-else-if="inRoom" />
    <game v-else-if="gameStarted" />
    <game-results v-else-if="gameOver" />
  </div>
</template>

<script lang="ts">
import io from "socket.io-client";
import { Vue } from "vue-property-decorator";
import CreateJoin from "./components/CreateJoin.vue";

import Game from "./views/Game.vue";
import GameResults from "./views/GameResults.vue";
import WaitingRoom from "./views/WaitingRoom.vue";

export default Vue.extend({
  components: { CreateJoin, WaitingRoom, Game, GameResults },

  name: "Home",
  data() {
    return {
      socket: io(),
    };
  },
  computed: {
    notInRoom(): boolean {
      return this.$store.state.roomId === "";
    },
    inRoom(): boolean {
      return this.$store.state.roomId !== "" && !this.$store.state.gameState;
    },
    gameStarted(): boolean {
      const { gameState } = this.$store.state;
      return gameState && !gameState.gameIsOver;
    },
    gameOver(): boolean {
      const { gameState } = this.$store.state;
      return gameState && gameState.gameIsOver;
    },
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;400;500;700&display=swap");

#app {
  font-family: Poppins, "IBM Plex Sans", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
}

#nav {
  position: fixed;
  right: 0px;
  top: 0px;
  bottom: 0px;
  background-color: white;
  z-index: 10;

  border-left: 1px solid #cecece;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

button {
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  height: 40px;
  min-width: 90px;
  margin: 0px 20px;
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
