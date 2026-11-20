import type { Character } from "./character";
import { BASE_SCORES } from "./character";
import { contentOf } from "./packs";
import { ABILITIES, STANDARD_ARRAY } from "./srd/core";
import type { Ability } from "./srd/core";

/**
 * Changes that reach past the one choice: picking another class clears the
 * choices only that class offered, so the character never keeps a Rogue's
 * Expertise as a Wizard. Each returns a new character.
 */

const blankFeat = () => ({
  initiate: { ability: null, cantrips: [], list: null, spell: null },
  skilled: [],
});

/** The Standard Array where the rules suggest it for the class, or a sound one without. */
const suggestedArray = (
  c: Character,
  classId: string | null
): Record<Ability, number> => ({
  ...(contentOf(c.packs).classes.find((info) => info.id === classId)
    ?.suggested ?? { cha: 8, con: 13, dex: 14, int: 10, str: 15, wis: 12 }),
});

export const setClass = (c: Character, classId: string): Character =>
  c.classId === classId
    ? c
    : {
        ...c,
        cantrips: [],
        classId,
        classPackage: 0,
        classSkills: [],
        classTools: [],
        expertise: [],
        fightingStyle: null,
        invocation: null,
        languages: c.languages.slice(0, 2),
        order: null,
        prepared: [],
        // The suggested Standard Array follows the class, until scores are touched
        scores:
          c.scores.method === "array"
            ? { ...c.scores, base: suggestedArray(c, classId) }
            : c.scores,
        spells: [],
        subclass: null,
        weaponMasteries: [],
      };

export const setBackground = (c: Character, backgroundId: string): Character =>
  c.backgroundId === backgroundId
    ? c
    : {
        ...c,
        backgroundId,
        backgroundTool: null,
        boost: { mode: c.boost.mode, plus1: null, plus2: null },
        feats: { ...c.feats, background: blankFeat() },
      };

export const setSpecies = (c: Character, speciesId: string): Character =>
  c.speciesId === speciesId
    ? c
    : {
        ...c,
        castingAbility: null,
        feats: { ...c.feats, species: blankFeat() },
        size: null,
        speciesBoosts: [],
        speciesCantrip: null,
        speciesFeat: null,
        speciesId,
        speciesSkills: [],
        speciesTool: null,
        variant: null,
      };

/** Switches how the scores are made, starting each method from its own blank. */
export const setScoreMethod = (
  c: Character,
  method: Character["scores"]["method"]
): Character => {
  if (c.scores.method === method) {
    return c;
  }

  let base: Record<Ability, number> = { ...BASE_SCORES };

  if (method === "array") {
    base = suggestedArray(c, c.classId);
  }

  if (method === "roll") {
    base = { cha: 10, con: 10, dex: 10, int: 10, str: 10, wis: 10 };
  }

  return { ...c, scores: { base, method } };
};

/**
 * Gives an ability one of the Standard Array's scores: the ability that held
 * it takes this one's old score, so the six stay one of each.
 */
export const assignArrayScore = (
  c: Character,
  ability: Ability,
  score: number
): Character => {
  const base = { ...c.scores.base };

  const holder = ABILITIES.find(
    (other) => other !== ability && base[other] === score
  );

  if (holder) {
    base[holder] = base[ability];
  }

  base[ability] = score;

  return { ...c, scores: { ...c.scores, base } };
};

/** Adds an item to a list, or takes it off; never past `max` items. */
export const toggleIn = <T>(list: readonly T[], item: T, max: number): T[] => {
  if (list.includes(item)) {
    return list.filter((entry) => entry !== item);
  }

  return list.length >= max ? [...list] : [...list, item];
};

export const ARRAY_VALUES = STANDARD_ARRAY;
