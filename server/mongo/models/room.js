const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// using other schemas inside a schema:
// https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
// (populate method)
const RoomSchema = new Schema({
  roomId: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  drawPile: [],
  discardPile: [],
  drew: Boolean,
  played: Boolean,
  discarded: Boolean,
  roundIsOver: Boolean,
  gameStarted: Boolean,
  gameIsOver: Boolean,
  lastSeen: Date,
});

module.exports = mongoose.model("Room", RoomSchema);
