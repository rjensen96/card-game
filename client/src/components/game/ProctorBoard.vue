<template>
  <div id="proctorBoard">
    <p>{{ message }}</p>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.component("proctor-board", {
  name: "ProctorBoard",
  computed: {
    message(): string {
      return this.$store.state.proctorMessage;
    },
  },
});
</script>
<style lang="scss" scoped>
#proctorBoard {
  margin-top: 50px;
}
</style>
