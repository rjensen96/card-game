<template>
  <div class="container">
    <h1>Game Settings</h1>
    <preset-picker @phase-preset="setAllPhases" />
    <phase-form-block
      v-for="(phase, phaseNumber) in phases"
      :key="phaseNumber"
      :phase="phase"
      :renderKey="renderKey"
      v-on:phase-data="setPhaseData($event, phaseNumber)"
    />
    <span id="estTime">Approx. {{ timeEstimate }}</span>
  </div>
</template>
<script>
import Vue from "vue";
import { getDefaultPhases } from "../../types/phases";
import PhaseFormBlock from "./PhaseFormBlock.vue";
import PresetPicker from "./PresetPicker.vue";

export default Vue.component("game-settings", {
  name: "GameSettings",
  components: {
    PhaseFormBlock,
    PresetPicker,
  },
  data() {
    return {
      phases: getDefaultPhases(),
      renderKey: Math.random(),
    };
  },
  computed: {
    timeEstimate() {
      const numPlayers = this.$store.state.playersInRoom.length;
      const playersText = numPlayers === 1 ? "player" : "players";
      const numPhases = this.phases.length;
      const loAvg = 2.0;
      const hiAvg = 2.5;

      const lo = Math.floor(loAvg * numPlayers * numPhases);
      const hi = Math.floor(hiAvg * numPlayers * numPhases);

      return `${lo} - ${hi} mins (${numPlayers} ${playersText})`;
    },
  },
  methods: {
    setPhaseData($event, phaseNumber) {
      if (!$event.length) {
        this.phases.splice(phaseNumber, 1);
      } else {
        this.phases[phaseNumber] = $event;
      }
      this.renderKey = Math.random();
    },
    setAllPhases(phases) {
      this.phases = phases;
      this.renderKey = Math.random();
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  padding: 0px 40px 30px 40px;
  flex-direction: column;
  border-right: 1px solid black;
  margin-top: 70px;

  #estTime {
    font-style: italic;
    margin: 15px 0px;
  }
}
</style>
