<template>
  <div class="presetWrapper">
    <label for="presets">Preset</label>
    <select id="presets" @change="handleSelectPreset">
      <option value="classic">Classic</option>
      <option value="classic-odds">Classic - odds</option>
      <option value="classic-evens">Classic - evens</option>
      <option value="rj-special">RJ special</option>
    </select>
  </div>
</template>

<script>
import Vue from "vue";
import { getDefaultPhases, getRJSpecialPhases } from "../../types/phases";
export default Vue.component("preset-picker", {
  name: "PresetPicker",
  methods: {
    handleSelectPreset($event) {
      console.log("change", $event.target.value);
      const presetName = $event.target.value;
      let payload = [];
      switch (presetName) {
        case "classic":
          payload = getDefaultPhases();
          break;
        case "classic-odds":
          payload = getDefaultPhases();
          payload = payload.filter((phase, idx) => idx % 2 == 1);
          break;
        case "classic-evens":
          payload = getDefaultPhases();
          payload = payload.filter((phase, idx) => idx % 2 == 0);
          break;
        case "rj-special":
          payload = getRJSpecialPhases();
          break;
      }

      this.$emit("phase-preset", payload);
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
