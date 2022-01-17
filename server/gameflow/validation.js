function roomHasGamename(room, gamename) {
  for (let i = 0; i < room.players.length; i++) {
    const pl = room.players[i];
    if (pl.gamename.toLowerCase() === gamename.toLowerCase()) {
      return true;
    }
  }
  return false;
}

/**
 *
 * @param {Array} cards
 */
function isCardSet(cards) {
  if (cards.length === 0) {
    return false;
  }

  const nonWilds = cards.filter((card) => !card.key.includes("W"));

  if (!nonWilds.length) {
    return false; // can't play just wilds.
  }

  const baseValue = nonWilds[0].value;

  return cards.every(
    (card) => card.value === baseValue || card.key.includes("W")
  );
}

/**
 *
 * @param {Array} cards
 */
function isCardRun(cards) {
  if (cards.length === 0) {
    return false;
  }

  // ensure that it's not just a bunch of wilds.
  const nonWilds = cards.filter((card) => !card.key.includes("W"));
  if (!nonWilds.length) {
    return false;
  }

  // first card could be a wild, so required value is the first numeric card minus how many wilds at the beginning.
  let x = 0;
  while (cards[x].key.includes("W")) {
    x++;
  }

  let requiredValue = cards[x].value - x + 1;

  // wilds cannot take a run below 1.
  if (requiredValue < 1) {
    return false;
  }

  for (let i = 0; i < cards.length - 1; i++) {
    const currentValue = cards[i + 1].value;
    const isWild = cards[i + 1].key.includes("W");
    if (currentValue !== requiredValue && !isWild) {
      return false;
    }
    requiredValue++;
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

  const nonWilds = cards.filter((card) => !card.key.includes("W"));

  if (!nonWilds.length) {
    return false; // can't play just wilds, that's nuts.
  }

  const baseColor = nonWilds[0].color;

  return cards.every(
    (card) => card.color === baseColor || card.key.includes("W")
  );
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

/**
 *
 * @param {Array} phase - phase data of a Player
 * @returns true if each item in phase has cards matching or greater than its required size
 */
function phaseIsComplete(phase) {
  return phase.every((phaseItem) => phaseItem.cards.length >= phaseItem.size);
}

module.exports = {
  roomHasGamename,
  isCardRun,
  isCardSet,
  allSameColor,
  phaseIsComplete,
  handHasAllCards,
};
