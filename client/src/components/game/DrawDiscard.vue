<template>
  <div class="drawDiscard">
    <p>Draw</p>
    <div @click="hitDraw()">
      <phase-card
        :selectable="false"
        :text="drawCard.text || null"
        :color="drawCard.color || null"
      />
    </div>

    <p>Discard</p>
    <div @click="hitDiscard()">
      <phase-card
        :selectable="false"
        :text="discardCard.text || null"
        :color="discardCard.color || null"
      />
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
      if (!this.$store.state.gameState.drew) {
        this.$socket.emit("takeCard", { pileName: "draw" });
      }
    },
    hitDiscard(): void {
      // if they already drew, send a discard request.
      if (this.$store.state.gameState.drew) {
        // todo: ensure only one card is selected.
        // if multiple are selected set a proctor message to tell them they can only select one.
        if (this.$store.state.selectedCards.length > 1) {
          this.$store.commit(
            "setProctorMessage",
            "You can only discard one card. Select a single card then try again."
          );
        } else {
          this.$socket.emit("discard", this.$store.state.selectedCards[0]);
          this.$store.commit("unSelectAllCards");
        }
      } else {
        // otherwise, ask to take the card.
        this.$socket.emit("takeCard", { pileName: "discard" });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.drawDiscard {
  position: fixed;
  left: 50px;
  top: 150px;

  p {
    margin: 20px 0px 0px 0px;
    padding: 0px;
  }
}
</style>
