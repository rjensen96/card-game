const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  playerId: String,
  gamename: String,
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  completedPhase: Boolean,
  hand: [],
  points: Number,
  phases: [],
  lastSeen: Date,
});

module.exports = mongoose.model("Player", PlayerSchema);
