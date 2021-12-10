<template>
  <div class="about">
    <h1>Welcome to {{ room }}, {{ user }}!</h1>
    <input type="text" v-model="msgText" />
    <button @click="sendChat">Send</button>
    <ul>
      <li v-for="chat in chats" :key="chat.key">{{ chat.message }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ChatMessage } from "../types/chat-message";

export default Vue.extend({
  mounted() {
    if (!this.$store.state.user || !this.$store.state.room) {
      console.log("YOU'RE TOAST! REROUTING!");
      this.$router.push("/");
    }
  },
  data() {
    return {
      msgText: "",
    };
  },
  computed: {
    user(): string {
      return this.$store.state.user;
    },
    room(): string {
      return this.$store.state.room;
    },
    chats(): ChatMessage[] {
      return this.$store.state.chats;
    },
  },
  methods: {
    sendChat() {
      const chat: ChatMessage = {
        message: this.msgText,
        key: Math.random(),
        sender: this.user,
        room: this.room,
      };
      this.$socket.emit("chatMessage", chat);
    },
  },
});
</script>
