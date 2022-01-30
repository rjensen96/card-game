import _ from "lodash";
import { getEmptyCardArray } from "./card";
const phases = [
  [
    { pattern: "set", size: 3, cards: getEmptyCardArray() },
    { pattern: "set", size: 3, cards: getEmptyCardArray() },
  ],
  [
    { pattern: "set", size: 3, cards: getEmptyCardArray() },
    { pattern: "run", size: 4, cards: getEmptyCardArray() },
  ],
  [
    { pattern: "set", size: 4, cards: getEmptyCardArray() },
    { pattern: "run", size: 4, cards: getEmptyCardArray() },
  ],
  [{ pattern: "run", size: 7, cards: getEmptyCardArray() }],
  [{ pattern: "run", size: 8, cards: getEmptyCardArray() }],
  [{ pattern: "run", size: 9, cards: getEmptyCardArray() }],
  [
    { pattern: "set", size: 4, cards: getEmptyCardArray() },
    { pattern: "set", size: 4, cards: getEmptyCardArray() },
  ],
  [{ pattern: "color", size: 7, cards: getEmptyCardArray() }],
  [
    { pattern: "set", size: 5, cards: getEmptyCardArray() },
    { pattern: "set", size: 2, cards: getEmptyCardArray() },
  ],
  [
    { pattern: "set", size: 5, cards: getEmptyCardArray() },
    { pattern: "set", size: 3, cards: getEmptyCardArray() },
  ],
];

const rjSpecial = [
  [
    { pattern: "color", size: 5, cards: [] },
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
