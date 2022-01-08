//  we want to make this more modular.
// validations & checks should be separate functions that return true/false to tell whether to return.
const {
  getRoomOfPlayerId,
  getRoomByRoomId,
} = require("../mongo/requests/read");

const {
  sendGameState,
  sendPlayersOwnData,
  sendDrawDiscard,
  sendPublicPlayerData,
} = require("../sockets/push-responses");
const {
  shuffle,
  ensureSocketJoinedRoom,
  removeCardsFromHand,
  addCardsToPhaseItem,
} = require("./utils");
const {
  handHasAllCards,
  isCardSet,
  isCardRun,
  allSameColor,
  phaseIsComplete,
} = require("./validation");

/**
 * Puts the player at [0] in players list at the back of the queue
 * Sets drew, played, discarded to false
 *
 * @param {*} room - a room document from mongo
 */
async function rotatePlayerUp(room) {
  // dequeue and enqueue the current user to rotate who's up
  room.players.push(room.players.shift());

  room.drew = false;
  room.played = false;
  room.discarded = false;

  // re-write the database
  await room.save();
}

async function advanceRound(room, io) {
  try {
    if (!room.roundIsOver) {
      return;
    }

    // endCurrentRound already took care of shuffling, collecting cards, etc.
    // need to deal new cards though.

    room.roundIsOver = false;
    const { drawPile } = room;

    // deal cards (this should probably be its own function)
    for (let i = 0; i < 10; i++) {
      room.players.forEach((player) => {
        player.hand.push(drawPile.pop());
      });
    }

    const promises = [];
    promises.push(room.save());
    room.players.forEach((player) => promises.push(player.save()));
    await Promise.all(promises);

    sendPublicPlayerData(room, io);
    sendDrawDiscard(room, io);
    sendPlayersOwnData(room, io);
    sendGameState(room, io);
  } catch (error) {
    console.error(error);
  }
}

async function endCurrentRound(room, io) {
  try {
    room.roundIsOver = true;

    // collect everyone's cards, calculate points, shuffle the deck.
    room.players.forEach((player) => {
      // get their hand
      const hand = player.hand;
      // score their hand
      player.points += scoreHand(hand);
      // collect their hand
      room.drawPile.push(...hand);
      player.hand = [];

      // collect all cards from their phases
      const phase = player.phases[0];
      phase.forEach((phaseItem) => {
        room.drawPile.push(...phaseItem.cards);
        phaseItem.cards = [];
      });

      // advance their phase if completed
      if (player.completedPhase) {
        player.phases.shift(); // removes phase[0] to advance phase.
        if (player.phases.length === 0) {
          room.gameIsOver = true;
        }
      }

      // unset player gamestate flags
      player.completedPhase = false;
    });

    // collect the discard pile
    room.drawPile.push(...room.discardPile);
    room.discardPile = [room.drawPile.pop()];

    // shuffle the draw pile
    shuffle(room.drawPile);

    // unset all room gamestate flags
    room.drew = false;
    room.played = false;
    room.discarded = false;

    // re-write db and tell everyone that the round ended.
    const promises = [];
    promises.push(room.save());
    room.players.forEach((player) => promises.push(player.save()));
    await Promise.all(promises);

    sendGameState(room, io);
  } catch (error) {
    console.error(error);
  }
}

async function drawCard(io, data) {
  try {
    const { playerId, socket, pileName } = data;
    const room = await getRoomOfPlayerId(playerId);
    // TODO:
    // this crashes with an unhandled promise rejection if I lock my computer and come back
    // need to check what socketId is after lock/unlock
    // also, should trycatch this whole thing.
    // need a way to gracefully allow reconnecting.
    // likely, that means using playerId instead of socketId.

    if (room.gameIsOver) {
      return;
    }

    ensureSocketJoinedRoom(socket, room.roomId);

    const { drew } = room;
    const playerUp = room.players[0]; // this is the line that dies if lock/unlock

    // SAFETY MEASURES:
    // ensure it's actually the turn of the player drawing
    // ensure that player hasn't already drawn

    if (playerId !== playerUp.playerId) {
      return io
        .to(socket.id)
        .emit("proctorMessage", "It's not your turn, so you can't do that.");
    } else if (drew) {
      return io
        .to(socket.id)
        .emit("proctorMessage", "You already drew, so you can't do that.");
    }

    let card = null;

    if (pileName === "draw") {
      card = room.drawPile.pop() || null;
    } else if (pileName === "discard") {
      card = room.discardPile.pop() || null;
    }

    if (card === null) {
      return io
        .to(socket.id)
        .emit("proctorMessage", `There's no card in the ${pileName} pile.`);
    }

    // add the card to the player's hand and send player's own data back.
    playerUp.hand.push(card);

    // set flag that player drew.
    room.drew = true;
    playerUp.lastSeen = new Date(); // update this so they don't get deleted (but they have 2 days)

    await Promise.all([room.save(), playerUp.save()]);

    // send playersowndata.
    // this sends to everyone, but they'll need the updated number of cards that this person has
    sendGameState(room, io);
    sendPlayersOwnData(room, io);
    sendDrawDiscard(room, io);
  } catch (error) {
    console.error(error);
  }
}

async function discard(io, data) {
  try {
    const { playerId, socket, card } = data;
    const room = await getRoomOfPlayerId(playerId);

    if (room.gameIsOver || !card) {
      return;
    }

    ensureSocketJoinedRoom(socket, room.roomId);

    const { drew } = room;
    const playerUpId = room.players[0].playerId;
    const playerUp = room.players[0];

    // ensure it's ok for the player to discard (their turn and drew)
    if (playerUpId !== playerId) {
      return io
        .to(socket.id)
        .emit("proctorMessage", "It's not your turn, so you can't do that.");
    } else if (!drew) {
      return io
        .to(socket.id)
        .emit("proctorMessage", "You need to draw a card before discarding.");
    }

    // todo: any other validation.

    // ensure player has the card they're trying to discard.
    const hand = playerUp.hand;
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
        .to(socket.id)
        .emit(
          "proctorMessage",
          "Somehow you don't have that card. Try selecting and discarding again."
        );
    }

    // add card to discard pile
    room.discardPile.push(removedCard);

    // if player did not complete their phase, take the cards in their phase and put those back in their hand.
    // then tell them why.
    if (!playerUp.completedPhase && room.played) {
      const phase = playerUp.phases[0];
      phase.forEach((phaseItem) => {
        hand.push(...phaseItem.cards);
        phaseItem.cards = [];
      });

      playerUp.markModified("phases");
      playerUp.markModified("hand");

      // todo: this would be more effective as a chat message.
      // the gameflow causes it to disappear as a proctorMessage
      io.to(socket.id).emit(
        "proctorMessage",
        "You didn't complete your phase, so I gave your cards back."
      );
    }

    // re-write the Db
    room.lastSeen = new Date(); // update room timestamp.
    await Promise.all([room.save(), playerUp.save()]);

    // discard ends the turn, so need to rotate game.
    await rotatePlayerUp(room);

    // push changes
    sendGameState(room, io);
    sendPlayersOwnData(room, io);
    sendDrawDiscard(room, io);
    sendPublicPlayerData(room, io);

    // Did the player Go Out (no more cards) ? If so, end the current round.
    if (hand.length === 0) {
      // console.log("ending round"); // this works
      endCurrentRound(room, io);
    }
  } catch (error) {
    console.error(error);
  }
}

function scoreHand(hand) {
  let points = 0;
  hand.forEach((card) => {
    const isWild = card.key.includes("W");
    if (isWild) {
      points += 25;
    } else if (card.value > 9) {
      points += 10;
    } else {
      points += 5;
    }
  });
  return points;
}

async function playCards(io, data) {
  try {
    const { playerId, socket } = data;
    const room = await getRoomOfPlayerId(playerId);

    if (room.gameIsOver) {
      return;
    }

    ensureSocketJoinedRoom(socket, room.roomId);

    // make sure it's the player's turn.
    const playerUp = room.players[0];
    const playerUpId = playerUp.playerId;
    let rejectMsg = "";

    if (playerUpId !== playerId) {
      return io.to(playerId).emit("proctorMessage", "It's not your turn.");
    }

    // ensure the player has the cards they are trying to play.
    if (!handHasAllCards(playerUp.hand, data.cards)) {
      return io
        .to(playerId)
        .emit(
          "proctorMessage",
          "You don't actually have the cards you're trying to play."
        );
    }

    // get socket id of whoever this player is trying to play onto the cards of.
    // i.e - Jack wants to lay cards on Jill's pile.
    const targetGamename = data.gamename;
    let targetPlayerId = null;
    let targetPlayer = null;

    for (let i = 0; i < room.players.length; i++) {
      const currentPlayer = room.players[i];
      if (currentPlayer.gamename === targetGamename) {
        targetPlayerId = currentPlayer.playerId;
        targetPlayer = room.players[i];
      }
    }

    if (!targetPlayerId) {
      return io
        .to(playerId)
        .emit("proctorMessage", "Somehow that player doesn't exist.");
    }

    // if playing on someone else's hand, both players must have finished their own phase already.
    const playerCompletedPhase = phaseIsComplete(playerUp.phases[0]);
    const targetCompletedPhase = phaseIsComplete(targetPlayer.phases[0]);

    if (playerId !== targetPlayerId) {
      if (!playerCompletedPhase) {
        rejectMsg =
          "You must complete your own phase before playing elsewhere.";
        return io.to(playerId).emit("proctorMessage", rejectMsg);
      } else if (!targetCompletedPhase) {
        rejectMsg =
          "You can't do that because they haven't completed their phase yet.";
        return io.to(playerId).emit("proctorMessage", rejectMsg);
      }
    }

    const phaseItem = targetPlayer.phases[0][data.phaseIndex];

    // ensure phase item actually exists
    if (!phaseItem) {
      return io
        .to(playerId)
        .emit("proctorMessage", "That phase item doesn't exist.");
    }

    // if player is completing phase for first time, ensure they are playing enough cards.
    if (!playerCompletedPhase && phaseItem.size > data.cards.length) {
      return io.to(playerId).emit("proctorMessage", "Too few cards.");
    }

    const playedKeys = data.cards.map((card) => card.key);

    // remove the cards from hand in order of playedKeys
    // this avoids people spoofing the values of cards in data.cards while keeping keys as ones they have.
    const playedCards = removeCardsFromHand(playedKeys, playerUp.hand);

    // might matter which end the cards go on; this function checks that
    addCardsToPhaseItem(playedCards, phaseItem);

    // ensure pattern matches.
    if (phaseItem.pattern === "set" && !isCardSet(phaseItem.cards)) {
      return io
        .to(playerId)
        .emit(
          "proctorMessage",
          "That is not a set. Cards of the same number make a set."
        );
    } else if (phaseItem.pattern === "run" && !isCardRun(phaseItem.cards)) {
      return io
        .to(playerId)
        .emit(
          "proctorMessage",
          "That is not a run. A sequence of cards with no repeats make a run."
        );
    } else if (
      phaseItem.pattern === "color" &&
      !allSameColor(phaseItem.cards)
    ) {
      return io
        .to(playerId)
        .emit("proctorMessage", "All cards must be of same color.");
    }

    // at this point, it's valid, so we can save everything in the database and broadcast results.

    room.played = true;
    // if the phase is now a completed phase, set the flag on user object
    if (phaseIsComplete(targetPlayer.phases[0])) {
      targetPlayer.completedPhase = true;
    }

    // ANNOYING MONGOOSE THING WITH NESTED PROPERTIES:
    // https://stackoverflow.com/questions/24054552/mongoose-not-saving-nested-object
    // it won't diff nested objects, so you have to tell it if you modified a nested.
    targetPlayer.markModified("phases");

    await playerUp.save();
    await targetPlayer.save();
    await room.save();

    // broadcast results.
    sendGameState(room, io);
    sendPlayersOwnData(room, io);
    sendPublicPlayerData(room, io);

    // Did the player Go Out (no more cards) ? If so, end the current round.
    if (playerUp.hand.length === 0) {
      endCurrentRound(room, io);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { rotatePlayerUp, drawCard, discard, playCards, advanceRound };
