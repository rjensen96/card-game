<template>
  <div :class="cardClass" :id="this.cardData.key" @dragstart="startDrag">
    <p :class="colorClass">{{ this.cardData.text }}</p>
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
      return this.baseClass + " " + this.selectedClass;
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

.red {
  color: rgb(255, 36, 36);
}

.blue {
  color: rgb(22, 33, 136);
}

.yellow {
  color: rgb(237, 43, 255);
}

.green {
  color: rgb(70, 243, 70);
}

.gameCard {
  height: 100px;
  min-width: 70px;
  margin: 0px 5px;
  display: flex;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #dddddd;
  user-select: none;

  p {
    margin: auto;
    font-size: 40px;
    font-family: "Roboto", Arial, sans-serif;
  }
}

.tableCard {
  height: 75px;
  width: 53px;
  background-color: white;
  border-radius: 5px;
  margin: 5px 4px;
  border: 1px solid #d1d1d1;
  display: flex;
  p {
    margin: auto;
    font-size: 30px;
    font-family: "Roboto", Arial, sans-serif;
  }
}

.selected {
  background-color: rgb(255, 255, 164);
}
</style>
