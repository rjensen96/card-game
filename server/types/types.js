const { phases } = require("./phases");

class Player {
  // I should probably make a generic 'game' prop, and then attach some game instance to that.
  //   game: CardGame;
  /**
   *
   * @param {String} socketId - socket id generated by socket.io
   * @param {String} roomName - name of room player is in
   */
  constructor(socketId, roomName) {
    this.gamename = "";
    this.socketId = socketId;
    this.completedPhase = false;
    this.room = roomName;
    this.hand = [];
    this.points = 0;
    this.phaseNumber = 1;
    this.phase = phases[this.phaseNumber];
  }
}

class GameRoom {
  roomName;
  users = [];
  skipped = [];
  drawPile = [];
  discardPile = [];
  drew = false;
  played = false;
  discarded = false;
  roundIsOver = false;

  constructor(roomName) {
    this.roomName = roomName;
    this.generateDeck();
    this.shuffle(this.drawPile);
  }

  generateDeck() {
    for (let round = 0; round < 2; round++) {
      for (let color = 1; color < 5; color++) {
        for (let value = 1; value < 12; value++) {
          const card = {
            value,
            text: value.toFixed(0),
            color,
            key: color + "-" + value + "-" + round,
          };
          this.drawPile.push(card);
        }
      }
    }
  }

  shuffle(cards) {
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
}

module.exports = { Player, GameRoom };
