const { getProperty, getDB } = require("./read");
const { setProperty, setDB } = require("./write");

const db = {
  getProperty,
  getDB,
  setProperty,
  setDB,
};

module.exports = db;
