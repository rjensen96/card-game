export interface Card {
  value: number;
  text: String;
  color: number; // 1 = blue, 2 = red, 3 = green, 4 = yellow... or something.
}

// mockup of how a Game prop could work:
// interface CardGame {
//   cards: Card[];
// }

// interface PhaseGame extends CardGame {
//   phase: number;
// }
