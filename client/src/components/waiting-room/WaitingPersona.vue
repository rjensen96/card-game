<template>
  <div>
    <div class="waitingPersona">
      <span>
        {{ playerInitial }}
      </span>
    </div>
    <p>{{ playerName }}</p>
  </div>
</template>

<script>
import { Vue } from "vue-property-decorator";
import { Player } from "../../types/player";

// todo: use vuetify https://vuetifyjs.com/en/components/icons/

export default Vue.component("waiting-persona", {
  name: "WaitingPersona",
  props: {
    player: Player,
  },
  computed: {
    playerInitial() {
      if (this.player.gamename === "") {
        return "?";
      }
      return this.player.gamename[0];
    },
    playerName() {
      return this.player.gamename;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.waitingPersona {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 60px;
  padding: 10px;
  margin: 10px 20px 0px 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  background-color: #2c3e50;
  color: white;

  span {
    font-size: 40px;
    font-weight: bold;
  }
}

p {
  font-size: 20px;
}
</style>
