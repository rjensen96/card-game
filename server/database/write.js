const _ = require("lodash");
const fs = require("fs").promises;
const path = require("path");
const { getDB } = require("./read");

/**
 * Writes the provided db object to the db.json file
 * @param {Object} newDB - the updated db object (non-serialized!)
 * @returns Promise
 */
async function setDB(newDB) {
  const filepath = path.join(__dirname, "db.json");
  return await fs.writeFile(filepath, JSON.stringify(newDB));
}

/**
 * Overwrites an old value in the database to a new value.
 * @param {String} path - path in db to update like "users.Ryan.hand"
 * @param {*} value - new value to set at path. Old value will be overwritten.
 * @returns Promise
 */
async function setProperty(path, value) {
  try {
    const db = await getDB();
    _.set(db, path, value);
    return setDB(db);
  } catch (error) {
    console.error(error);
  }
}

// todo: if this gets boggy, have a variable for 'hasChanges' or something that read can use.
// that way we can use a cached version of the db whenever possible.
// granted, in the future this won't really matter because I'll be using Mongo

module.exports = { setDB, setProperty };
