import { getEmptyCardArray, Card } from "@/types/card";
import { getEmptyChatMessageArray } from "@/types/chat-message";
import { getEmptyPlayerArray, Player } from "@/types/player";
import _ from "lodash";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    chats: getEmptyChatMessageArray(),
    discardCard: null,
    drawCard: null,
    gamename: "",
    hand: getEmptyCardArray(),
    // phase: {},
    // phaseNumber: 0,
    playersInRoom: getEmptyPlayerArray(),
    playerId: "",
    points: 0,
    proctorMessage: "",
    roomId: "",
    gameState: null,
    selectedCardKeys: getBinaryRecordset(),
  },
  mutations: {
    addPlayer(state, gamename) {
      state.playersInRoom.push(gamename);
    },
    setSelectedCardKeys(state, keys) {
      state.selectedCardKeys = keys;
    },
    unSelectAllCards(state) {
      state.selectedCardKeys = getBinaryRecordset();
    },
    setGamename(state, gamename) {
      state.gamename = gamename;
    },
    setPlayersInRoom(state, playersInRoom) {
      state.playersInRoom = playersInRoom;
    },
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    setDrawDiscard(state, drawDiscard) {
      state.drawCard = drawDiscard.draw;
      state.discardCard = drawDiscard.discard;
    },
    setHand(state, newHand) {
      // checks what is already in hand and keep the order the same.
      // new cards will go on the end.
      // this will preserve ability to reorder cards and help game state.

      // todo: the reordering must be conditional.
      // if people drag cards, reordering must not happen.

      state.hand = getOrderedNewHand(state.hand, newHand);
    },
    setHandWithoutReorder(state, newHand) {
      state.hand = newHand;
    },
    setPoints(state, points) {
      state.points = points;
    },
    // setPhase(state, phase) {
    //   state.phase = phase;
    // },
    // setPhaseNumber(state, phaseNumber) {
    //   state.phaseNumber = phaseNumber;
    // },
    setPlayerId(state, playerId) {
      state.playerId = playerId;
    },
    setProctorMessage(state, proctorMessage) {
      state.proctorMessage = proctorMessage;
    },
    setGameState(state, gameState) {
      if (gameState.roundIsOver) {
        console.log("resetting selected keys");
        state.selectedCardKeys = getBinaryRecordset();
      }
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
    SOCKET_chatMessage({ commit }, data) {
      commit("addChatMessage", data);
    },
    SOCKET_createConfirmation({ commit }, data) {
      commit("setRoomId", data.roomId);
      const playersToAdd = getPlayerArrayFromData(data.roomPlayerData);
      commit("setPlayersInRoom", playersToAdd);
    },
    SOCKET_drawDiscard({ commit }, data) {
      commit("setDrawDiscard", data);
    },
    SOCKET_gamenameConfirmation({ commit }, data) {
      commit("setGamename", data.gamename);
    },
    SOCKET_gameState({ commit }, gameState) {
      commit("setGameState", gameState);
      const msg = getProctorMessage(this.state.gameState, this.state.gamename);
      commit("setProctorMessage", msg);
    },
    SOCKET_joinConfirmation({ commit }, data) {
      // commit("resetChats"); // in future maybe grab previous room messages, but for now just reset the state.
      console.log("joinconfirmation:", data);
      commit("setRoomId", data.roomId);
      const playersToAdd = getPlayerArrayFromData(data.roomPlayerData);
      commit("setPlayersInRoom", playersToAdd);
    },
    SOCKET_ownPlayerData({ commit }, data) {
      commit("setHand", data.hand);
      commit("setPoints", data.points);
    },
    SOCKET_playerId({ commit }, playerId) {
      commit("setPlayerId", playerId);
    },
    SOCKET_proctorMessage({ commit }, proctorMessage) {
      const basicMsg = getProctorMessage(
        this.state.gameState,
        this.state.gamename
      );
      commit("setProctorMessage", proctorMessage + " " + basicMsg);
    },
    SOCKET_roomPlayerData({ commit }, data) {
      // due to some funky issue, Vue parses data into observer instead of data.
      // the workaround is to serialize it again and parse it again.
      // https://stackoverflow.com/questions/52873516/vue-js-returns-ob-observer-data-instead-of-my-array-of-objects

      // actually update: I think we don't need below line because it should be observable.
      const newPlayersData = getPlayerArrayFromData(data);
      commit("setPlayersInRoom", newPlayersData);
    },
  },
  modules: {},
});

function getPlayerArrayFromData(data: Record<string, unknown>[]): Player[] {
  // currently data is just an array of the names. This will change!
  const playerArray: Player[] = data.map((player: any) => {
    const playerData: Player = {
      gamename: player.gamename,
      phaseNumber: player.phaseNumber,
      phase: player.phase,
      points: player.points,
      key: Math.random(),
    };
    return playerData;
  });

  return playerArray;
}

function getBinaryRecordset(): Record<string, boolean> {
  const obj: Record<string, boolean> = {};
  return obj;
}

/**
 * Sets the order of the new hand to match most closely to the old hand.
 * Returns a new array with the correct order.
 * @param oldHand
 * @param newHand
 */
function getOrderedNewHand(oldHand: Array<Card>, newHand: Array<Card>) {
  const orderedHand = [];
  for (let i = 0; i < oldHand.length; i++) {
    // for each card in oldHand, get that card in newHand
    const oldCard = oldHand[i];
    const idxNew = _.findIndex(newHand, (card) => card.key === oldCard.key);

    // push that card onto orderedHand
    if (idxNew !== -1) {
      orderedHand.push(...newHand.splice(idxNew, 1));
    }
  }

  // push all remaining cards in newHand to orderedHand
  orderedHand.push(...newHand);
  return orderedHand;
}

/**
 * Returns some generic proctor message based on the game state.
 */
function getProctorMessage(gameState: any, gamename: string) {
  let msg = "";

  if (!gameState) {
    return "";
  }

  if (gameState.roundIsOver) {
    msg += `Round complete!`;
  } else if (gameState.playerUp === gamename) {
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
