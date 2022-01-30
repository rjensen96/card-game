const RoomModel = require("../models/room");
const PlayerModel = require("../models/player");

async function getPublicRoomData(roomDocId) {
  try {
    if (!RoomModel.exists({ _id: roomDocId })) {
      console.error(
        "Requested data for room that does not exist : " + roomDocId
      );
      return undefined;
    }

    const room = await RoomModel.findById(roomDocId)
      .populate("players")
      .lean()
      .exec();

    return extractPublicRoomData(room);
  } catch (error) {
    console.error(error);
  }
}

/**
 * This is the single place where we actually extract this data from the room
 * There is a synchronous and async function that both want this data, so this is the one place where we get the fields.
 * @param {THE ACTUAL ROOM DOCUMENT} room
 */
function extractPublicRoomData(room) {
  const { numPhases } = room;
  return room.players.map((player) => {
    return {
      gamename: player.gamename,
      points: player.points,
      phase: player.phases[0],
      phaseNumber: numPhases - player.phases.length + 1,
    };
  });
}

async function getPlayerByPlayerId(playerId) {
  const player = await PlayerModel.findOne({ playerId })
    .populate("room")
    .lean();
  return player;
}

async function getRoomOfPlayerId(playerId) {
  try {
    const player = await PlayerModel.findOne({ playerId }).populate("room");
    if (!player) {
      return false;
    }
    return await RoomModel.findOne({ roomId: player.room.roomId })
      .populate("players")
      .exec();
  } catch (error) {
    console.error(error);
  }
}

async function getRoomByRoomId(roomId) {
  try {
    if (!RoomModel.exists({ roomId })) {
      return false;
    }

    return await RoomModel.findOne({ roomId })
      .populate("players")
      .lean()
      .exec();
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getPublicRoomData,
  getPlayerByPlayerId,
  getRoomOfPlayerId,
  getRoomByRoomId,
  extractPublicRoomData,
};
