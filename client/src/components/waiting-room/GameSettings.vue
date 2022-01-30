<template>
  <div class="container">
    <h1>Game Settings</h1>
    <preset-picker @preset-change="handlePresetChange" />
    <phase-form-block
      v-for="(phase, phaseNumber) in phases"
      :key="phaseNumber"
      :phase="phase"
      :renderKey="renderKey"
      @phase-data="setPhaseData($event, phaseNumber)"
    />
    <span id="estTime">Approx. {{ timeEstimate }}</span>
  </div>
</template>
<script>
import Vue from "vue";
import PhaseFormBlock from "./PhaseFormBlock.vue";
import PresetPicker from "./PresetPicker.vue";
import _ from "lodash";

export default Vue.component("game-settings", {
  name: "GameSettings",
  components: {
    PhaseFormBlock,
    PresetPicker,
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
    phases() {
      return this.$store.state.gameSettings.phases;
    },
    renderKey() {
      return this.$store.state.gameSettings.renderKey;
    },
  },
  methods: {
    setPhaseData($event, phaseNumber) {
      const newPhases = _.cloneDeep(this.phases);
      const playerId = this.$store.state.playerId;

      if (!$event.length) {
        newPhases.splice(phaseNumber, 1);
      } else {
        newPhases[phaseNumber] = $event;
      }
      // emit newPhases thru socket
      this.$socket.emit("gameSettings", { phases: newPhases, playerId });
    },
    handlePresetChange(data) {
      // emit this.phases and phase preset thru socket
      const playerId = this.$store.state.playerId;
      this.$socket.emit("gameSettings", { ...data, playerId });
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
