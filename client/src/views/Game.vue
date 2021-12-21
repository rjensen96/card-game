<template>
  <div id="game-container">
    <table-set v-for="player in players" :key="player.name" :player="player" />
    <div id="hand">
      <own-hand />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OwnHand from "../components/game/OwnHand.vue";
import TableSet from "../components/game/TableSet.vue";
import { Player } from "../types/player";
export default Vue.extend({
  components: { OwnHand, TableSet },
  computed: {
    players(): Player[] {
      return this.$store.state.playersInRoom;
    },
  },
});
</script>

<style lang="scss" scoped>
// I should probably change this whole thing to use grid instead of flexbox.
//https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Introduction#grid_layout
#game-container {
  display: flex;
  margin: 70px 60px 150px 0px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

#hand {
  display: flex;
  background-color: white;
  position: fixed;
  height: 150px;
  bottom: 0px;
  width: 100vw;
  z-index: 0;
}
</style>
