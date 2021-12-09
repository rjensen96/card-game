"use strict";
// import { Player } from "./Player";
// import { Card } from "./types";
// interface Card {
//   value: number;
//   text: String;
//   color: number; // 1 = blue, 2 = red, 3 = green, 4 = yellow... or something.
// }
class GameRoom {
    // drawPile: Card[] = [];
    // discardPile: Card[] = [];
    constructor(roomName) {
        // players: Player[] = [];
        // skipped: Player[] = [];
        // playerUp: Player;
        this.players = [];
        this.skipped = [];
        this.roomName = roomName;
        this.playerUp = this.players[0];
        this.generateDeck();
        // this.shuffle(this.drawPile);
    }
    generateDeck() {
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
// module.exports = { GameRoom };
