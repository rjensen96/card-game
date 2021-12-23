<template>
  <div class="container">
    <h2>{{ displayName }}</h2>
    <div class="cardArea">
      <div class="cardSet" v-for="(phaseItem, idx) in phase" :key="idx">
        <p>{{ setLabel(phaseItem) }}</p>
        <div class="cards">
          <div class="tableCard" v-for="(card, x) in phaseItem.size" :key="x" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { phases } from "../../types/phases";
export default Vue.component("table-set", {
  name: "TableSet",
  props: ["player"],
  computed: {
    phase() {
      const phase = this.player.phase;
      return phases[phase];
    },
    displayName() {
      return this.player.gamename === this.$store.state.gamename
        ? `${this.player.gamename} (You)`
        : this.player.gamename;
    },
  },
  methods: {
    setLabel(phaseItem) {
      if (phaseItem.pattern === "color") {
        return `${phaseItem.size} cards of one color`;
      }
      return `${phaseItem.pattern} of ${phaseItem.size}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  text-align: left;
  margin: 40px;

  h2 {
    margin: 0px 0px 10px 20px;
    padding: 0px;
  }
}
.cardArea {
  display: flex;
  border-radius: 10px;
  overflow: hidden;

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
      font-weight: 600;
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
