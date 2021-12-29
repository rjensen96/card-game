<template>
  <div>
    <proctor-board />
    <div id="game-container">
      <draw-discard />
      <div id="table-sets">
        <table-set
          v-for="player in players"
          :key="player.key"
          :player="player"
        />
      </div>
      <div id="hand">
        <own-hand />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DrawDiscard from "../components/game/DrawDiscard.vue";
import OwnHand from "../components/game/OwnHand.vue";
import ProctorBoard from "../components/game/ProctorBoard.vue";
import TableSet from "../components/game/TableSet.vue";
import { Player } from "../types/player";
export default Vue.extend({
  components: { OwnHand, TableSet, DrawDiscard, ProctorBoard },
  computed: {
    players(): Player[] {
      const players = this.$store.state.playersInRoom;
      // typescript sort of objects requires some verbosity.
      return players.sort((a: Player, b: Player) => {
        if (a.gamename < b.gamename) {
          return 1;
        } else if (a.gamename > b.gamename) {
          return -1;
        }
        return 0;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
// I should probably change this whole thing to use grid instead of flexbox.
//https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Introduction#grid_layout
#game-container {
  display: flex;
  margin: 20px 60px 150px 0px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

#table-sets {
  margin-left: 70px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
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
