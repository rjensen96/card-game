const RoomModel = require("../models/room");
const PlayerModel = require("../models/player");
const { phases } = require("../../types/phases");
const { addPlayerToRoom } = require("./update");
const { shuffle } = require("../../gameflow/utils");

/**
 * Creates a new room in the database with a randomly generated 4-letter ID.
 * @returns newly created room document.
 */
async function createRoom() {
  const randomRoomId = () => {
    const minChar = "A".charCodeAt(0);
    const maxChar = "Z".charCodeAt(0);
    const charCodes = [];
    for (let i = 0; i < 4; i++) {
      charCodes.push(
        Math.floor(Math.random() * (maxChar - minChar + 1)) + minChar
      );
    }
    return String.fromCharCode(...charCodes);
  };

  // TEMPORARY: delete all the existing rooms and players to clean up the db
  RoomModel.deleteMany({}, handleError);
  PlayerModel.deleteMany({}, handleError);

  // get new UNIQUE room key.
  let newRoomId = "";
  do {
    newRoomId = randomRoomId();
  } while (!RoomModel.exists({ roomId: newRoomId }));

  const drawPile = generateDeck(true);
  const discardPile = [drawPile.pop()];

  // create room with the new id
  const newRoom = await RoomModel.create({
    roomId: newRoomId,
    players: [],
    drawPile,
    discardPile,
    drew: false,
    played: false,
    discarded: false,
    roundIsOver: false,
    gameStarted: false,
    gameIsOver: false,
  });

  // return the new room document
  return newRoom;
}

/**
 *
 * @param {String} playerId - unique id (likely the socket.id) of the player
 * @param {String} roomDocId - id of room player is in
 * @returns the new player document
 */
async function createPlayer(playerId, roomDocId) {
  try {
    // delete player if it already exists.
    if (PlayerModel.exists({ playerId: playerId })) {
      PlayerModel.deleteOne({ playerId: playerId });
    }

    const newPlayer = await PlayerModel.create({
      playerId: playerId,
      gamename: "",
      room: roomDocId,
      completedPhase: false,
      hand: [],
      points: 0,
      phases: [...phases],
    });

    await addPlayerToRoom(newPlayer._id, roomDocId);
    return newPlayer;
  } catch (error) {
    console.error(error);
  }
}

/////////////////////////////////////////////
//////////    UTIL TYPE THINGS    ///////////
/////////////////////////////////////////////

function handleError(err) {
  if (err) {
    return console.error(err);
  }
}

function generateDeck(doShuffle) {
  const deck = [];
  for (let round = 0; round < 2; round++) {
    for (let color = 1; color < 5; color++) {
      for (let value = 1; value < 12; value++) {
        const card = {
          value,
          text: value.toFixed(0),
          color,
          key: color + "-" + value + "-" + round,
        };
        deck.push(card);
      }
    }
  }

  // also add some wild cards.
  for (let round = 0; round < 8; round++) {
    const card = {
      value: 0,
      text: "W",
      color: 0,
      key: "W-" + round,
    };
    deck.push(card);
  }

  if (doShuffle) {
    shuffle(deck);
  }
  return deck;
}

module.exports = { createRoom, createPlayer };
