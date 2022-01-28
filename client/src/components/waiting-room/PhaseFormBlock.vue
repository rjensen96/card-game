<template>
  <div class="phaseBlock">
    <div v-for="(item, idx) in phase" :key="idx" class="phaseItem">
      <select @change="handleSelectPattern($event, idx)">
        <option
          v-for="(opt, optIdx) in dropdownOpts"
          :key="optIdx"
          :value="opt.value"
          :selected="patternSelected(idx, opt.value)"
        >
          {{ opt.display }}
        </option>
      </select>
      <input
        type="number"
        min="2"
        :max="getMaxSize(idx)"
        @change="handleSelectSize($event, idx)"
        :value="phaseItemSize(idx)"
      />
      <div class="deleteButton">
        <delete-icon class="icon" @click="handleDeleteItem(idx)" />
        <!-- <close-circle-outline-icon
          class="icon"
          @click="handleDeleteItem(idx)"
        /> -->
      </div>
    </div>
    <div v-if="canAddItem" class="phasePotential" @click="handleAddItem">
      <p>+</p>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import DeleteIcon from "vue-material-design-icons/Delete.vue";
import _ from "lodash";
// import CloseCircleOutlineIcon from "vue-material-design-icons/CloseCircleOutline.vue";

export default Vue.component("phase-form-block", {
  name: "PhaseFormBlock",
  props: ["phase", "renderKey"],
  components: { DeleteIcon /*CloseCircleOutlineIcon */ },
  computed: {
    dropdownOpts() {
      return [
        { value: "set", display: "Set" },
        { value: "run", display: "Run" },
        { value: "color", display: "One color" },
      ];
    },
    canAddItem() {
      return this.phase.length === 1;
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
    handleAddItem() {
      if (this.phase.length !== 1) {
        return;
      }

      // copy item 0 into item 1
      // const payload = _.cloneDeep(this.phase);
      const payload = [...this.phase];
      payload.push(_.cloneDeep(payload[0]));

      const totalSize = Number(payload[0].size) + Number(payload[1].size);
      console.log("totalSize", totalSize);

      if (totalSize > 9) {
        if (payload[0].size >= 8) {
          payload[0].size = 7;
        }

        payload[1].size = 9 - payload[0].size;
      }

      this.$emit("phase-data", payload);
    },
    handleSelectPattern($event, phaseIdx) {
      // payload must be the full phase of data:
      // [{pattern: "", size: n, cards: []}, {pattern: "", size: n, cards: []}]
      const payload = [...this.phase];
      payload[phaseIdx].pattern = $event.target.value;

      this.$emit("phase-data", payload);
    },
    handleSelectSize($event, phaseIdx) {
      const newSize = Number($event.target.value);
      const otherIdx = (phaseIdx + 1) % 2;
      const payload = [...this.phase];

      const totalSize = this.phase[otherIdx]
        ? Number(newSize) + Number(this.phase[otherIdx].size)
        : Number(newSize);

      // ensure new total size is in range 1 to 9
      if (totalSize >= 1 && totalSize <= 9) {
        payload[phaseIdx].size = newSize;
      }

      this.$emit("phase-data", payload);
    },
    handleDeleteItem(phaseIdx) {
      const payload = [...this.phase];
      if (phaseIdx > 0) {
        payload.pop();
      } else {
        payload.shift();
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
$btn-green: #54c558;
$block-color: #e4e4e4;
$block-width: 220px;

.phaseBlock {
  display: flex;
  align-content: space-between;
  border-radius: 4px;
  margin: 2px 0px;
  color: white;
  // background-color: green;
  &:hover {
    background-color: $block-color;
    color: $block-color;
  }

  .phaseItem {
    width: $block-width;
    margin: 3px;
    display: flex;
    justify-content: space-between;

    select {
      font-size: 16px;
      font-family: Poppins, "IBM Plex Sans", Avenir, Helvetica, Arial,
        sans-serif;
      text-align: center;
      width: 110px;
      // margin-right: 10px;
    }
    input {
      font-size: 16px;
      font-family: Poppins, "IBM Plex Sans", Avenir, Helvetica, Arial,
        sans-serif;
      text-align: center;
      width: 50px;
      // margin-right: 10px;
    }

    // color: $block-color;
    // transition: 0.1s color;
    &:hover {
      transition: 0.2s all;
      color: rgb(109, 109, 109);
    }
  }
}

.phasePotential {
  // background-color: rgb(74, 255, 74);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3px;
  color: black;
  width: 100px;
  border: 1px solid black;
  border-radius: 2px;

  p {
    margin: 0px;
    font-size: 20px;
  }

  cursor: pointer;
  transition: width 0.2s;

  &:hover {
    // color: green;
    border: none;
    color: white;
    background-color: $btn-green;
    transition: all 0.3s;
    width: $block-width * 0.8;
  }
}

.deleteButton {
  margin-right: 15px;
  align-items: center;
  margin-top: 5px;
  // transition: 0s all;
  &:hover {
    transition: 0.2s all;
    cursor: pointer;
    color: red;
  }
}
</style>
