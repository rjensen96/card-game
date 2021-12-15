// I will probably expand this later to hold all kinds of stuff, like cards in hand and phase.
export interface Player {
  gamename: string;
  hand: string[];
  points: number;
  phase: number;
  key: number;
}

export function getEmptyPlayerArray(): Player[] {
  const players: Player[] = [];
  return players;
}
