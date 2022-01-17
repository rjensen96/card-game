const fs = require("fs").promises;
const _ = require("lodash");

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

/**
 * This function is junky because nodemon restarts anytime anything changes, so if you use this, make sure to nodemon ignore.
 * @param {*} filename
 * @param {*} data
 */
async function writeToJSON(filename, data) {
  await fs.writeFile(filename, JSON.stringify(data));
}

/**
 * Returns array of removed cards; mutates hand.
 * @param {*} cardKeys
 * @param {*} hand
 */
function removeCardsFromHand(cardKeys, hand) {
  const removedCards = [];

  cardKeys.forEach((removeKey) => {
    const idx = _.findIndex(hand, (card) => card.key === removeKey);
    if (idx >= 0) {
      removedCards.push(...hand.splice(idx, 1));
    }
  });

  return removedCards;
}

/**
 * Adds provided cards to the given phaseItem, mutates phaseItem. If the phase item already has cards (and is a run), adds cards to front or back of phaseItem depending on which end they might fit on. DOES NOT VALIDATE THE PHASE ITEM.
 * @param {*} cards
 * @param {*} phaseItem
 * @param {string} targetSideToPlay - 'right', 'left', or null. Which side of the hand player wants to stick cards
 */
function addCardsToPhaseItem(cards, phaseItem, targetSideToPlay) {
  if (targetSideToPlay === "left") {
    phaseItem.cards.unshift(...cards);
  } else {
    // this covers right and null.
    // null only happens if the phase item has no cards, which means push is fine.
    phaseItem.cards.push(...cards);
  }

  return;
}

/**
 * This function is here because we use playerId and socketId both.
 * playerId stays same throughout game, but socketId could change.
 * @param {*} socketId
 * @param {*} roomId
 */
function ensureSocketJoinedRoom(socket, roomId) {
  socket.join(roomId);
}

module.exports = {
  shuffle,
  writeToJSON,
  removeCardsFromHand,
  addCardsToPhaseItem,
  ensureSocketJoinedRoom,
};
