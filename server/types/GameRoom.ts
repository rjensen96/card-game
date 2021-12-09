// import { Player } from "./Player";
// import { Card } from "./types";

// interface Card {
//   value: number;
//   text: String;
//   color: number; // 1 = blue, 2 = red, 3 = green, 4 = yellow... or something.
// }

class GameRoom {
  roomName: String;
  // players: Player[] = [];
  // skipped: Player[] = [];
  // playerUp: Player;
  players: String[] = [];
  skipped: String[] = [];
  playerUp: String;
  // drawPile: Card[] = [];
  // discardPile: Card[] = [];

  constructor(roomName: String) {
    this.roomName = roomName;
    this.playerUp = this.players[0];
    this.generateDeck();
    // this.shuffle(this.drawPile);
  }

  generateDeck(): void {
    for (let color = 1; color < 5; color++) {
      for (let value = 0; value < 12; value++) {
        // const card: Card = {
        // value,
        // text: value.toFixed(0),
        // color,
        // };
        // this.drawPile.push(card);
      }
    }
  }

  shuffle(cards: Card[]): void {
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

  // // NOTE : before going nuts with below, just wait because this might not work well with the db.
  // /**
  //  * Checks if a player exists in this game room.
  //  * @param player - player to search for
  //  * @returns true if player in room, false otherwise
  //  */
  // contains(player: Player) {
  //   return this.players.includes(player);
  // }

  // /**
  //  *
  //  * @param player - player to add
  //  * @returns
  //  */
  // addPlayer(player: Player): boolean {
  //   if (!this.players.includes(player)) {
  //     this.players.push(player);
  //     return true;
  //   }
  //   return false;
  // }

  // /**
  //  * Removes a player from the game room.
  //  * @param player - player to remove
  //  * @returns true if players list modified in this method
  //  */
  // removePlayer(player: Player): boolean {
  //   const initLen = this.players.length;
  //   this.players = this.players.filter((pl) => pl != player);
  //   return this.players.length != initLen;
  // }
}

// module.exports = { GameRoom };
