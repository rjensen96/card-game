class Player {
  // I should probably make a generic 'game' prop, and then attach some game instance to that.
  //   game: CardGame;
  constructor(username, socketId) {
    this.username = username;
    this.socketId = socketId;
    this.hand = [];
    this.points = 0;
    this.phase = 1;
    // this.game = new CardGame();
  }
}

class GameRoom {
  roomName;
  players = [];
  skipped = [];
  playerUp;
  drawPile = [];
  discardPile = [];

  constructor(roomName) {
    this.roomName = roomName;
    this.playerUp = this.players[0];
    this.generateDeck();
    this.shuffle(this.drawPile);
  }

  generateDeck() {
    for (let color = 1; color < 5; color++) {
      for (let value = 0; value < 12; value++) {
        const card = {
          value,
          text: value.toFixed(0),
          color,
        };
        this.drawPile.push(card);
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
