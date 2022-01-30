<template>
  <div :class="cardClass" :id="this.cardData.key" @dragstart="startDrag">
    <p>{{ this.cardData.text }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.component("phase-card", {
  name: "PhaseCard",
  props: ["cardData", "baseClass"],

  computed: {
    colorClass(): string {
      switch (this.cardData.color) {
        case 0:
          return "wild";
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
    cardClass(): string {
      return this.baseClass + " " + this.selectedClass + " " + this.colorClass;
    },
    selectedClass(): string {
      const { selectedCardKeys } = this.$store.state;
      return selectedCardKeys[this.cardData.key] ? "selected" : "";
    },
  },
  methods: {
    startDrag(event: any) {
      // emit this key up to OwnHand so that we can splice it out and say it is dragging.
      this.$emit("startDrag", { event, card: this.cardData });
    },
  },
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap");

$red-card: #f03a15;
$blue-card: #7184fa;
$yellow-card: #e8d631;
$green-card: #2bd670;
$black-card: #505050;

$orange-card: #ffb900;
$pink-card: #e024d4;

// todo: there needs to be a "wild" color class, and that's the rainbow thing.
// then have "black" be just a gray blank thing which is empty.
// right now an empty discard pile shows the wild color.

.red {
  background-color: $red-card;
  border: 4px solid $red-card;
}

.blue {
  background-color: $blue-card;
  border: 4px solid $blue-card;
}

.yellow {
  background-color: $yellow-card;
  border: 4px solid $yellow-card;
}

.green {
  background-color: $green-card;
  border: 4px solid $green-card;
}

.wild {
  background: linear-gradient(335deg, $orange-card 0%, $pink-card 70%);
  padding: 4px;
}

.black {
  background-color: $black-card;
  border: 1px solid black;
}

.gameCard {
  height: 90px;
  min-width: 60px;
  margin: 0px 5px;
  display: flex;
  border-radius: 5px;
  // box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  // border: 1px solid #dddddd;
  user-select: none;

  p {
    margin: auto;
    font-size: 40px;
    font-family: "Roboto", Arial, sans-serif;
    color: rgb(255, 255, 255);
  }
}

.tableCard {
  height: 60px;
  width: 42px;
  // background-color: white;
  border-radius: 5px;
  margin: 5px 4px;
  color: white;
  // border: 1px solid #d1d1d1;

  display: flex;

  &.white {
    background-color: white;
    border: 1px solid #d1d1d1;
  }

  p {
    margin: auto;
    font-size: 30px;
    font-family: "Roboto", Arial, sans-serif;
  }
}

.selected {
  // background-color: rgb(255, 255, 164);
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.4);
  // padding-bottom: 4px;
  // margin-bottom: 15px;
  border: 4px solid yellow;
  padding: 0px; // fixes discrepancy in size of wild cards (gradients messy)
}
</style>
