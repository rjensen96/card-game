// note - this should actually come from the server. That way, we could do a config on this and stuff.
// also, the server HAS to have this so that it can validate moves.

export const phases = {
  "1": [
    { pattern: "set", size: 3 },
    { pattern: "set", size: 3 },
  ],
  "2": [
    { pattern: "set", size: 3 },
    { pattern: "run", size: 4 },
  ],
  "3": [
    { pattern: "set", size: 4 },
    { pattern: "run", size: 4 },
  ],
  "4": [{ pattern: "run", size: 7 }],
  "5": [{ pattern: "run", size: 8 }],
  "6": [{ pattern: "run", size: 9 }],
  "7": [
    { pattern: "set", size: 4 },
    { pattern: "set", size: 4 },
  ],
  "8": [{ pattern: "color", size: 7 }],
  "9": [
    { pattern: "set", size: 5 },
    { pattern: "set", size: 2 },
  ],
  "10": [
    { pattern: "set", size: 5 },
    { pattern: "set", size: 3 },
  ],
};
