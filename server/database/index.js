const {
  getProperty,
  getDB,
  hasProperty,
  getGamenamesInRoom,
  getPublicDataInRoom,
} = require("./read");
const { setProperty, setDB, dealCardsInRoom } = require("./write");

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
  dealCardsInRoom,
};

module.exports = db;
