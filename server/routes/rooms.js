const express = require("express");
const db = require("../database");
const { Player } = require("../types/types");
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

/**
 * POST to join a room.
 */
router.post("/:roomId/join", async (req, res, next) => {
  // https://stackoverflow.com/questions/18856190/use-socket-io-inside-a-express-routes-file
  const io = req.app.get("socketio");
  const targetRoomId = req.params.roomId.toUpperCase();

  // check if room exists.
  // if not -> send 404
  // if so -> join socket to room.
  const roomExists = await db.hasProperty(`rooms.${targetRoomId}`);
  if (roomExists) {
    // add user socketId to room
    let socketsInRoom = await db.getProperty(`rooms.${targetRoomId}.users`);
    socketsInRoom.push(req.body.socketId);
    socketsInRoom = [...new Set(socketsInRoom)]; // ensure sockets are only in there once
    await db.setProperty(`rooms.${targetRoomId}.users`, socketsInRoom);

    // add user to users
    const player = new Player(req.body.socketId, targetRoomId);
    await db.setProperty(`users.${player.socketId}`, player);
  } else {
    res.status(404).send(`Room ${targetRoomId} does not exist.`);
  }

  const playersInRoom = await db.getGamenamesInRoom(targetRoomId);
  res.json({ roomId: targetRoomId, playersInRoom });
});

/**
 * POST method to create a new room.
 */
router.post("/:roomId/create", (req, res, next) => {
  console.log("requested room create");
});

module.exports = router;
