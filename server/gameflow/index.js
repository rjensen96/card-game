// for now, everything can go in here, but we might eventually want to make this more modular.

const { getPublicDataInRoom } = require("../database");
const db = require("../database");
const {
  sendPlayersOwnData,
  sendGameState,
  sendDrawDiscard,
  sendPublicPlayerData,
} = require("../sockets/pushResponses");
const { phases } = require("../types/phases");
const {
  playerHasAllCards,
  playerCompletedPhase,
  isCardSet,
  isCardRun,
  allSameColor,
} = require("./validation");

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

async function advanceRound(roomId, io) {
  const fullDB = await db.getDB();
  const roomData = fullDB.rooms[roomId];

  if (!roomData.roundIsOver) {
    return;
  }

  // endCurrentRound already took care of shuffling, collecting cards, etc.
  // need to deal new cards though.

  roomData.roundIsOver = false;
  const drawPile = fullDB.rooms[roomId].drawPile;

  // deal cards (this should probably be its own function)
  for (let i = 0; i < 10; i++) {
    roomData.users.forEach((socketId) => {
      const user = fullDB.users[socketId];
      user.hand.push(drawPile.pop());
    });
  }

  await db.setDB(fullDB);

  await sendPublicPlayerData(roomId, io);
  await sendDrawDiscard(roomId, io);
  await sendPlayersOwnData(roomId, io);
  await sendGameState(roomId, io);
}

async function endCurrentRound(roomId, io) {
  const fullDB = await db.getDB();
  const roomData = fullDB.rooms[roomId];
  roomData.roundIsOver = true;

  // collect everyone's cards, calculate points, shuffle the deck.
  roomData.users.forEach(async (socketId) => {
    // get their hand
    const userHand = fullDB.users[socketId].hand;
    // score their hand
    fullDB.users[socketId].points += scoreHand(userHand);
    // collect their hand
    roomData.drawPile.push(...userHand);
    fullDB.users[socketId].hand = [];

    // collect all cards from their phases
    const phase = fullDB.users[socketId].phase;
    phase.forEach((phaseItem) => {
      roomData.drawPile.push(...phaseItem.cards);
      phaseItem.cards = [];
    });

    // advance their phase if completed
    if (fullDB.users[socketId].completedPhase) {
      advancePlayerPhase(socketId);
    }

    // const completedPhase = await playerCompletedPhase(socketId);
    // if (completedPhase) {
    //   const newPhaseNumber = fullDB.users[socketId].phaseNumber + 1;
    //   fullDB.users[socketId].phaseNumber = newPhaseNumber;
    //   fullDB.users[socketId].phase = phases[newPhaseNumber];
    // }
  });
  // collect the discard pile
  roomData.drawPile.push(...roomData.discardPile);
  roomData.discardPile = [];

  // shuffle the draw pile
  shuffle(roomData.drawPile);

  // re-write db and tell everyone that the round ended.
  await db.setDB(fullDB);
  await sendGameState(roomId, io);
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

  // if player did not complete their phase, take the cards in their phase and put those back in their hand.
  // then tell them why.
  const completedPhase = await playerCompletedPhase(socketId);
  const phase = fullDB.users[socketId].phase;

  if (!completedPhase) {
    phase.forEach((phaseItem) => {
      hand.push(...phaseItem.cards);
      phaseItem.cards = [];
    });
    io.to(socketId).emit(
      "proctorMessage",
      "You didn't complete your phase, so I gave your cards back."
    );
  }

  // re-write the Db
  await db.setDB(fullDB);

  // discard ends the turn, so need to rotate game.
  await rotatePlayerUp(roomId);

  // push changes
  await sendGameState(roomId, io);
  await sendPlayersOwnData(roomId, io);
  await sendDrawDiscard(roomId, io);

  // Did the player Go Out (no more cards) ? If so, end the current round.
  if (hand.length === 0) {
    // console.log("ending round"); // this works
    endCurrentRound(roomId, io);
  }
}

async function advancePlayerPhase(socketId) {
  const fullDB = await db.getDB();
  const newPhaseNumber = fullDB.users[socketId].phaseNumber++;
  fullDB.users[socketId].phase = phases[newPhaseNumber];
  await db.setDB(fullDB);
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

async function playCards(io, playerSocketId, data) {
  const fullDB = await db.getDB();
  const roomId = fullDB.users[playerSocketId].room;
  const roomData = fullDB.rooms[roomId];

  // make sure it's the player's turn.
  const playerUpId = fullDB.rooms[roomId].users[0];

  if (playerUpId !== playerSocketId) {
    return io.to(playerSocketId).emit("proctorMessage", "It's not your turn.");
  }

  // ensure the player has the cards they are trying to play.
  if (!playerHasAllCards(playerSocketId, data.cards)) {
    return io
      .to(playerSocketId)
      .emit(
        "proctorMessage",
        "You don't actually have the cards you're trying to play."
      );
  }

  // get socket id of whoever this player is trying to play onto the cards of.
  // i.e - Jack wants to lay cards on Jill's pile.
  const targetGamename = data.gamename;
  let targetSocketId = null;
  for (let i = 0; i < roomData.users.length; i++) {
    const currentSocket = roomData.users[i];
    if (fullDB.users[currentSocket].gamename === targetGamename) {
      targetSocketId = currentSocket;
    }
  }

  if (!targetSocketId) {
    return io
      .to(playerSocketId)
      .emit("proctorMessage", "Somehow that player doesn't exist.");
  }

  // if playing on someone else's hand, both players must have finished their own phase already.
  if (playerSocketId !== targetSocketId) {
    const playerFinished = await playerCompletedPhase(playerSocketId);
    const targetFinished = await playerCompletedPhase(targetSocketId);
    if (!playerFinished) {
      return io
        .to(playerSocketId)
        .emit(
          "proctorMessage",
          "You must complete your own phase before playing elsewhere."
        );
    } else if (!targetFinished) {
      return io
        .to(playerSocketId)
        .emit(
          "proctorMessage",
          "You can't do that because they haven't completed their phase yet."
        );
    }
  }

  const phaseItem = fullDB.users[targetSocketId].phase[data.phaseIndex];

  // ensure phase item actually exists
  if (!phaseItem) {
    return io
      .to(playerSocketId)
      .emit("proctorMessage", "That phase item doesn't exist.");
  }

  // if player is completing phase for first time, ensure they are playing enough cards.
  const completedPhase = await playerCompletedPhase(playerSocketId);
  if (!completedPhase && phaseItem.size > data.cards.length) {
    return io.to(playerSocketId).emit("proctorMessage", "Too few cards.");
  }

  phaseItem.cards.push(...data.cards);

  // ensure pattern matches.
  if (phaseItem.pattern === "set" && !isCardSet(phaseItem.cards)) {
    return io
      .to(playerSocketId)
      .emit(
        "proctorMessage",
        "That is not a set. Cards of the same number make a set."
      );
  } else if (phaseItem.pattern === "run" && !isCardRun(phaseItem.cards)) {
    return io
      .to(playerSocketId)
      .emit(
        "proctorMessage",
        "That is not a run. A sequence of cards with no repeats make a run."
      );
  } else if (phaseItem.pattern === "color" && !allSameColor(phaseItem.cards)) {
    return io
      .to(playerSocketId)
      .emit("proctorMessage", "All cards must be of same color.");
  }

  // at this point, it's valid.
  // remove the cards from their hand and put them in the phases.

  /*
    1. set the phase item at phase index to the current version of phaseItem
    2. Remove the cards from player's hand
    3. broadcast results.
  */

  // 1. set the phase item at phase index to the current version of phaseItem
  const newPhaseData = fullDB.users[targetSocketId].phase;

  // if newPhaseData is a completed phase, set the flag on user object
  if (newPhaseData.every((itm) => itm.cards.length >= itm.size)) {
    await db.setProperty(`users.${targetSocketId}.completedPhase`, true);
  }

  await db.setProperty(`users.${targetSocketId}.phase`, newPhaseData);

  // 2. Remove the cards from player's hand
  let playerHand = fullDB.users[playerSocketId].hand;
  const playedKeys = data.cards.map((card) => card.key);
  playerHand = playerHand.filter((card) => {
    if (!playedKeys.includes(card.key)) {
      return card;
    }
  });

  await db.setProperty(`users.${playerSocketId}.hand`, playerHand);

  // 3. broadcast results.
  await sendGameState(roomId, io);
  await sendPlayersOwnData(roomId, io);
  await sendPublicPlayerData(roomId, io);

  // Did the player Go Out (no more cards) ? If so, end the current round.
  if (playerHand.length === 0) {
    endCurrentRound(roomId, io);
  }
}

module.exports = { rotatePlayerUp, drawCard, discard, playCards, advanceRound };
