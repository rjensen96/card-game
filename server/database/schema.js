const fs = require("fs").promises;

const INITIAL_DB = {
  rooms: {
    abc: {
      users: ["Ryan", "Sydney"],
      skipped: [],
      playerUp: "Ryan",
      drawPile: [],
      discardPile: [],
    },
  },
  users: {
    Ryan: {
      room: "abc",
      socketId: null,
      hand: [
        { color: "blue", value: 10 },
        { color: "red", value: 9 },
        { color: "yellow", value: 4 },
        { color: "green", value: 1 },
        { color: "green", value: 2 },
        { color: "green", value: 3 },
        { color: "green", value: 4 },
        { color: "green", value: 5 },
        { color: "green", value: 6 },
      ],
      points: 0,
      phase: 1,
    },
    Sydney: {
      room: "abc",
      socketId: null,
      hand: [
        { color: "yellow", value: 10 },
        { color: "blue", value: 9 },
        { color: "green", value: 4 },
        { color: "red", value: 10 },
        { color: "red", value: 9 },
        { color: "blue", value: 8 },
        { color: "blue", value: 7 },
        { color: "green", value: 5 },
      ],
      points: 100,
      phase: 1,
    },
  },
};

function writeSchemaToFile() {
  fs.writeFile("db.json", JSON.stringify(INITIAL_DB), (err) => {
    if (err) {
      console.error(err);
    }
  });
}

writeSchemaToFile();
