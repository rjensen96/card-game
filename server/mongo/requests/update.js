const RoomModel = require("../models/room");
const PlayerModel = require("../models/player");

async function addPlayerToRoom(playerDocId, roomDocId) {
  // IMPORTANT!!
  // tutorial for CRUD stuff:
  // https://www.freecodecamp.org/news/mongodb-mongoose-node-tutorial/

  try {
    const room = await RoomModel.findById(roomDocId);
    const player = await PlayerModel.findById(playerDocId);

    room.players.push(player._id);

    // IMPORTANT - when saving as async/await, must NOT pass a callback to the .save() method!
    // save() with a callback is an old promise way, so await does nothing and more code will execute.
    await room.save();
  } catch (error) {
    console.error(error);
  }
}

async function setPlayerGamename(playerId, gamename) {
  try {
    const player = await PlayerModel.findOne({ playerId });
    player.gamename = gamename;
    await player.save();
  } catch (error) {
    console.error(error);
  }
}

///////////////////////////////////////
///////////   GAMEFLOW    /////////////
///////////////////////////////////////
async function rotatePlayerUp(roomId) {
  try {
    const room = await RoomModel.findOne({ roomId });

    // if gameStarted flag isn't set, it should be.
    if (!room.gameStarted) {
      room.gameStarted = true;
    }

    // player up is whoever is in players[0]
    // dequeue and enqueue player[0] to rotate who's up
    room.players.push(room.players.shift());

    room.drew = false;
    room.played = false;
    room.discarded = false;

    await room.save();
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {String} roomId 4-char roomId
 */
async function dealCards(roomId) {
  try {
    const room = await RoomModel.findOne({ roomId }).populate("players");

    for (let i = 0; i < 10; i++) {
      room.players.forEach((player) => {
        player.hand.push(room.drawPile.pop());
      });
    }

    // save the updates to the room and each player (trying Promise.all to speed up?).
    // https://stackoverflow.com/questions/61468695/speed-up-execution-of-multiple-async-await-calls?rq=1

    const promises = [];
    promises.push(room.save());

    room.players.forEach(async (player) => {
      promises.push(player.save());
    });

    return Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addPlayerToRoom,
  setPlayerGamename,
  rotatePlayerUp,
  dealCards,
};
