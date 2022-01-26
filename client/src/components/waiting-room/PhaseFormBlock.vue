<template>
  <div class="phaseBlock">
    <div v-for="itemIdx in 2" :key="itemIdx" class="phaseItem">
      <div v-if="hasItem(itemIdx - 1)">
        <select @change="handleSelectPattern($event, itemIdx - 1)">
          <option
            v-for="(opt, optIdx) in dropdownOpts"
            :key="optIdx"
            :value="opt.value"
            :selected="patternSelected(itemIdx - 1, opt.value)"
          >
            {{ opt.display }}
          </option>
        </select>
        <input
          type="number"
          min="1"
          :max="getMaxSize(itemIdx - 1)"
          @change="handleSelectSize($event, itemIdx - 1)"
          :value="phaseItemSize(itemIdx - 1)"
        />
        <div class="deleteButton">
          <delete-icon />
        </div>
      </div>
      <div class="phasePotential" v-else>potential...</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import DeleteIcon from "vue-material-design-icons/Delete.vue";

export default Vue.component("phase-form-block", {
  name: "PhaseFormBlock",
  props: ["phase", "renderKey"],
  components: { DeleteIcon },
  computed: {
    dropdownOpts() {
      return [
        { value: "set", display: "Set" },
        { value: "run", display: "Run" },
        { value: "color", display: "One color" },
      ];
    },
  },
  methods: {
    getMaxSize(phaseIdx) {
      const otherIdx = (phaseIdx + 1) % 2;
      let max = 9;
      if (this.phase[otherIdx]) {
        max = 9 - this.phase[otherIdx].size;
      }
      return max.toString();
    },
    hasItem(idx) {
      if (this.phase) {
        return !!this.phase[idx];
      }
      return false;
    },
    handleSelectPattern($event, phaseIdx) {
      // payload must be the full phase of data:
      // [{pattern: "", size: n, cards: []}, {pattern: "", size: n, cards: []}]
      const payload = { ...this.phase };
      payload[phaseIdx].pattern = $event.target.value;

      this.$emit("phase-data", payload);
    },
    handleSelectSize($event, phaseIdx) {
      const newSize = $event.target.value;
      const otherIdx = (phaseIdx + 1) % 2;
      const payload = { ...this.phase };

      const totalSize = this.phase[otherIdx]
        ? Number(newSize) + Number(this.phase[otherIdx].size)
        : Number(newSize);

      // ensure new total size is in range 1 to 9
      if (totalSize >= 1 && totalSize <= 9) {
        payload[phaseIdx].size = newSize;
      }

      this.$emit("phase-data", payload);
    },
    patternSelected(phaseIdx, optionValue) {
      const phaseItem = this.phase[phaseIdx];
      if (phaseItem) {
        return phaseItem.pattern === optionValue ? "selected" : "";
      }
      return "";
    },
    phaseItemSize(phaseIdx) {
      return this.phase[phaseIdx].size;
    },
  },
});
</script>

<style lang="scss" scoped>
.phaseBlock {
  display: flex;
  align-content: space-between;
  width: 400px;
  background-color: rgb(187, 187, 236);
  border-radius: 10px;
  margin: 5px 0px;
}

.phaseItem {
  background-color: gray;
  width: 50%;
  margin: 5px;
}

.phasePotential {
  background-color: rgb(74, 255, 74);
}

.deleteButton {
  margin: auto;
  height: 100%;
  float: right;
}
</style>
