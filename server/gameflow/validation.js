// play cards validations:

const db = require("../database");

/**
 *
 * @param {Array} cards
 */
function isCardSet(cards) {
  if (cards.length === 0) {
    return false;
  }

  return cards.every((card) => card.value === cards[0].value);
}

/**
 *
 * @param {Array} cards
 */
function isCardRun(cards) {
  //todo: with wilds, this gets trickier.
  // will need to have client keep better track of the order of cards (right now it's just order of selection);
  // it matters what position they played the wild (really just if it's on either end, but still);

  if (cards.length === 0) {
    return false;
  }

  // sort the hand and see if each is 1 greater than the previous.
  cards.sort((a, b) => a.value - b.value);

  for (let i = 0; i < cards.length - 1; i++) {
    if (cards[i + 1].value !== cards[i].value + 1) {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {Array} cards
 */
function allSameColor(cards) {
  if (cards.length === 0) {
    return false;
  }

  return cards.every((card) => card.color === cards[0].color);
}

async function handHasAllCards(hand, cards) {
  // collect keys of all cards in hand
  const handKeys = {};
  hand.forEach((card) => (handKeys[card.key] = "unused"));

  // check each potential card against the hand keys
  // returns false if any card is used twice or a key is used that isn't in hand
  for (let i = 0; i < cards.length; i++) {
    if (handKeys[cards[i].key] === "unused") {
      handKeys[cards[i].key] = "used";
    } else {
      return false;
    }
  }

  return true;
}

// (simple but need this to be very modular)
// async function playerCompletedPhase(socketId) {
//   const playerPhaseData = await db.getProperty(`users.${socketId}.phase`);

//   if (!playerPhaseData) {
//     console.log("socketid:", socketId);
//     throw new Error("player phase data is not defined, somehow.");
//     return false;
//   }

//   return playerPhaseData.every(
//     (phaseItem) => phaseItem.cards.length >= phaseItem.size
//   );
// }

/**
 *
 * @param {Array} phase - phase data of a Player
 * @returns true if each item in phase has cards matching or greater than its required size
 */
function phaseIsComplete(phase) {
  return phase.every((phaseItem) => phaseItem.cards.length >= phaseItem.size);
}

module.exports = {
  isCardRun,
  isCardSet,
  allSameColor,
  // playerCompletedPhase,
  phaseIsComplete,
  handHasAllCards,
};
