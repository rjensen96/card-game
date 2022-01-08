<template>
  <div class="drawDiscard">
    <p>Draw</p>
    <div @click="hitDraw()" class="pileCard">
      <phase-card :cardData="drawCard" :baseClass="'gameCard'" />
    </div>

    <p>Discard</p>
    <div @click="hitDiscard()" class="pileCard">
      <phase-card :cardData="discardCard" :baseClass="'gameCard'" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PhaseCard from "./PhaseCard.vue";
import { Card } from "../../types/card";

export default Vue.component("draw-discard", {
  name: "DrawDiscard",
  components: { PhaseCard },
  computed: {
    drawCard(): Card {
      return this.$store.state.drawCard || {};
    },
    discardCard(): Card {
      return this.$store.state.discardCard || {};
    },
  },
  methods: {
    hitDraw(): void {
      // if they haven't drawn, send a take card
      // otherwise, don't send anything.
      const { playerId, gameState } = this.$store.state;
      if (!gameState.drew) {
        this.$socket.emit("takeCard", { pileName: "draw", playerId });
      }
    },
    hitDiscard(): void {
      // if they already drew, send a discard request.
      // otherwise, draw the card.

      const { playerId, selectedCardKeys, hand, gameState } = this.$store.state;

      const selectedCards = hand.filter(
        (card: Card) => selectedCardKeys[card.key]
      );

      if (gameState.drew && selectedCards.length === 1) {
        this.$socket.emit("discard", {
          card: selectedCards[0],
          playerId,
        });
      } else if (gameState.drew && selectedCards.length > 1) {
        this.$store.commit(
          "setProctorMessage",
          "You can only discard one card. Select a single card then try again."
        );
      } else if (gameState.drew && !selectedCards.length) {
        this.$store.commit(
          "setProctorMessage",
          "Please select a single card to discard and try again."
        );
      } else if (!gameState.drew) {
        this.$socket.emit("takeCard", { pileName: "discard", playerId });
      }

      this.$store.commit("unSelectAllCards");
    },
  },
});
</script>

<style lang="scss" scoped>
.drawDiscard {
  position: fixed;
  left: 50px;
  top: 150px;
  .pileCard {
    cursor: pointer;
  }
  p {
    margin: 20px 0px 0px 0px;
    padding: 0px;
  }
}
</style>
