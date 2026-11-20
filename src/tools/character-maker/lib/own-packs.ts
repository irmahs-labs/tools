import { useSyncExternalStore } from "react";
import * as z from "zod/mini";

import type { Pack } from "./packs";
import { CLASS_IDS } from "./srd/classes";
import { ABILITIES, ALL_LANGUAGES, SKILLS } from "./srd/core";
import type { Ability } from "./srd/core";
import { INITIATE_LISTS, ORIGIN_FEATS } from "./srd/origins";
import type { Background, Species, Trait } from "./srd/origins";
import type { Spell } from "./srd/spells";
import type { Subclass } from "./srd/subclasses";
import type { Words } from "./words";

/**
 * A player's own pack: the species, backgrounds, spells and subclasses they
 * typed in, from a supplement they own or their own homebrew. Kept in this
 * browser's localStorage only, like the characters, and shared as a file.
 * What the forms save is the shape below; `toPack` turns it into a rule
 * pack the maker reads like the built-in ones.
 */
export const OWN_PACKS_KEY = "tools:character-maker:packs:v1";

/** The most packs of their own this browser keeps. */
export const MAX_OWN_PACKS = 10;

/** The most entries of one kind in a pack. */
export const MAX_ENTRIES = 60;

export const MAX_ENTRY_NAME = 60;

export const MAX_TEXT = 1000;

export const MAX_EQUIPMENT = 300;

const text = (max: number) => z.string().check(z.maxLength(max));

const name = z.string().check(z.minLength(1), z.maxLength(MAX_ENTRY_NAME));

const between = (min: number, max: number) =>
  z.int().check(z.minimum(min), z.maximum(max));

/** An entry's id inside its pack: a few random letters and digits. */
const localId = z.string().check(z.regex(/^[a-z0-9]{1,16}$/u));

const ability = z.enum(ABILITIES);
const skill = z.enum(SKILLS);
const classId = z.enum(CLASS_IDS);

const ownTrait = z.object({ name, text: text(MAX_TEXT) });

export type OwnTrait = z.infer<typeof ownTrait>;

const ownSpecies = z.object({
  /** +1 to this many abilities of the player's choice, as a Half-Elf's. */
  boostChoice: between(0, 3),
  /** Fixed increases (2014 rules): +2 Constitution is { con: 2 }. */
  boosts: z.object({
    cha: between(0, 2),
    con: between(0, 2),
    dex: between(0, 2),
    int: between(0, 2),
    str: between(0, 2),
    wis: between(0, 2),
  }),
  /** A cantrip it grants, by its full id, cast with an ability they pick. */
  cantrip: z.nullable(text(64)),
  darkvision: between(0, 300),
  extraLanguages: between(0, 3),
  hitPointsPerLevel: between(0, 2),
  id: localId,
  languages: z.array(z.enum(ALL_LANGUAGES)).check(z.maxLength(4)),
  name,
  size: z.enum(["medium", "small", "either"]),
  /** Skills of the player's choice, from any. */
  skillChoice: between(0, 4),
  skills: z.array(skill).check(z.maxLength(4)),
  speed: between(0, 120),
  traits: z.array(ownTrait).check(z.maxLength(12)),
});

export type OwnSpecies = z.infer<typeof ownSpecies>;

const ownBackground = z.object({
  /** The three abilities it raises (2024 rules), or none (2014 rules). */
  abilities: z.array(ability).check(z.maxLength(3)),
  equipment: text(MAX_EQUIPMENT),
  feat: z.nullable(z.enum(ORIGIN_FEATS)),
  /** Its feature, as the 2014 backgrounds have. */
  feature: z.nullable(ownTrait),
  gold: between(0, 1000),
  id: localId,
  initiateList: z.nullable(z.enum(INITIATE_LISTS)),
  languages: between(0, 3),
  name,
  skills: z.array(skill).check(z.maxLength(4)),
  /** A tool by id, or "gaming-set" to choose one. */
  tool: z.nullable(text(40)),
});

export type OwnBackground = z.infer<typeof ownBackground>;

const ownSpell = z.object({
  classes: z.array(classId).check(z.maxLength(CLASS_IDS.length)),
  id: localId,
  level: z.union([z.literal(0), z.literal(1)]),
  name,
  ritual: z.boolean(),
});

export type OwnSpell = z.infer<typeof ownSpell>;

const ownSubclass = z.object({
  classId,
  features: z.array(ownTrait).check(z.maxLength(12)),
  id: localId,
  name,
});

export type OwnSubclass = z.infer<typeof ownSubclass>;

const entries = <T extends z.core.SomeType>(entry: T) =>
  z.array(entry).check(z.maxLength(MAX_ENTRIES));

export const ownPackSchema = z.object({
  backgrounds: entries(ownBackground),
  id: z.string().check(z.regex(/^own-[a-z0-9]{8,32}$/u)),
  name,
  species: entries(ownSpecies),
  spells: entries(ownSpell),
  subclasses: entries(ownSubclass),
  updatedAt: z.string().check(z.maxLength(40)),
});

export type OwnPack = z.infer<typeof ownPackSchema>;

/** The kinds of entry a pack of one's own holds. */
export type OwnKind = "species" | "backgrounds" | "spells" | "subclasses";

export const OWN_KINDS: readonly OwnKind[] = [
  "species",
  "backgrounds",
  "spells",
  "subclasses",
];

/** A few random letters and digits, for a new pack or entry. */
export const randomId = (length = 8) =>
  crypto.randomUUID().replaceAll("-", "").slice(0, length);

export const newOwnPack = (packName: string, now = new Date()): OwnPack => ({
  backgrounds: [],
  id: `own-${randomId(12)}`,
  name: packName,
  species: [],
  spells: [],
  subclasses: [],
  updatedAt: now.toISOString(),
});

// ── Blank entries, for the forms ──

export const blankSpecies = (id = randomId()): OwnSpecies => ({
  boostChoice: 0,
  boosts: { cha: 0, con: 0, dex: 0, int: 0, str: 0, wis: 0 },
  cantrip: null,
  darkvision: 0,
  extraLanguages: 0,
  hitPointsPerLevel: 0,
  id,
  languages: [],
  name: "",
  size: "medium",
  skillChoice: 0,
  skills: [],
  speed: 30,
  traits: [],
});

export const blankBackground = (id = randomId()): OwnBackground => ({
  abilities: [],
  equipment: "",
  feat: null,
  feature: null,
  gold: 0,
  id,
  initiateList: null,
  languages: 0,
  name: "",
  skills: [],
  tool: null,
});

export const blankSpell = (id = randomId()): OwnSpell => ({
  classes: [],
  id,
  level: 0,
  name: "",
  ritual: false,
});

export const blankSubclass = (id = randomId()): OwnSubclass => ({
  classId: "barbarian",
  features: [],
  id,
  name: "",
});

// ── As a rule pack ──

/** What a player typed, in every language: they type it once, in theirs. */
const same = (words: string): Words => ({ en: words, fr: words });

const asTrait = (own: OwnTrait): Trait => ({
  name: same(own.name),
  text: same(own.text),
});

/** The id an entry has among every pack's: its pack's id, then its own. */
export const fullId = (pack: { id: string }, id: string) => `${pack.id}:${id}`;

/** The 2014 rules' copy of a class, for spells and subclasses that fit either. */
const CLASS_5_1 = (id: string) => `srd-5.1:${id}`;

/** The same subclass, made for the 2014 rules' copy of its class. */
export const SUBCLASS_5_1_SUFFIX = ":5.1";

const speciesOf = (pack: OwnPack, own: OwnSpecies): Species => {
  const boosts: Partial<Record<Ability, number>> = Object.fromEntries(
    Object.entries(own.boosts).filter(([, amount]) => amount > 0)
  );

  const hasBoosts = Object.keys(boosts).length > 0;
  const cantrips = own.cantrip ? [own.cantrip] : undefined;

  return {
    boostChoice:
      own.boostChoice > 0
        ? {
            count: own.boostChoice,
            except: ABILITIES.filter((entry) => own.boosts[entry] > 0),
          }
        : undefined,
    boosts: hasBoosts ? boosts : undefined,
    cantrips,
    castingChoice: cantrips ? true : undefined,
    darkvision: own.darkvision > 0 ? own.darkvision : undefined,
    hitPointsPerLevel:
      own.hitPointsPerLevel > 0 ? own.hitPointsPerLevel : undefined,
    id: fullId(pack, own.id),
    languages:
      own.languages.length > 0 || own.extraLanguages > 0
        ? { extra: own.extraLanguages, known: own.languages }
        : undefined,
    name: same(own.name),
    sizes: own.size === "either" ? ["medium", "small"] : [own.size],
    skillChoice:
      own.skillChoice > 0
        ? {
            count: own.skillChoice,
            from: SKILLS.filter((entry) => !own.skills.includes(entry)),
            label: same(own.name),
          }
        : undefined,
    skills: own.skills.length > 0 ? own.skills : undefined,
    speed: own.speed,
    traits: own.traits.map(asTrait),
  };
};

/** All three, or none: a background raises three abilities or leaves it to the species. */
const threeOf = ([first, second, third]: readonly Ability[]) =>
  first && second && third
    ? ([first, second, third] satisfies [Ability, Ability, Ability])
    : undefined;

const backgroundOf = (pack: OwnPack, own: OwnBackground): Background => ({
  abilities: threeOf(own.abilities),
  equipment: same(own.equipment),
  feat: own.feat ?? undefined,
  gear: [],
  gold: own.gold,
  id: fullId(pack, own.id),
  initiateList:
    own.feat === "magic-initiate" ? (own.initiateList ?? "wizard") : undefined,
  languages: own.languages > 0 ? own.languages : undefined,
  name: same(own.name),
  skills: own.skills,
  tool: own.tool ?? undefined,
  trait: own.feature ? asTrait(own.feature) : undefined,
});

const spellOf = (pack: OwnPack, own: OwnSpell): Spell => ({
  // On the class's list in the 2024 rules and in the 2014 ones
  classes: own.classes.flatMap((id) => [id, CLASS_5_1(id)]),
  id: fullId(pack, own.id),
  level: own.level,
  name: same(own.name),
  ritual: own.ritual ? true : undefined,
});

/** One subclass for the 2024 rules' class, one for the 2014 rules'. */
const subclassesOf = (pack: OwnPack, own: OwnSubclass): Subclass[] => {
  const id = fullId(pack, own.id);
  const features = own.features.map(asTrait);

  return [
    { classId: own.classId, features, id, name: same(own.name) },
    {
      classId: CLASS_5_1(own.classId),
      features,
      id: `${id}${SUBCLASS_5_1_SUFFIX}`,
      name: same(own.name),
    },
  ];
};

/** A pack of one's own, as a rule pack. */
export const toPack = (own: OwnPack): Pack => ({
  boostsFrom: "background",
  builtIn: false,
  content: {
    backgrounds: own.backgrounds.map((entry) => backgroundOf(own, entry)),
    classes: [],
    fightingStyles: [],
    invocations: [],
    languages: [],
    species: own.species.map((entry) => speciesOf(own, entry)),
    spells: own.spells.map((entry) => spellOf(own, entry)),
    subclasses: own.subclasses.flatMap((entry) => subclassesOf(own, entry)),
  },
  id: own.id,
  licence: "",
  name: same(own.name),
});

// ── In this browser ──

const EVENT = "character-maker-packs-saved";

const readRaw = () => {
  try {
    return localStorage.getItem(OWN_PACKS_KEY) ?? "";
  } catch {
    return "";
  }
};

/** The packs in a saved list, dropping any that no longer read as one. */
const parsePacks = (raw: string): OwnPack[] => {
  try {
    const list: unknown = raw ? JSON.parse(raw) : [];

    return Array.isArray(list)
      ? list.flatMap((entry) => {
          const parsed = ownPackSchema.safeParse(entry);

          return parsed.success ? [parsed.data] : [];
        })
      : [];
  } catch {
    return [];
  }
};

interface Loaded {
  /** Counts the reads, so what is worked out from the packs knows they changed. */
  generation: number;
  own: readonly OwnPack[];
  packs: readonly Pack[];
}

let loaded: Loaded | null = null;

let generation = 0;

/** The packs as read, read again only when they change. */
const current = (): Loaded => {
  if (!loaded) {
    const own = parsePacks(readRaw());

    generation += 1;
    loaded = { generation, own, packs: own.map(toPack) };
  }

  return loaded;
};

const changed = () => {
  loaded = null;
  window.dispatchEvent(new Event(EVENT));
};

if (typeof window !== "undefined") {
  // Another tab saved its packs
  window.addEventListener("storage", (event) => {
    if (event.key === OWN_PACKS_KEY || event.key === null) {
      loaded = null;
    }
  });
}

/** Every pack of one's own in this browser, newest first. */
export const ownPacks = (): readonly OwnPack[] => current().own;

/** The same, as rule packs. */
export const ownRulePacks = (): readonly Pack[] => current().packs;

/** A number that changes whenever the packs do, for what is worked out from them. */
export const ownPacksVersion = (): number => current().generation;

export const ownPackById = (id: string): OwnPack | undefined =>
  ownPacks().find((pack) => pack.id === id);

const writePacks = (packs: readonly OwnPack[]) => {
  try {
    localStorage.setItem(OWN_PACKS_KEY, JSON.stringify(packs));
  } catch {
    // Storage full or off: the pack stays on the page for this visit
  }

  changed();
};

/**
 * Saves a pack over its last version, newest first; a new one only while
 * there is room. Only what the schema accepts goes in. Says whether it was
 * saved.
 */
export const saveOwnPack = (pack: OwnPack, now = new Date()) => {
  const parsed = ownPackSchema.safeParse({
    ...pack,
    updatedAt: now.toISOString(),
  });

  if (!parsed.success) {
    return false;
  }

  const all = ownPacks();
  const others = all.filter((entry) => entry.id !== pack.id);

  if (others.length === all.length && others.length >= MAX_OWN_PACKS) {
    return false;
  }

  writePacks([parsed.data, ...others]);

  return true;
};

export const deleteOwnPack = (id: string) =>
  writePacks(ownPacks().filter((pack) => pack.id !== id));

const subscribe = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === OWN_PACKS_KEY || event.key === null) {
      onChange();
    }
  };

  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
};

/** The packs of one's own, kept current as they are saved. */
export const useOwnPacks = (): readonly OwnPack[] =>
  useSyncExternalStore(subscribe, ownPacks);
