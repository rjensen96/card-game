const db = require("../database");

async function sendPlayersOwnData(roomId, io) {
  const fullDB = await db.getDB();
  const users = fullDB.rooms[roomId].users;

  users.forEach((socketId) => {
    const userData = fullDB.users[socketId];
    io.to(socketId).emit("ownPlayerData", userData);
  });
}

async function sendDrawDiscard(roomId, io) {
  const fullDB = await db.getDB();

  const roomData = fullDB.rooms[roomId];
  const users = roomData.users;

  const draw = roomData.drawPile.pop() || null;
  const discard = roomData.discardPile.pop() || null;

  users.forEach((socketId) => {
    io.to(socketId).emit("drawDiscard", { draw, discard });
  });
}

async function sendGameState(roomId, io) {
  const fullDB = await db.getDB();
  const roomData = fullDB.rooms[roomId];
  const socketUp = roomData.users[0];
  const playerUp = fullDB.users[socketUp].gamename;

  const gameState = {
    playerUp,
    drew: roomData.drew,
    played: roomData.played,
    discarded: roomData.discarded,
  };

  io.to(roomId).emit("gameState", gameState);
}

module.exports = { sendPlayersOwnData, sendDrawDiscard, sendGameState };
