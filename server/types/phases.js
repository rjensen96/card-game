const phases = {
  1: [
    { pattern: "set", size: 3, cards: [] },
    { pattern: "set", size: 3, cards: [] },
  ],
  2: [
    { pattern: "set", size: 3, cards: [] },
    { pattern: "run", size: 4, cards: [] },
  ],
  3: [
    { pattern: "set", size: 4, cards: [] },
    { pattern: "run", size: 4, cards: [] },
  ],
  4: [{ pattern: "run", size: 7, cards: [] }],
  5: [{ pattern: "run", size: 8, cards: [] }],
  6: [{ pattern: "run", size: 9, cards: [] }],
  7: [
    { pattern: "set", size: 4, cards: [] },
    { pattern: "set", size: 4, cards: [] },
  ],
  8: [{ pattern: "color", size: 7, cards: [] }],
  9: [
    { pattern: "set", size: 5, cards: [] },
    { pattern: "set", size: 2, cards: [] },
  ],
  10: [
    { pattern: "set", size: 5, cards: [] },
    { pattern: "set", size: 3, cards: [] },
  ],
};

module.exports = { phases };
