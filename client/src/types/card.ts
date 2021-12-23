// I will probably expand this later to hold all kinds of stuff, like cards in hand and phase.
export interface Card {
  value: number;
  text: string;
  color: number;
  key: string;
}

export function getEmptyCardArray(): Card[] {
  const cards: Card[] = [];
  return cards;
}
