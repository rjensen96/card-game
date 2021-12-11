const {
  getProperty,
  getDB,
  hasProperty,
  getGamenamesInRoom,
} = require("./read");
const { setProperty, setDB } = require("./write");

const { deleteUserBySocketId } = require("./delete");

const db = {
  getProperty,
  getGamenamesInRoom,
  getDB,
  hasProperty,
  setProperty,
  setDB,
  deleteUserBySocketId,
};

module.exports = db;
