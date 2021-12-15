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

<style lang="scss" scoped></style>
