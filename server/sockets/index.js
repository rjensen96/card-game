const { Server } = require("socket.io");
const db = require("../database");
const _ = require("lodash");
const { GameRoom, Player } = require("../types/types");
const {
  sendPlayersOwnData,
  sendDrawDiscard,
  sendGameState,
} = require("./pushResponses");
const { rotatePlayerUp, drawCard, discard, playCards } = require("../gameflow");

// todo: should probably convert this entire file to typescript so that I can use types.
// or, I guess I could just make factories like I was planning.

// next steps on client:
// improve the game UI
// make a waiting room that people sit in after they join where their names bubble up.
// make a start button that people can click

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
    // ALSO TODO: make factories for room, user... functions for dealCards, makeDeck, etc.
    // handleJoin(socket);
    // todo: make these lines look more like:
    // socket.on("eventName", functionName);
    handleCreateRoom(socket);
    handleChat(socket);
    handleDisconnect(socket);
    handleDiscard(socket);
    handleSetGamename(socket); // to be implemented... but should probably just use a route.
    handleStartGame(socket);
    handleTakeCard(socket);
    handlePlayCards(socket);
  });
}

// update: below should not be used because this is an http route now.
// also todo: freaking standardize if you're saying 'user' or 'player', it's too confusing
//
// function handleJoin(socket) {
//   // CONNECTING TO ROOMS:
//   // https://stackoverflow.com/questions/19150220/creating-rooms-in-socket-io
//   socket.on("joinRoom", async (data) => {
//     const targetRoom = data.roomCode.toUpperCase();
//     const roomExists = await db.getProperty(`rooms.${targetRoom}`);

//     if (!roomExists) {
//       console.log("JOIN REJECTED:", targetRoom);
//       data.reason = "Room does not exist.";
//       io_.to(socket.id).emit("joinRejection", data);
//       return;
//     }

//     // join the roomCode
//     socket.join(targetRoom);

//     // add user to the room
//     const player = new Player(socket.id, targetRoom);

//     // middleware for sockets?
//     // https://socket.io/docs/v4/middlewares/

//     const socketsInRoom = await db.getProperty(`rooms.${targetRoom}.users`);

//     if (!socketsInRoom.includes(player.socketId)) {
//       socketsInRoom.push(player.socketId);
//       await db.setProperty(`rooms.${targetRoom}.users`, socketsInRoom);
//     }

//     // tell the socket that it joined successfully
//     io_.to(socket.id).emit("joinConfirmation", {
//       roomCode: targetRoom,
//       playersInRoom: socketsInRoom,
//     });

//     // add player to 'users' object in db
//     await db.setProperty(`users.${player.socketId}`, player);

//     // tell the room somebody joined (but we don't yet know whomst)
//     io_.to(targetRoom).emit("playerJoined", { gamename: "notyetprovided" });
//   });
// }

const getRandomRoomCode = () => {
  const minChar = "A".charCodeAt(0);
  const maxChar = "Z".charCodeAt(0);
  const charCodes = [];
  for (let i = 0; i < 4; i++) {
    charCodes.push(
      Math.floor(Math.random() * (maxChar - minChar + 1)) + minChar
    );
  }
  return String.fromCharCode(...charCodes);
};

function handleCreateRoom(socket) {
  socket.on("createRoom", async (data) => {
    // TEMPORARY: reset db when creating a new room just to keep things clean.
    await db.setDB({ rooms: {}, users: {} });
    // TODO: MUST REMOVE LINE ABOVE FOR PRODUCTION.

    const dbRooms = await db.getProperty("rooms");
    const roomsList = dbRooms ? Object.keys(dbRooms) : [];

    // get new UNIQUE room key.
    let newRoomCode = "";
    do {
      newRoomCode = getRandomRoomCode();
    } while (roomsList.includes(newRoomCode));

    // TEMP: HARDCODING FOR TESTING PURPOSES
    newRoomCode = "AAAA";

    // create the room in db
    const room = new GameRoom(newRoomCode);
    await db.setProperty(`rooms.${newRoomCode}`, room);

    // add player to the room
    const player = new Player(socket.id, newRoomCode);
    await db.setProperty(`rooms.${newRoomCode}.users`, [player.socketId]);

    // add player to 'users' object in db
    await db.setProperty(`users.${player.socketId}`, player);

    // join the *socket* room
    socket.join(newRoomCode);

    const roomPlayerData = await db.getPublicDataInRoom(newRoomCode);

    // todo: emit a create confirmation then handle that in client
    io_.to(socket.id).emit("createConfirmation", {
      roomCode: newRoomCode,
      roomPlayerData,
      playerId: player.socketId,
    });
  });
}

function handleDisconnect(socket) {
  socket.on("disconnect", async (reason) => {
    console.log("client disconnected", socket.id);
    // db.deleteUserBySocketId(socket.id);
    // notify room that user left?
  });
}

function handleSetGamename(socket) {
  socket.on("setGamename", async (data) => {
    await db.setProperty(`users.${data.playerId}.gamename`, data.gamename);
    const roomId = await db.getProperty(`users.${data.playerId}.room`);
    const roomPlayerData = await db.getPublicDataInRoom(roomId);
    io_.to(roomId).emit("roomPlayerData", roomPlayerData);
  });
}

// todo: check if room is already started to prevent people from doing stupid crap
function handleStartGame(socket) {
  socket.on("startGame", async (data) => {
    const ownPlayerData = await db.getProperty(`users.${data.playerId}`);
    const { room } = ownPlayerData;

    // get things rolling
    await rotatePlayerUp(room);

    // todo: deal 10 cards to everybody in room.
    await db.dealCardsInRoom(room);

    // todo: setup a way for a PROCTOR to notify everybody that 10 cards were dealt.
    // get each socket, and to each socket send that
    await sendPlayersOwnData(room, io_);
    await sendDrawDiscard(room, io_);

    // set the playerUp and drew, played, discarded to false
    await sendGameState(room, io_);

    // todo: send the phases object to the clients.

    io_.to(room).emit("gameStarted");
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

function handleChat(socket) {
  socket.on("chatMessage", (data) => {
    // console.log("chat:", data);
    io_.to(data.room).emit("chatMessage", data);
  });
}

module.exports = initializeIO;
