<template>
  <div>
    <h1>Results</h1>
    <div class="throne">
      <div id="crown">
        <chess-king :size="150" />
      </div>
      <span>
        {{ winner.gamename[0] }}
      </span>
      <p>{{ winner.gamename }} wins!</p>
    </div>

    <div class="container">
      <table>
        <tr>
          <th class="playerName">Player</th>
          <th>Points</th>
          <th>Completed</th>
        </tr>

        <tr v-for="player in players" :key="player.key">
          <td class="playerName">{{ player.gamename }}</td>
          <td>{{ player.points }}</td>
          <td>{{ completionPercent(player) }}%</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Player } from "../types/player";
import ChessKing from "vue-material-design-icons/ChessKing.vue";
export default Vue.extend({
  components: { ChessKing },
  data() {
    return {
      crownCycle: 0,
    };
  },
  mounted() {
    window.setInterval(this.floatCrown, 100);
  },
  computed: {
    players(): Player[] {
      const players = this.$store.state.playersInRoom;
      // typescript sort of objects requires some verbosity.
      return players.sort((a: Player, b: Player) => {
        if (a.points > b.points) {
          return 1;
        } else if (a.points < b.points) {
          return -1;
        }
        return 0;
      });
    },
    winner(): Player {
      const players = this.players;

      let winnerIdx = 0;
      let minPoints = players[0].points;

      for (let i = 0; i < this.players.length; i++) {
        if (players[i].points < minPoints) {
          winnerIdx = i;
          minPoints = players[i].points;
        }
      }

      return players[winnerIdx];
    },
  },
  methods: {
    completionPercent(player: Player): number {
      return (player.phaseNumber / 10) * 100;
    },
    floatCrown() {
      const crown = document.getElementById("crown");
      if (!crown) {
        return;
      }
      // todo: this just moves everything else down, so the crown appears fixed
      // I'll need to look more into this, but for now it's not terribly relevant.
      //   crown.style.marginBottom = 1 + this.crownCycle + "px";
      this.crownCycle++;
    },
  },
});
</script>

<style lang="scss" scoped>
.throne {
  #crown {
    color: gold;
  }
  span {
    font-size: 150px;
    font-weight: bold;
    line-height: 120px;
    margin: 0px;
  }

  p {
    font-size: 30px;
  }
}

.container {
  margin: auto;
  max-width: 600px;
}

table {
  margin-top: 50px;
  text-align: left;
  width: 100%;
  border-spacing: 0 0;
  user-select: none;

  th {
    text-align: center;
    font-size: 16px;
    background-color: white;
    padding: 0px 10px;
    &.playerName {
      text-align: left;
    }
  }

  tr {
    margin: 10px;
    border-bottom: 1px solid black;
    padding: 20px;
    &:hover {
      background-color: rgb(240, 240, 240);
    }
  }

  td {
    text-align: center;
    font-size: 30px;
    padding: 20px 10px;

    &.playerName {
      text-align: left;
      font-weight: 600;
    }
  }

  p {
    margin: 0px;
  }
}
</style>
