import _ from "lodash";
const phases = [
  [
    { pattern: "set", size: 3, cards: [] },
    { pattern: "set", size: 3, cards: [] },
  ],
  [
    { pattern: "set", size: 3, cards: [] },
    { pattern: "run", size: 4, cards: [] },
  ],
  [
    { pattern: "set", size: 4, cards: [] },
    { pattern: "run", size: 4, cards: [] },
  ],
  [{ pattern: "run", size: 7, cards: [] }],
  [{ pattern: "run", size: 8, cards: [] }],
  [{ pattern: "run", size: 9, cards: [] }],
  [
    { pattern: "set", size: 4, cards: [] },
    { pattern: "set", size: 4, cards: [] },
  ],
  [{ pattern: "color", size: 7, cards: [] }],
  [
    { pattern: "set", size: 5, cards: [] },
    { pattern: "set", size: 2, cards: [] },
  ],
  [
    { pattern: "set", size: 5, cards: [] },
    { pattern: "set", size: 3, cards: [] },
  ],
];

const rjSpecial = [
  [
    { pattern: "color", size: 4, cards: [] },
    { pattern: "run", size: 3, cards: [] },
  ],
  [{ pattern: "run", size: 6, cards: [] }],
  [
    { pattern: "color", size: 4, cards: [] },
    { pattern: "color", size: 4, cards: [] },
  ],
  [{ pattern: "set", size: 5, cards: [] }],
];

export function getDefaultPhases() {
  return _.cloneDeep(phases);
}

export function getRJSpecialPhases() {
  return _.cloneDeep(rjSpecial);
}
