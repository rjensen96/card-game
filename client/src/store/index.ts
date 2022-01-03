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
      phaseNumber: player.phaseNumber,
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

// todo: playerId should be the socket id in use when a player joins a room.
// the server should send that id back as "playerId"
// that way when the server restarts, it doesn't frig everything up and crash.
// need to send this playerId with every WS request to the server.
export default new Vuex.Store({
  state: {
    chats: getEmptyChatMessageArray(),
    discardCard: null,
    drawCard: null,
    gamename: "",
    hand: getEmptyCardArray(),
    phase: {},
    phaseNumber: 0,
    playersInRoom: getEmptyPlayerArray(),
    playerId: "",
    points: 0,
    proctorMessage: "",
    roomId: "",
    gameState: null,
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
    setRoomId(state, roomId) {
      state.roomId = roomId;
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
    setPhaseNumber(state, phaseNumber) {
      state.phaseNumber = phaseNumber;
    },
    setPlayerId(state, playerId) {
      state.playerId = playerId;
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
      // commit("resetChats"); // in future maybe grab previous room messages, but for now just reset the state.
      console.log("joinconfirmation:", data);
      commit("setRoomId", data.roomId);
      const playersToAdd = getPlayerArrayFromData(data.roomPlayerData);
      commit("setPlayersInRoom", playersToAdd);
      commit("setPlayerId", data.playerId);
    },
    SOCKET_chatMessage({ commit }, data) {
      commit("addChatMessage", data);
    },
    SOCKET_createConfirmation({ commit }, data) {
      commit("setRoomId", data.roomId);
      const playersToAdd = getPlayerArrayFromData(data.roomPlayerData);
      commit("setPlayersInRoom", playersToAdd);
      commit("setPlayerId", data.playerId);
    },
    SOCKET_ownPlayerData({ commit }, data) {
      commit("setHand", data.hand);
      commit("setPoints", data.points);
      commit("setPhase", data.phase);
      commit("setPhaseNumber", data.phaseNumber);
    },
    SOCKET_roomPlayerData({ commit }, data) {
      // due to some funky issue, Vue parses data into observer instead of data.
      // the workaround is to serialize it again and parse it again.
      // https://stackoverflow.com/questions/52873516/vue-js-returns-ob-observer-data-instead-of-my-array-of-objects

      // actually update: I think we don't need below line because it should be observable.
      console.log("got new roomplayerdata");
      data = JSON.parse(JSON.stringify(data));
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
