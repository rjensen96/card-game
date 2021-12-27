<template>
  <div
    class="gameCard"
    :id="this.cardData.key"
    :class="selectedClass"
    @click="selectCard"
  >
    <p :class="colorClass">{{ this.cardData.text }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Card } from "../../types/card";
export default Vue.component("phase-card", {
  name: "PhaseCard",
  //todo: prop should actually just be "cardData" and have that be of type Card
  props: ["text", "color", "value", "cardKey", "cardData", "selectable"],
  computed: {
    colorClass(): string {
      switch (this.cardData.color) {
        case 1:
          return "red";
        case 2:
          return "blue";
        case 3:
          return "yellow";
        case 4:
          return "green";
        default:
          return "black";
      }
    },
    selectedClass(): string {
      const selectedKeys = this.$store.state.selectedCards.map(
        (card: Card) => card.key
      );

      return selectedKeys.includes(this.cardData.key) ? "selected" : "";
    },
  },
  methods: {
    selectCard(): void {
      if (this.selectable) {
        this.$store.commit("selectCard", this.cardData.key);
      }
    },
  },
});
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap");

.red {
  color: rgb(255, 36, 36);
}

.blue {
  color: rgb(54, 16, 190);
}

.yellow {
  color: rgb(224, 248, 8);
}

.green {
  color: rgb(97, 241, 97);
}

.gameCard {
  height: 100px;
  min-width: 70px;
  margin: 0px 5px;
  display: flex;
  border-radius: 5px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
  border: 1px solid #dbdbdb;
  user-select: none;

  p {
    margin: auto;
    font-size: 40px;
    font-family: "Roboto", Arial, sans-serif;
  }
}

.selected {
  background-color: rgb(255, 255, 164);
}
</style>
