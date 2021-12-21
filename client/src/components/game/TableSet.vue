<template>
  <div class="container">
    <h2>{{ displayName }}</h2>
    <div class="cardArea">
      <div class="cardSet" v-for="(phaseSet, idx) in phase" :key="idx">
        <div class="tableCard" v-for="(card, x) in phaseSet.size" :key="x" />
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
});
</script>

<style lang="scss" scoped>
.container {
  text-align: left;
  margin: 40px;

  h2 {
    margin: 0px 0px 0px 20px;
    padding: 0px;
  }
}
.cardArea {
  display: flex;
  background-color: #ededed;
  border-radius: 6px;
}
.cardSet {
  display: flex;
  margin: 20px;
}

.tableCard {
  height: 75px;
  width: 53px;
  background-color: white;
  border-radius: 3px;
  margin: 5px;
  border: 1px solid #d1d1d1;
}
</style>
