<template>
  <div>
    <create-join v-if="notInRoom" />
    <waiting-room v-else />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import io from "socket.io-client";
import CreateJoin from "../components/CreateJoin.vue";
import WaitingRoom from "../components/WaitingRoom.vue";

export default Vue.extend({
  components: { CreateJoin, WaitingRoom },
  // idea: have an "observer" mode where people can join and just watch?

  name: "Home",
  data() {
    return {
      socket: io(),
    };
  },
  computed: {
    notInRoom(): boolean {
      return this.$store.state.roomCode === "";
    },
  },
  methods: {
    createRoom(): void {
      // TODO: on this click, we could take user to a form to do custom room settings.
      // Makes more sense to configure the settings before actually creating it.
      this.$socket.emit("createRoom");
    },
  },
});
</script>

<style lang="scss">
button {
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  height: 40px;
  min-width: 90px;
  margin: 0px 20px;
  font-size: 18px;
  cursor: pointer;
  transition-duration: 200ms;
}

button:hover {
  background-color: #54c558;
  transition: all;
  transition-duration: 300ms;
}
</style>
