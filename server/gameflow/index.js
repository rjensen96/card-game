// for now, everything can go in here, but we might eventually want to make this more modular.

const db = require("../database");
const {
  sendPlayersOwnData,
  sendGameState,
  sendDrawDiscard,
} = require("../sockets/pushResponses");

//todo: check that below writes db correctly (references tricky)
/**
 * Puts the player at [0] in players list at the back of the queue
 * Sets drew, played, discarded to false
 *
 * @param {String} roomId
 */
async function rotatePlayerUp(roomId) {
  const fullDB = await db.getDB();
  const roomData = fullDB.rooms[roomId];

  // dequeue and enqueue the current user to rotate who's up
  roomData.users.push(roomData.users.shift());

  roomData.drew = false;
  roomData.played = false;
  roomData.discarded = false;

  // re-write the database
  await db.setDB(fullDB);
}

async function endCurrentPhase() {
  // // collect everyone's cards, calculate points, shuffle the deck.
  // roomData.users.forEach((socketId) => {
  //   // get their hand
  //   const userHand = fullDB.users[socketId].hand;
  //   // score their hand
  //   fullDB.users[socketId].points += scoreHand(userHand);
  //   // collect their hand
  //   roomData.drawPile.push(...userHand);
  //   fullDB.users[socketId].hand = [];
  // });
  // // collect the discard pile
  // roomData.drawPile.push(...roomData.discardPile);
  // roomData.discardPile = [];
  // // shuffle the draw pile
  // shuffle(roomData.drawPile);
}

async function drawCard(io, socketId, pileName) {
  const fullDB = await db.getDB();
  const roomId = fullDB.users[socketId].room;

  // todo: ensure users array has data??
  const playerUp = fullDB.rooms[roomId].users[0];
  const drew = fullDB.rooms[roomId].drew;

  let card;

  // SAFETY MEASURES:
  // ensure it's actually the turn of the player drawing
  // ensure that player hasn't already drawn
  if (socketId !== playerUp) {
    return io
      .to(socketId)
      .emit("proctorMessage", "It's not your turn, so you can't do that.");
  } else if (drew) {
    return io
      .to(socketId)
      .emit("proctorMessage", "You already drew, so you can't do that.");
  }

  if (pileName === "draw") {
    card = fullDB.rooms[roomId].drawPile.pop() || null;
  } else if (pileName === "discard") {
    card = fullDB.rooms[roomId].discardPile.pop() || null;
  }

  if (card === null) {
    return io
      .to(socketId)
      .emit("proctorMessage", `There's no card in the ${pileName} pile.`);
  } else {
    // add the card to the player's hand and send player's own data back.
    fullDB.users[socketId].hand.push(card);

    // set flag that player drew.
    fullDB.rooms[roomId].drew = true;

    // re-write the database (looking forward to using mongo lol)
    await db.setDB(fullDB);

    // send playersowndata.
    // this sends to everyone, but they'll need the updated number of cards that this person has.

    await sendGameState(roomId, io);
    await sendPlayersOwnData(roomId, io);
    await sendDrawDiscard(roomId, io);
  }

  // otherwise, send the card if it exists. other otherwise, send a proctor message that there's no card!
}

async function discard(io, socketId, card) {
  const fullDB = await db.getDB();
  const roomId = fullDB.users[socketId].room;

  // todo: ensure users array has data??
  const playerUp = fullDB.rooms[roomId].users[0];
  const drew = fullDB.rooms[roomId].drew;

  // ensure it's ok for the player to discard (their turn and drew)
  if (playerUp !== socketId) {
    return io
      .to(socketId)
      .emit("proctorMessage", "It's not your turn, so you can't do that.");
  } else if (!drew) {
    return io
      .to(socketId)
      .emit("proctorMessage", "You need to draw a card before discarding.");
  }

  // todo: any other validation.

  // ensure player has the card they're trying to discard.
  const hand = fullDB.users[socketId].hand;
  let removedCard = null;

  // find and remove the card from their hand
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].key === card.key) {
      removedCard = hand.splice(i, 1)[0];
      break;
    }
  }

  if (!removedCard) {
    return io
      .to(socketId)
      .emit(
        "proctorMessage",
        "Somehow you don't have that card. Try selecting and discarding again."
      );
  }

  // add card to discard pile
  fullDB.rooms[roomId].discardPile.push(removedCard);

  // re-write the Db
  await db.setDB(fullDB);

  // discard ends the turn, so need to rotate game.
  await rotatePlayerUp(roomId);

  // push changes
  await sendGameState(roomId, io);
  await sendPlayersOwnData(roomId, io);
  await sendDrawDiscard(roomId, io);
}

function scoreHand(hand) {
  let points = 0;
  hand.forEach((card) => {
    if (card.value <= 9) {
      points += 5;
    } else {
      points += 10;
    }
    // later on, we'll have skips and wilds and that will be another layer.
  });
  return points;
}

/**
 * Shuffles an array of cards in place.
 * @param {Card[]} cards
 */
function shuffle(cards) {
  // for twice the length of the card set
  for (let i = 0; i < cards.length * 2; i++) {
    // get random card index
    const randIdx = Math.floor(Math.random() * cards.length);

    // swap with first index
    const temp = cards[randIdx];
    cards[randIdx] = cards[0];
    cards[0] = temp;
  }
}

module.exports = { rotatePlayerUp: rotatePlayerUp, drawCard, discard };
