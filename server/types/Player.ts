import { Card } from "./types";

export class Player {
  username: String;
  socketId: String;
  hand: Card[];
  points: number;
  phase: number; // this is phase-10 specific...
  // I should probably make a generic 'game' prop, and then attach some game instance to that.
  //   game: CardGame;

  constructor(username: String, socketId: String) {
    this.username = username;
    this.socketId = socketId;
    this.hand = [];
    this.points = 0;
    this.phase = 1;
    // this.game = new CardGame();
  }
}
