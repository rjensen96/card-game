<template>
  <div class="container">
    <div class="selectBox" />
    <div class="sortIcons">
      <numeric-icon class="icon" @click="sortByValue" />
      <palette-icon class="icon" @click="sortByColor" />
    </div>
    <phase-card
      v-for="card in hand"
      :key="card.key"
      :cardKey="card.key"
      :text="card.text"
      :value="card.value"
      :color="card.color"
      :selectable="true"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import PhaseCard from "./PhaseCard.vue";
import NumericIcon from "vue-material-design-icons/Numeric.vue";
import PaletteIcon from "vue-material-design-icons/Palette.vue";

export default Vue.component("own-hand", {
  name: "OwnHand",
  components: { PhaseCard, NumericIcon, PaletteIcon },
  computed: {
    hand(): Array<any> {
      return this.$store.state.hand;
    },
  },
  methods: {
    sortByValue(): void {
      const hand: Array<any> = this.$store.state.hand;
      hand.sort((a, b) => a.value - b.value);
      this.$store.commit("setHand", hand);
    },
    sortByColor(): void {
      const hand: Array<any> = this.$store.state.hand;
      hand.sort((a, b) => a.color - b.color);
      this.$store.commit("setHand", hand);
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #dadada;
  cursor: crosshair;
}

.sortIcons {
  display: flex;
  flex-direction: column;
  float: left;
  margin: 0px 40px;
}

.icon {
  margin: 5px 0px;
  :hover {
    color: rgb(42, 106, 224);
    cursor: pointer;
  }
}

.selectBox {
  position: absolute;
}
</style>
