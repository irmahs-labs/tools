import * as z from "zod/mini";

import { CLASS_IDS } from "./srd/classes";
import { ABILITIES, ALIGNMENTS, LANGUAGES, SKILLS } from "./srd/core";
import type { Ability } from "./srd/core";
import { INITIATE_LISTS, ORIGIN_FEATS } from "./srd/origins";

/**
 * A level 1 character as the maker keeps it: every choice the player made,
 * nothing worked out. What the sheet shows (modifiers, Armor Class, Hit
 * Points, attacks) is worked out from it in rules.ts. Kept in the browser
 * only (storage.ts), read through this schema so an old or damaged save
 * loses only what no longer makes sense.
 */

const ability = z.enum(ABILITIES);
const skill = z.enum(SKILLS);

const scores = z.object({
  cha: z.int(),
  con: z.int(),
  dex: z.int(),
  int: z.int(),
  str: z.int(),
  wis: z.int(),
});

/** Magic Initiate's picks: its list, its ability, two cantrips and a level 1 spell. */
const initiate = z.object({
  ability: z.nullable(ability),
  cantrips: z.array(z.string()),
  list: z.nullable(z.enum(INITIATE_LISTS)),
  spell: z.nullable(z.string()),
});

export type InitiateChoice = z.infer<typeof initiate>;

/** An Origin feat's own picks: Magic Initiate's spells, or Skilled's three proficiencies. */
const featPicks = z.object({
  initiate,
  /** Skill or tool ids. */
  skilled: z.array(z.string()),
});

export type FeatPicks = z.infer<typeof featPicks>;

/** The longest a name and the notes may be, as the inputs allow. */
export const MAX_NAME = 60;

export const MAX_NOTES = 2000;

export const characterSchema = z.object({
  alignment: z.nullable(z.enum(ALIGNMENTS)),
  /** Which of the background's three abilities gets +2 and +1, or all +1. */
  boost: z.object({
    mode: z.enum(["2-1", "1-1-1"]),
    plus1: z.nullable(ability),
    plus2: z.nullable(ability),
  }),
  backgroundId: z.nullable(z.enum(["acolyte", "criminal", "sage", "soldier"])),
  /** The background's starting equipment: its package, or 50 GP. */
  backgroundPackage: z.enum(["a", "gold"]),
  /** The Soldier's Gaming Set. */
  backgroundTool: z.nullable(z.string()),
  /** The spellcasting ability for an Elf's, Gnome's or Tiefling's spells. */
  castingAbility: z.nullable(ability),
  cantrips: z.array(z.string()),
  classId: z.nullable(z.enum(CLASS_IDS)),
  /** Which starting equipment package of the class: 0 is A, the last is gold only. */
  classPackage: z.int(),
  classSkills: z.array(skill),
  /** The class's tool picks: Bard's instruments, the Monk's tool. */
  classTools: z.array(z.string()),
  createdAt: z.string(),
  expertise: z.array(skill),
  /** The background's feat's picks, and the Human's Versatile feat's. */
  feats: z.object({ background: featPicks, human: featPicks }),
  fightingStyle: z.nullable(z.string()),
  /** The Human's Versatile Origin feat. */
  humanFeat: z.nullable(z.enum(ORIGIN_FEATS)),
  /** The Human's Skillful skill. */
  humanSkill: z.nullable(skill),
  id: z.string(),
  invocation: z.nullable(z.string()),
  /** The Elf's Keen Senses skill. */
  keenSense: z.nullable(skill),
  languages: z.array(z.enum(LANGUAGES)),
  name: z.string().check(z.maxLength(MAX_NAME)),
  notes: z.string().check(z.maxLength(MAX_NOTES)),
  /** Cleric's Divine Order or Druid's Primal Order. */
  order: z.nullable(z.string()),
  /** The scores before the background's increases. */
  scores: z.object({
    base: scores,
    method: z.enum(["array", "points", "roll"]),
  }),
  size: z.nullable(z.enum(["medium", "small"])),
  speciesId: z.nullable(
    z.enum([
      "dragonborn",
      "dwarf",
      "elf",
      "gnome",
      "goliath",
      "halfling",
      "human",
      "orc",
      "tiefling",
    ])
  ),
  /** The level 1 spells prepared, or for a Wizard, in the spellbook. */
  spells: z.array(z.string()),
  /** The Wizard's prepared spells, from the spellbook. */
  prepared: z.array(z.string()),
  updatedAt: z.string(),
  /** A Dragonborn's ancestor, an Elf's or Gnome's lineage, a Goliath's ancestry, a Tiefling's legacy. */
  variant: z.nullable(z.string()),
  weaponMasteries: z.array(z.string()),
});

export type Character = z.infer<typeof characterSchema>;

const blankInitiate = (): InitiateChoice => ({
  ability: null,
  cantrips: [],
  list: null,
  spell: null,
});

const blankFeat = (): FeatPicks => ({ initiate: blankInitiate(), skilled: [] });

/** Every score at 8, where point buy starts. */
export const BASE_SCORES: Record<Ability, number> = {
  cha: 8,
  con: 8,
  dex: 8,
  int: 8,
  str: 8,
  wis: 8,
};

/** A new character with nothing chosen yet; `id` and `now` for tests. */
export const newCharacter = (
  id: string = crypto.randomUUID(),
  now: Date = new Date()
): Character => ({
  alignment: null,
  backgroundId: null,
  backgroundPackage: "a",
  backgroundTool: null,
  boost: { mode: "2-1", plus1: null, plus2: null },
  cantrips: [],
  castingAbility: null,
  classId: null,
  classPackage: 0,
  classSkills: [],
  classTools: [],
  createdAt: now.toISOString(),
  expertise: [],
  feats: { background: blankFeat(), human: blankFeat() },
  fightingStyle: null,
  humanFeat: null,
  humanSkill: null,
  id,
  invocation: null,
  keenSense: null,
  languages: [],
  name: "",
  notes: "",
  order: null,
  prepared: [],
  scores: { base: { ...BASE_SCORES }, method: "points" },
  size: null,
  speciesId: null,
  spells: [],
  updatedAt: now.toISOString(),
  variant: null,
  weaponMasteries: [],
});
