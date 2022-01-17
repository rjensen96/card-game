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
 */
function addCardsToPhaseItem(cards, phaseItem) {
  function getRunEndValues() {
    let maxVal = 0;
    let minVal = 0;
    let idx = 0;

    // move index to first non-wild card
    while (phaseItem.cards[idx].key.includes("W")) {
      idx++;
    }

    // calculate imputed min and max values
    minVal = phaseItem.cards[idx].value - idx;
    maxVal = minVal + phaseItem.cards.length - 1;
    return { maxVal, minVal };
  }

  if (phaseItem.pattern === "run" && phaseItem.cards.length > 0) {
    // try to determine which end the cards should go on.
    let { maxVal, minVal } = getRunEndValues();

    // suppose this:
    // phaseItem.cards => 3, 4, 5, 6
    // cards => 2, 1, 7

    // that is a legal move, so it should be accommodated.

    // todo: in client, we should actually have two buttons on the TableSets.
    // a button on the right and left of the set
    // if they could just tell us where they wanted to play the cards, that would make this a lot easier!

    while (cards.length) {
      const initialLength = cards.length;
      for (let i = 0; i < cards.length; i++) {
        const isWild = cards[i].key.includes("W");

        // forbid a wild to take minVal below 1
        if (isWild && minVal === 1) {
          phaseItem.cards.push(...cards.splice(i, 1));
        } else if (cards[i].value === maxVal + 1) {
          phaseItem.cards.push(...cards.splice(i, 1));
          maxVal++;
        } else if (cards[i].value === minVal - 1) {
          phaseItem.cards.unshift(...cards.splice(i, 1));
          minVal--;
        }
      }
      if (cards.length === initialLength) {
        // means our fancy logic did nothing, so just cram everything on the end and let validation handle it.
        phaseItem.cards.push(...cards);
        cards = []; // will cause loop to end.
      }
    }
  } else {
    phaseItem.cards.push(...cards);
  }
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
