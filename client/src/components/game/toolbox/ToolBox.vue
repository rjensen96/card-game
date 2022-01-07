<template>
  <div class="tools">
    <div class="iconStack border">
      <div
        class="iconButton"
        :class="marqueeSelected"
        @click="setSelectMethod('marquee')"
      >
        <select-drag class="icon" />
      </div>
      <div
        class="iconButton"
        :class="dragSelected"
        @click="setSelectMethod('drag')"
      >
        <arrow-all class="icon" />
      </div>
    </div>
    <div class="iconStack">
      <div class="iconButton" @click="setSortMethod('value')">
        <numeric-icon class="icon" />
      </div>
      <div class="iconButton" @click="setSortMethod('color')">
        <palette-icon class="icon" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { HandSort, HandSelect } from "../../../types/toolbox";
import NumericIcon from "vue-material-design-icons/Numeric.vue";
import PaletteIcon from "vue-material-design-icons/Palette.vue";
import SelectDrag from "vue-material-design-icons/SelectDrag.vue";
import ArrowAll from "vue-material-design-icons/ArrowAll.vue";

export default Vue.component("tool-box", {
  name: "ToolBox",
  components: { NumericIcon, PaletteIcon, SelectDrag, ArrowAll },
  data() {
    return {
      sortMethod: HandSort.value,
      selectMethod: HandSelect.marquee,
    };
  },
  computed: {
    // before, I had this set up such that numbers and pallete would be selected long-term
    // but that doesn't make much sense. So I disabled it.
    // numberSelected() {
    //   return this.sortMethod === HandSort.value ? "selected" : "";
    // },
    // palleteSelected() {
    //   return this.sortMethod === HandSort.color ? "selected" : "";
    // },
    marqueeSelected() {
      return this.selectMethod === HandSelect.marquee ? "selected" : "";
    },
    dragSelected() {
      return this.selectMethod === HandSelect.drag ? "selected" : "";
    },
  },
  methods: {
    setSortMethod(method) {
      if (method === "value") {
        this.sortMethod = HandSort.value;
      } else if (method === "color") {
        this.sortMethod = HandSort.color;
      }
      // this.$emit("sortUpdate", this.sortMethod);
      this.$emit("sortHand", this.sortMethod);
    },
    setSelectMethod(method) {
      if (method === "marquee") {
        this.selectMethod = HandSelect.marquee;
      } else if (method === "drag") {
        this.selectMethod = HandSelect.drag;
      }

      this.$emit("selectUpdate", this.selectMethod);
    },
  },
});
</script>

<style lang="scss" scoped>
.tools {
  margin: 0px 20px;
}
.iconStack {
  display: flex;
  flex-direction: column;
  float: left;
  padding: 0px 10px;

  &.border {
    border-right: 1px solid rgb(194, 194, 194);
  }
}

.iconButton {
  height: 25px;
  width: 25px;
  margin: 5px 0px;
  border-radius: 5px;
  padding: 4px;

  &.selected {
    background-color: #e7e7e7;
    color: rgb(42, 106, 224);
  }

  &:hover {
    background-color: #e7e7e7;
    color: rgb(42, 106, 224);
    cursor: pointer;
  }
  .icon {
    margin: 5px 0px;
  }
}
</style>
