const express = require("express");
const router = express.Router();

const rooms = {};

const getRoom = (roomId) => {
  if (!Object.keys(rooms).includes(roomId)) {
    rooms[roomId] = { users: [] };
  }
  return rooms[roomId];
};

/* GET rooms listing. */
router.get("/", function (req, res, next) {
  res.json(rooms);
});

/* POST joins a room. */
router.post("/:roomId/:userId", (req, res, next) => {
  // https://stackoverflow.com/questions/18856190/use-socket-io-inside-a-express-routes-file
  const io = req.app.get("socketio");

  console.log("made it here");
  const room = getRoom(req.params.roomId);
  room.users.push(req.params.userId);
  res.json(rooms); // just send the rooms back.... I guess
});

module.exports = router;
