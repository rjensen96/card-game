const { getDB, getProperty } = require("./read");
const { setDB, setProperty } = require("./write");

async function deleteUserBySocketId(socketId) {
  const dbUser = await getProperty(`users.${socketId}`);
  if (dbUser) {
    // get the room name and remove the user from the room
    const roomId = dbUser.room;
    let socketsInRoom = await getProperty(`rooms.${roomId}.users`);
    socketsInRoom = socketsInRoom.filter((id) => id !== socketId);
    await setProperty(`rooms.${roomId}.users`, socketsInRoom);

    // delete the user outright
    const db = await getDB();
    delete db.users[socketId];
    await setDB(db);
  }
}

module.exports = { deleteUserBySocketId };
