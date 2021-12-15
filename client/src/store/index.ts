import { getEmptyChatMessageArray } from "@/types/chat-message";
import { getEmptyPlayerArray, Player } from "@/types/player";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function getPlayerArrayFromData(data: Record<string, unknown>[]): Player[] {
  // currently data is just an array of the names. This will change!
  const playerArray: Player[] = data.map((player: any) => {
    const playerData: Player = {
      gamename: player.gamename,
      hand: player.hand,
      phase: player.phase,
      points: player.points,
      key: Math.random(),
    };
    return playerData;
  });

  return playerArray;
}

export default new Vuex.Store({
  state: {
    user: "",
    roomCode: "",
    chats: getEmptyChatMessageArray(),
    playersInRoom: getEmptyPlayerArray(),
  },
  mutations: {
    addPlayer(state, gamename) {
      // gamename is always notyetprovided to begin with. Users enter that once they're in the room.

      // if (gamename !== "notyetprovided") {
      //   const idx = state.playersInRoom.indexOf("notyetprovided");
      //   state.playersInRoom[idx] = gamename;
      // } else {
      state.playersInRoom.push(gamename);
      // }
    },
    setPlayersInRoom(state, playersInRoom) {
      state.playersInRoom = playersInRoom;
    },
    setRoomCode(state, roomCode) {
      state.roomCode = roomCode;
    },
    setInitialRoomState(state, data) {
      state = { ...state, ...data };
    },
    addChatMessage(state, data) {
      state.chats.push(data);
    },
    resetChats(state) {
      state.chats = getEmptyChatMessageArray();
    },
  },
  actions: {
    SOCKET_joinConfirmation({ commit }, data) {
      commit("resetChats"); // in future maybe grab previous room messages, but for now just reset the state.
      commit("setRoomCode", data.roomCode);
      const playersToAdd = getPlayerArrayFromData(data.roomPlayerData);
      commit("setPlayersInRoom", playersToAdd);
    },
    SOCKET_chatMessage({ commit }, data) {
      commit("addChatMessage", data);
    },
    SOCKET_createConfirmation({ commit }, data) {
      commit("setRoomCode", data.roomCode);
      const playersToAdd = getPlayerArrayFromData(data.roomPlayerData);
      commit("setPlayersInRoom", playersToAdd);
    },
    // SOCKET_playersInRoom({ commit }, data) {
    //   console.log("socket_playerjoined:", data);
    //   const playersToAdd = getPlayerArrayFromData(data.playersInRoom);
    //   commit("setPlayersInRoom", playersToAdd);
    // },
    SOCKET_roomPlayerData({ commit }, data) {
      console.log("got roomplayerdata");
      const newPlayersData = getPlayerArrayFromData(data);
      commit("setPlayersInRoom", newPlayersData);
    },
  },
  modules: {},
});
