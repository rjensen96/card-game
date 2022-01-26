<template>
  <div class="container">
    <h1>Game Settings</h1>
    <phase-form-block
      v-for="(phase, phaseNumber) in phases"
      :key="phaseNumber"
      :phase="phase"
      :renderKey="renderKey"
      v-on:phase-data="setPhaseData($event, phaseNumber)"
    />
    <!-- <phase-form-block :key="'addPhase'" /> this should be a separate thing. -->
  </div>
</template>
<script>
import Vue from "vue";
import { getDefaultPhases } from "../../types/phases";
import PhaseFormBlock from "./PhaseFormBlock.vue";

export default Vue.component("game-settings", {
  name: "GameSettings",
  components: {
    PhaseFormBlock,
  },
  data() {
    return {
      phases: getDefaultPhases(),
      renderKey: Math.random(),
    };
  },
  methods: {
    setPhaseData($event, phaseNumber) {
      this.phases[phaseNumber] = $event;
      this.renderKey = Math.random();
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  padding: 0px 40px;
  flex-direction: column;
  border-right: 1px solid black;
  margin-top: 70px;
}
</style>
