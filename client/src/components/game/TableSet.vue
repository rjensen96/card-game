<template>
  <div class="container">
    <div class="headerData">
      <h2>{{ displayName }}</h2>
      <h2 class="score">Score: {{ this.player.points }}</h2>
      <h2 class="score">Phase {{ currentPhase }}</h2>
    </div>
    <div class="cardArea">
      <div
        class="cardSet"
        v-for="(phaseItem, phaseIndex) in this.player.phase"
        :key="phaseIndex"
        @click="playSelectedCards(phaseIndex)"
      >
        <p>{{ setLabel(phaseItem) }}</p>

        <!-- Render blank cards if phase doesn't have cards played -->
        <div v-if="!phaseItem.cards.length" class="cards">
          <div class="tableCard" v-for="(card, x) in phaseItem.size" :key="x" />
        </div>

        <!-- Render cards played on phase if they exist -->
        <div v-else class="cards">
          <phase-card
            v-for="card in phaseItem.cards"
            :cardData="card"
            :key="card.key"
            :baseClass="'tableCard'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

// todo: add some feature banning the playage on other peoples sets if current player hasn't completed their phase
// (still need to validate that on server side, but helps gameplay ease)

// TODO: the bug here is that the computed phase() prop is no good
// need to use the phase object attached to the player prop.

export default Vue.component("table-set", {
  name: "TableSet",
  props: ["player"],
  computed: {
    phase() {
      return this.player.phase;
    },
    displayName() {
      return this.player.gamename === this.$store.state.gamename
        ? `${this.player.gamename} (You)`
        : this.player.gamename;
    },
    currentPhase() {
      return this.player.phaseNumber;
    },
  },
  methods: {
    setLabel(phaseItem) {
      if (phaseItem.pattern === "color") {
        return `${phaseItem.size} cards of one color`;
      }
      return `${phaseItem.pattern} of ${phaseItem.size}`;
    },
    playSelectedCards(phaseIndex) {
      const { drew } = this.$store.state.gameState;
      const { selectedCardKeys, hand, playerId } = this.$store.state;

      if (!drew) {
        return this.$store.commit(
          "setProctorMessage",
          "You must draw before playing cards. Take a card from the draw or discard pile!"
        );
      }

      const cards = hand.filter((card) => selectedCardKeys[card.key]);
      const payload = {
        playerId,
        gamename: this.player.gamename,
        phaseIndex,
        cards,
      };

      this.$socket.emit("playCards", payload);
      this.$store.commit("unSelectAllCards");
    },
    removePlayedCards(phaseItem) {
      console.log("hit remove");
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  text-align: left;
  margin: 20px 50px;

  .headerData {
    display: flex;
    justify-content: space-between;

    h2 {
      margin: 0px 20px 10px 20px;
      padding: 0px;
      font-weight: 500;
      font-size: 22px;
      &.score {
        color: rgb(151, 151, 151);
      }
    }
  }
}
.cardArea {
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;

  .cardSet {
    padding: 15px;
    background-color: #ededed;
    transition: 200ms;

    &:hover {
      background-color: #d3f18b;
      transition: 300ms;
    }

    p {
      padding: 0px;
      margin: 0px 10px;
      color: #8f8f8f;
      text-transform: uppercase;
      font-weight: 500;
      font-size: 10pt;
    }
    .cards {
      display: flex;
    }

    .tableCard {
      height: 75px;
      width: 53px;
      background-color: white;
      border-radius: 5px;
      margin: 5px 4px;
      border: 1px solid #d1d1d1;
    }
  }
}
</style>
