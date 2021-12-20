<template>
  <div class="waitingPersona">
    <p>
      {{ playerName }}
    </p>
  </div>
</template>

<script>
import { Vue } from "vue-property-decorator";
import { Player } from "../types/player";
// todo: use vuetify https://vuetifyjs.com/en/components/icons/

export default Vue.component("waiting-persona", {
  name: "WaitingPersona",
  props: {
    player: Player,
  },
  computed: {
    playerName() {
      if (this.player.gamename === "") {
        return "?";
      }
      return this.player.gamename;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.waitingPersona {
  height: 100px;
  width: 100px;
  padding: 10px;
  margin: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 15px;
}
</style>
