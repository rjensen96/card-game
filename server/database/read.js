const _ = require("lodash");
const fs = require("fs");
const path = require("path");

/**
 *
 * @returns the whole durn database as an object
 */
async function getDB() {
  try {
    const filepath = path.join(__dirname, "db.json");
    const db = JSON.parse(fs.readFileSync(filepath));
    // return JSON.parse(await fs.readFile(filepath));
    return db;
  } catch (err) {
    console.error(err);
  }
}

async function getProperty(path) {
  try {
    const db = await getDB();
    return _.get(db, path);
  } catch (error) {
    console.error(error);
  }
}

async function hasProperty(path) {
  try {
    const db = await getDB();
    return _.has(db, path);
  } catch (error) {
    console.error(error);
  }
}

async function getGamenamesInRoom(roomId) {
  try {
    const db = await getDB();
    if (!_.has(db, `rooms.${roomId}.users`)) {
      return [];
    }

    const socketIds = _.get(db, `rooms.${roomId}.users`);
    const gamenames = socketIds.map((socketId) => {
      return db.users[socketId].gamename;
    });

    return gamenames;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Returns an array of the data that is safe to send to all players in a room about each player in the room.
 * @param {String} roomId
 */
async function getPublicDataInRoom(roomId) {
  const db = await getDB();

  if (!_.has(db, `rooms.${roomId}.users`)) {
    return [];
  }

  const socketIds = _.get(db, `rooms.${roomId}.users`);
  const publicData = socketIds.map((socketId) => {
    const obj = {};
    obj.gamename = db.users[socketId].gamename;
    obj.points = db.users[socketId].points;
    obj.phaseNumber = db.users[socketId].phaseNumber;
    obj.phase = db.users[socketId].phase;
    return obj;
  });

  return publicData;
}

module.exports = {
  getDB,
  getProperty,
  hasProperty,
  getGamenamesInRoom,
  getPublicDataInRoom,
};
