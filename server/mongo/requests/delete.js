const RoomModel = require("../models/room");
const PlayerModel = require("../models/player");

/**
 * Clears out any rooms in Mongo with a timestamp more than a day old.
 * Also deletes the users associated with those rooms.
 */
async function deleteOldRoomsAndPlayers() {
  try {
    let destroyDate = new Date();
    destroyDate.setDate(destroyDate.getDate() - 2);

    await RoomModel.deleteMany({ lastSeen: { $lte: destroyDate } });
    await PlayerModel.deleteMany({ lastSeen: { $lte: destroyDate } });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { deleteOldRoomsAndPlayers };
