const { Server, Socket } = require("socket.io");
const db = require("../database");
const _ = require("lodash");

const { drawCard, discard, playCards, advanceRound } = require("../gameflow");

const { createRoom, createPlayer } = require("../mongo/requests/create");

const {
  getPublicRoomData,
  getPlayerByPlayerId,
  getRoomOfPlayerId,
  getRoomByRoomId,
} = require("../mongo/requests/read");
const {
  setPlayerGamename,
  rotatePlayerUp,
  dealCards,
} = require("../mongo/requests/update");
const {
  sendDrawDiscard,
  sendGameState,
  sendPlayersOwnData,
} = require("./push-responses");

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
  });
}

// update: below should not be used because this is an http route now.
// also todo: freaking standardize if you're saying 'user' or 'player', it's too confusing

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
        playerId: player.playerId,
      };

      // emit join confirmation to be handled in client
      io_.to(room.roomId).emit("joinConfirmation", payload);
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
      console.log("room does not exist");
      return;
    }

    const player = await createPlayer(socket.id, room._id);
    socket.join(room.roomId);

    const roomPlayerData = await getPublicRoomData(room._id);

    const payload = {
      roomId: targetRoomId,
      roomPlayerData,
      playerId: player.playerId,
    };

    io_.to(room.roomId).emit("joinConfirmation", payload);
  });
}

function handleDisconnect(socket) {
  socket.on("disconnect", async (reason) => {
    console.log("client disconnected", socket.id);
    // db.deleteUserBySocketId(socket.id);
    // notify room that user left?
  });
}

/**
 * REFACTORED TO MONGO
 * @param {Socket} socket
 */
function handleSetGamename(socket) {
  socket.on("setGamename", async (data) => {
    await setPlayerGamename(data.playerId, data.gamename);
    const player = await getPlayerByPlayerId(data.playerId);
    const roomPlayerData = await getPublicRoomData(player.room._id);
    io_.to(player.room.roomId).emit("roomPlayerData", roomPlayerData);
  });
}

// todo: check if room is already started to prevent people from doing stupid crap
function handleStartGame(socket) {
  socket.on("startGame", async (data) => {
    const { roomId, gameStarted } = await getRoomOfPlayerId(data.playerId);

    if (gameStarted) {
      return; // prevent people from doing dumb stuff like restarting the game randomly.
    }

    // a better and faster way to do these updates would be to pass the room document around
    // then I could do all the modifications on the document, then save it once.
    // that would significantly reduce the number of read/write requests that go all the way to OREGON.

    await rotatePlayerUp(roomId);
    await dealCards(roomId);

    const room = await getRoomByRoomId(roomId); // updated with the dealt cards.

    sendDrawDiscard(room, io_);
    sendGameState(room, io_);
    sendPlayersOwnData(room, io_);
  });
}

function handlePlayCards(socket) {
  socket.on("playCards", (data) => {
    playCards(io_, socket.id, data);
  });
}

function handleTakeCard(socket) {
  socket.on("takeCard", (data) => {
    drawCard(io_, socket.id, data.pileName);
  });
}

function handleDiscard(socket) {
  socket.on("discard", (data) => {
    discard(io_, socket.id, data.card);
  });
}

function handleAdvanceRound(socket) {
  socket.on("advanceRound", async (data) => {
    const room = await getRoomOfPlayerId(data.playerId);
    advanceRound(room, io_);
  });
}

function handleChat(socket) {
  socket.on("chatMessage", (data) => {
    // console.log("chat:", data);
    io_.to(data.room).emit("chatMessage", data);
  });
}

module.exports = initializeIO;
