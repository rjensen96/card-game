const db = require("../database");

async function sendPlayersOwnData(roomId, io) {
  const fullDB = await db.getDB();
  const users = fullDB.rooms[roomId].users;

  users.forEach((socketId) => {
    const userData = fullDB.users[socketId];
    io.to(socketId).emit("ownPlayerData", userData);
  });
}

module.exports = { sendPlayersOwnData };
