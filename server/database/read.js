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

// getProperty("rooms.abc.users").then((data) => console.log(data));

module.exports = { getDB, getProperty };
