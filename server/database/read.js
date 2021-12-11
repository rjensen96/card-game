const _ = require("lodash");
const fs = require("fs").promises;
const path = require("path");

/**
 *
 * @returns the whole durn database as an object
 */
async function getDB() {
  try {
    const filepath = path.join(__dirname, "db.json");
    return JSON.parse(await fs.readFile(filepath));
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
    console.log("socketids...", socketIds);
    const gamenames = socketIds.map((socketId) => {
      return db.users[socketId].gamename;
    });

    return gamenames;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getDB, getProperty, hasProperty, getGamenamesInRoom };
