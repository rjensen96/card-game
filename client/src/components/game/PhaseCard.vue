<template>
  <div class="card">
    <p :class="colorClass">{{ this.text }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.component("phase-card", {
  name: "PhaseCard",
  props: ["text", "color", "value"],
  computed: {
    colorClass(): string {
      switch (this.color) {
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
  },
});
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap");

.red {
  color: rgb(179, 1, 1);
}

.blue {
  color: rgb(54, 16, 190);
}

.yellow {
  color: rgb(238, 241, 37);
}

.green {
  color: rgb(11, 136, 11);
}

.card {
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
</style>
