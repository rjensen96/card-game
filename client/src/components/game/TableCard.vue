<template></template>

<script lang="ts">
import Vue from "vue";
export default Vue.component("table-card", {
  name: "TableCard",
  props: ["cardData"],
  computed: {
    // note: below is not DRY with PhaseCard; coloring should be separated.
    colorClass(): string {
      switch (this.cardData.color) {
        case 1:
          return "red";
        case 2:
          return "blue";
        case 3:
          return "yellow";
        case 4:
          return "green";
        default:
          return "black";
      }
    },
  },
});
</script>
