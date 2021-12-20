<template>
  <div class="container">
    <phase-card
      v-for="card in hand"
      :key="card.key"
      :text="card.text"
      :value="card.value"
      :color="card.color"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PhaseCard from "./PhaseCard.vue";

export default Vue.component("own-hand", {
  name: "OwnHand",
  components: { PhaseCard },
  computed: {
    hand(): Array<any> {
      return this.$store.state.hand;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #bebebe;
}
</style>
