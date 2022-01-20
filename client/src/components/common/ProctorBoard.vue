<template>
  <div id="proctorBoard" :class="highlightClass">
    <p>{{ message }}</p>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.component("proctor-board", {
  name: "ProctorBoard",
  props: ["highlighted"],
  computed: {
    message(): string {
      return this.$store.state.proctorMessage;
    },
    highlightClass(): string {
      return this.highlighted ? "highlighted" : "";
    },
  },
});
</script>
<style lang="scss" scoped>
#proctorBoard {
  margin-top: 40px;
  padding: 8px;
}

.highlighted {
  background-color: #d3f18b;
}
</style>
