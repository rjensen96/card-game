// I will probably expand this later to hold all kinds of stuff, like cards in hand and phase.
export interface Player {
  gamename: string;
  points: number;
  phaseNumber: number;
  phase: any;
  key: number;
}

export function getEmptyPlayerArray(): Player[] {
  const players: Player[] = [];
  return players;
}
