const {
  getProperty,
  getDB,
  hasProperty,
  getGamenamesInRoom,
  getPublicDataInRoom,
} = require("./read");
const { setProperty, setDB } = require("./write");

const { deleteUserBySocketId } = require("./delete");

const db = {
  getProperty,
  getGamenamesInRoom,
  getPublicDataInRoom,
  getDB,
  hasProperty,
  setProperty,
  setDB,
  deleteUserBySocketId,
};

module.exports = db;
