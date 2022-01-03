const fs = require("fs").promises;

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

module.exports = { shuffle, writeToJSON };
