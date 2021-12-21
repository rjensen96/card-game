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
    gamename: "",
    roomCode: "",
    chats: getEmptyChatMessageArray(),
    playersInRoom: getEmptyPlayerArray(),
    hand: [],
    phase: 0,
    points: 0,
  },
  mutations: {
    addPlayer(state, gamename) {
      state.playersInRoom.push(gamename);
    },
    setGamename(state, gamename) {
      state.gamename = gamename;
    },
    setPlayersInRoom(state, playersInRoom) {
      state.playersInRoom = playersInRoom;
    },
    setRoomCode(state, roomCode) {
      state.roomCode = roomCode;
    },
    setHand(state, hand) {
      state.hand = hand;
    },
    setPoints(state, points) {
      state.points = points;
    },
    setPhase(state, phase) {
      state.phase = phase;
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
    SOCKET_ownPlayerData({ commit }, data) {
      console.log("got ownplayerdata:", data);
      commit("setHand", data.hand);
      commit("setPoints", data.points);
      commit("setPhase", data.phase);
    },
    SOCKET_roomPlayerData({ commit }, data) {
      console.log("got roomplayerdata", data);
      const newPlayersData = getPlayerArrayFromData(data);
      commit("setPlayersInRoom", newPlayersData);
    },
  },
  modules: {},
});
