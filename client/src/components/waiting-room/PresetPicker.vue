<template>
  <div class="presetWrapper">
    <label for="presets">Preset</label>
    <select id="presets" @change="handleSelectPreset" v-model="presetName">
      <option value="classic">Classic</option>
      <option value="classic-odds">Classic - odds</option>
      <option value="classic-evens">Classic - evens</option>
      <option value="rj-special">RJ special</option>
    </select>
  </div>
</template>

<script>
import Vue from "vue";
import { getDefaultPhases, getRJSpecialPhases } from "../../types/phases.ts";
export default Vue.component("preset-picker", {
  name: "PresetPicker",
  computed: {
    presetName: {
      get() {
        return this.$store.state.gameSettings.presetName;
      },
      set(value) {
        const x = 1; // this is just a dummy block. Literally does nothing.
        // prevents a console.error from showing up about not having a setter. We never use this.
      },
    },
  },
  methods: {
    handleSelectPreset($event) {
      console.log("change", $event.target.value);
      const presetName = $event.target.value;
      let payload = { presetName, phases: [] };
      switch (presetName) {
        case "classic":
          payload.phases = getDefaultPhases();
          break;
        case "classic-odds":
          payload.phases = getDefaultPhases();
          payload.phases = payload.phases.filter((phase, idx) => idx % 2 == 1);
          break;
        case "classic-evens":
          payload.phases = getDefaultPhases();
          payload.phases = payload.phases.filter((phase, idx) => idx % 2 == 0);
          break;
        case "rj-special":
          payload.phases = getRJSpecialPhases();
          break;
      }

      this.$emit("preset-change", payload);
    },
  },
});
</script>

<style lang="scss" scoped>
.presetWrapper {
  border-top: 1px solid rgb(177, 177, 177);
  border-bottom: 1px solid rgb(177, 177, 177);
  padding: 15px 0px;
  margin-bottom: 20px;

  label {
    margin-right: 20px;
  }

  select {
    font-family: Poppins, "IBM Plex Sans", Avenir, Helvetica, Arial;
  }
}
</style>
