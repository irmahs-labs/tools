import { w } from "../words";
import type { Words } from "../words";

/** SRD 5.2.1, "Playing the Game" and "Character Creation": the six abilities, the skills, languages and alignments. */

export const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"] as const;

export type Ability = (typeof ABILITIES)[number];

export const ABILITY_NAMES: Record<Ability, Words> = {
  cha: w("Charisma", "Charisme"),
  con: w("Constitution", "Constitution"),
  dex: w("Dexterity", "Dextérité"),
  int: w("Intelligence", "Intelligence"),
  str: w("Strength", "Force"),
  wis: w("Wisdom", "Sagesse"),
};

/** The three letters on a sheet. */
export const ABILITY_SHORT: Record<Ability, Words> = {
  cha: w("CHA", "CHA"),
  con: w("CON", "CON"),
  dex: w("DEX", "DEX"),
  int: w("INT", "INT"),
  str: w("STR", "FOR"),
  wis: w("WIS", "SAG"),
};

export const SKILLS = [
  "acrobatics",
  "animal-handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight-of-hand",
  "stealth",
  "survival",
] as const;

export type Skill = (typeof SKILLS)[number];

export const SKILL_INFO: Record<Skill, { ability: Ability; name: Words }> = {
  acrobatics: { ability: "dex", name: w("Acrobatics", "Acrobaties") },
  "animal-handling": { ability: "wis", name: w("Animal Handling", "Dressage") },
  arcana: { ability: "int", name: w("Arcana", "Arcanes") },
  athletics: { ability: "str", name: w("Athletics", "Athlétisme") },
  deception: { ability: "cha", name: w("Deception", "Tromperie") },
  history: { ability: "int", name: w("History", "Histoire") },
  insight: { ability: "wis", name: w("Insight", "Intuition") },
  intimidation: { ability: "cha", name: w("Intimidation", "Intimidation") },
  investigation: {
    ability: "int",
    name: w("Investigation", "Investigation"),
  },
  medicine: { ability: "wis", name: w("Medicine", "Médecine") },
  nature: { ability: "int", name: w("Nature", "Nature") },
  perception: { ability: "wis", name: w("Perception", "Perception") },
  performance: { ability: "cha", name: w("Performance", "Représentation") },
  persuasion: { ability: "cha", name: w("Persuasion", "Persuasion") },
  religion: { ability: "int", name: w("Religion", "Religion") },
  "sleight-of-hand": {
    ability: "dex",
    name: w("Sleight of Hand", "Escamotage"),
  },
  stealth: { ability: "dex", name: w("Stealth", "Discrétion") },
  survival: { ability: "wis", name: w("Survival", "Survie") },
};

/** The Standard Array: six scores to assign. */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

/** The Ability Score Point Costs table: 27 points, every score 8 to 15. */
export const POINT_COSTS: ReadonlyMap<number, number> = new Map([
  [8, 0],
  [9, 1],
  [10, 2],
  [11, 3],
  [12, 4],
  [13, 5],
  [14, 7],
  [15, 9],
]);

export const POINTS = 27;

/** No background increase can raise a score above this. */
export const SCORE_CAP = 20;

/** Every level 1 character's Proficiency Bonus. */
export const PROFICIENCY_BONUS = 2;

/** The Standard Languages: every character knows Common and two more of these. */
/** Every language a character can know, in any pack. */
export const ALL_LANGUAGES = [
  "abyssal",
  "celestial",
  "common",
  "common-sign",
  "deep-speech",
  "draconic",
  "dwarvish",
  "elvish",
  "giant",
  "gnomish",
  "goblin",
  "halfling",
  "infernal",
  "orc",
  "primordial",
  "sylvan",
  "undercommon",
] as const;

export type Language = (typeof ALL_LANGUAGES)[number];

/** The SRD 5.2.1's Standard Languages, the ones a character picks from. */
export const LANGUAGES: readonly Language[] = [
  "common",
  "common-sign",
  "draconic",
  "dwarvish",
  "elvish",
  "giant",
  "gnomish",
  "goblin",
  "halfling",
  "orc",
];

export const LANGUAGE_NAMES: Record<
  Language | "thieves-cant" | "druidic",
  Words
> = {
  abyssal: w("Abyssal", "Abyssal"),
  celestial: w("Celestial", "Céleste"),
  common: w("Common", "Commun"),
  "common-sign": w("Common Sign Language", "Langue multiverselle des signes"),
  "deep-speech": w("Deep Speech", "Profond"),
  draconic: w("Draconic", "Draconique"),
  druidic: w("Druidic", "Druidique"),
  dwarvish: w("Dwarvish", "Nain"),
  elvish: w("Elvish", "Elfique"),
  giant: w("Giant", "Gigant"),
  gnomish: w("Gnomish", "Gnome"),
  goblin: w("Goblin", "Gobelin"),
  halfling: w("Halfling", "Halfelin"),
  infernal: w("Infernal", "Infernal"),
  orc: w("Orc", "Orc"),
  primordial: w("Primordial", "Primordial"),
  sylvan: w("Sylvan", "Sylvestre"),
  "thieves-cant": w("Thieves’ Cant", "Argot des voleurs"),
  undercommon: w("Undercommon", "Commun des profondeurs"),
};

/** How many Standard Languages a character picks besides Common. */
export const EXTRA_LANGUAGES = 2;

export const ALIGNMENTS = [
  "lg",
  "ng",
  "cg",
  "ln",
  "n",
  "cn",
  "le",
  "ne",
  "ce",
] as const;

export type Alignment = (typeof ALIGNMENTS)[number];

export const ALIGNMENT_NAMES: Record<Alignment, Words> = {
  ce: w("Chaotic Evil", "Chaotique Mauvais"),
  cg: w("Chaotic Good", "Chaotique Bon"),
  cn: w("Chaotic Neutral", "Chaotique Neutre"),
  le: w("Lawful Evil", "Loyal Mauvais"),
  lg: w("Lawful Good", "Loyal Bon"),
  ln: w("Lawful Neutral", "Loyal Neutre"),
  n: w("Neutral", "Neutre"),
  ne: w("Neutral Evil", "Neutre Mauvais"),
  ng: w("Neutral Good", "Neutre Bon"),
};

/** An ability modifier, from the Ability Scores and Modifiers table. */
export const modifier = (score: number): number => Math.floor((score - 10) / 2);
