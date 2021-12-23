import { getEmptyCardArray, Card } from "@/types/card";
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

// todo: ownPlayerData should be its own object.
// have hand, phase, points nested under that.
// todo: selectCard has business logic; that should probably move back to the calling component.
export default new Vuex.Store({
  state: {
    chats: getEmptyChatMessageArray(),
    discardCard: null,
    drawCard: null,
    gamename: "",
    hand: getEmptyCardArray(),
    phase: 0,
    playersInRoom: getEmptyPlayerArray(),
    points: 0,
    proctorMessage: "",
    roomCode: "",
    gameState: {
      playerUp: "",
      drew: false,
      played: false,
      discarded: false,
    },
    selectedCards: getEmptyCardArray(),
  },
  mutations: {
    addPlayer(state, gamename) {
      state.playersInRoom.push(gamename);
    },
    selectCard(state, key) {
      // check if selected cards already contains the key
      if (state.selectedCards.some((card) => card.key === key)) {
        // remove that card from selected.
        state.selectedCards = state.selectedCards.filter(
          (card) => card.key !== key
        );
      } else {
        // find card in hand and add it to selected.
        for (let i = 0; i < state.hand.length; i++) {
          const currCard = state.hand[i];
          if (currCard.key === key) {
            state.selectedCards.push({ ...currCard });
            break;
          }
        }
      }
    },
    unSelectAllCards(state) {
      state.selectedCards = getEmptyCardArray();
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
    setDrawDiscard(state, drawDiscard) {
      state.drawCard = drawDiscard.draw;
      state.discardCard = drawDiscard.discard;
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
    setProctorMessage(state, proctorMessage) {
      state.proctorMessage = proctorMessage;
    },
    setGameState(state, gameState) {
      state.gameState = gameState;
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
      commit("setHand", data.hand);
      commit("setPoints", data.points);
      commit("setPhase", data.phase);
    },
    SOCKET_roomPlayerData({ commit }, data) {
      const newPlayersData = getPlayerArrayFromData(data);
      commit("setPlayersInRoom", newPlayersData);
    },
    SOCKET_drawDiscard({ commit }, data) {
      commit("setDrawDiscard", data);
    },
    SOCKET_gameState({ commit }, gameState) {
      commit("setGameState", gameState);
      const msg = getProctorMessage(this.state.gameState, this.state.gamename);
      commit("setProctorMessage", msg);
    },
    SOCKET_proctorMessage({ commit }, proctorMessage) {
      const basicMsg = getProctorMessage(
        this.state.gameState,
        this.state.gamename
      );
      commit("setProctorMessage", proctorMessage + " " + basicMsg);
    },
  },
  modules: {},
});

/**
 * Returns some generic proctor message based on the game state.
 */
function getProctorMessage(gameState: any, gamename: string) {
  let msg = "";
  if (gameState.playerUp === gamename) {
    msg += "You're up! ";

    if (!gameState.drew) {
      msg += "Take a card from the draw or discard pile.";
    } else if (!gameState.played) {
      msg += "Complete your phase or discard something.";
    } else {
      msg += "Discard something to end your turn.";
    }
  } else {
    msg += `Waiting for ${gameState.playerUp} `;

    if (!gameState.drew) {
      msg += "to draw.";
    } else if (!gameState.played) {
      msg += "to play.";
    } else {
      msg += "to discard.";
    }
  }
  return msg;
}
