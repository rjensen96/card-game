const { Server, Socket } = require("socket.io");

const { drawCard, discard, playCards, advanceRound } = require("../gameflow");
const { ensureSocketJoinedRoom } = require("../gameflow/utils");
const { roomHasGamename } = require("../gameflow/validation");

const { createRoom, createPlayer } = require("../mongo/requests/create");

const {
  getPublicRoomData,
  getRoomOfPlayerId,
  getRoomByRoomId,
} = require("../mongo/requests/read");
const {
  setPlayerGamename,
  rotatePlayerUp,
  dealCards,
  assignPhasesToRoom,
} = require("../mongo/requests/update");
const {
  sendDrawDiscard,
  sendGameState,
  sendPlayersOwnData,
  sendPublicPlayerData,
} = require("./push-responses");
const { validateGameSettings } = require("./validation");

// OK NEW NOTES ON CLIENT:
/*

  1. "CREATE ROOM" / ROOM CODE:
  2. Waiting room... start game button
  3. Then, the game itself.

*/

let io_;

/**
 *
 * @param {Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>} io
 */
function initializeIO(io) {
  io_ = io;
  io.on("connection", (socket) => {
    console.log("client connected", socket.id);
    handleAdvanceRound(socket);
    handleCreateRoom(socket);
    handleChat(socket);
    handleDisconnect(socket);
    handleDiscard(socket);
    handleJoin(socket);
    handleSetGamename(socket);
    handleStartGame(socket);
    handleTakeCard(socket);
    handlePlayCards(socket);
    handleGameSettings(socket);
  });
}

// todo: consider combining create and join functions (or combining the common pieces)
// it's not DRY

/**
 * REFACTORED TO MONGO
 * @param {Socket} socket
 */
function handleCreateRoom(socket) {
  socket.on("createRoom", async (data) => {
    try {
      const room = await createRoom();
      const player = await createPlayer(socket.id, room._id);

      socket.join(room.roomId);
      const roomPlayerData = await getPublicRoomData(room._id);

      const payload = {
        roomId: room.roomId,
        roomPlayerData,
      };

      // emit join confirmation to be handled in client
      io_.to(room.roomId).emit("joinConfirmation", payload);
      io_.to(socket.id).emit("playerId", player.playerId);
    } catch (error) {
      console.error(error);
    }
  });
}

/**
 * REFACTORED TO MONGO
 * @param {Socket} socket
 */
function handleJoin(socket) {
  socket.on("joinRoom", async (data) => {
    const targetRoomId = data.roomId.toUpperCase();
    const room = await getRoomByRoomId(targetRoomId);

    if (!room) {
      // send error that room does not exist;
      io_.to(socket.id).emit("proctorMessage", "That room does not exist!");
      return;
    }

    const player = await createPlayer(socket.id, room._id);
    socket.join(room.roomId);

    const roomPlayerData = await getPublicRoomData(room._id);

    const payload = {
      roomId: targetRoomId,
      roomPlayerData,
    };

    io_.to(room.roomId).emit("joinConfirmation", payload);
    io_.to(socket.id).emit("playerId", player.playerId);
  });
}

function handleDisconnect(socket) {
  socket.on("disconnect", async (reason) => {
    console.log("client disconnected", socket.id);
    // notify room that user left?
  });
}

/**
 * REFACTORED TO MONGO
 * @param {Socket} socket
 */
function handleSetGamename(socket) {
  socket.on("setGamename", async (data) => {
    // ensure no other player in room has the requested name.
    const room = await getRoomOfPlayerId(data.playerId);
    ensureSocketJoinedRoom(socket, room.roomId);

    if (roomHasGamename(room, data.gamename)) {
      return io_
        .to(socket.id)
        .emit(
          "proctorMessage",
          "That player is already here! Please enter a unique name."
        );
    }

    await setPlayerGamename(data.playerId, data.gamename);
    const roomPlayerData = await getPublicRoomData(room._id);
    io_.to(socket.id).emit("gamenameConfirmation", { gamename: data.gamename });
    io_.to(room.roomId).emit("roomPlayerData", roomPlayerData);
  });
}

// todo: check if room is already started to prevent people from doing stupid crap
function handleStartGame(socket) {
  socket.on("startGame", async (data) => {
    const { roomId, gameStarted } = await getRoomOfPlayerId(data.playerId);
    const { phases } = data;

    await assignPhasesToRoom(roomId, phases);

    if (gameStarted) {
      return; // prevent people from doing dumb stuff like restarting the game randomly.
    }

    ensureSocketJoinedRoom(socket, roomId);
    // a better and faster way to do these updates would be to pass the room document around
    // then I could do all the modifications on the document, then save it once.
    // that would significantly reduce the number of read/write requests that go all the way to OREGON.

    await rotatePlayerUp(roomId);
    await dealCards(roomId);

    const room = await getRoomByRoomId(roomId); // updated with the dealt cards.

    sendPublicPlayerData(room, io_);
    sendDrawDiscard(room, io_);
    sendGameState(room, io_);
    sendPlayersOwnData(room, io_);
  });
}

function handlePlayCards(socket) {
  socket.on("playCards", (data) => {
    playCards(io_, { ...data, socket });
  });
}

function handleTakeCard(socket) {
  socket.on("takeCard", (data) => {
    drawCard(io_, { ...data, socket });
  });
}

function handleDiscard(socket) {
  socket.on("discard", (data) => {
    discard(io_, { ...data, socket });
  });
}

function handleAdvanceRound(socket) {
  socket.on("advanceRound", async (data) => {
    const room = await getRoomOfPlayerId(data.playerId);
    advanceRound(room, io_);
  });
}

function handleGameSettings(socket) {
  socket.on("gameSettings", async (data) => {
    const room = await getRoomOfPlayerId(data.playerId);
    if (validateGameSettings(data)) {
      const payload = { phases: data.phases };
      if (data.hasOwnProperty("presetName")) {
        payload.presetName = data.presetName;
      }
      io_.to(room.roomId).emit("gameSettings", payload); // simply broadcast.
    } else {
      console.log("settings failed!");
    }
  });
}

function handleChat(socket) {
  socket.on("chatMessage", (data) => {
    // console.log("chat:", data);
    io_.to(data.room).emit("chatMessage", data);
  });
}

module.exports = { initializeIO };
