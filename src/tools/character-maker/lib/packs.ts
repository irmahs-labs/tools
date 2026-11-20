import {
  CLASSES,
  FIGHTING_STYLES,
  INVOCATIONS,
  SUGGESTED_ARRAY,
} from "./srd/classes";
import type { ClassInfo, FightingStyle } from "./srd/classes";
import { LANGUAGES } from "./srd/core";
import type { Language } from "./srd/core";
import { BACKGROUNDS, SPECIES } from "./srd/origins";
import type { Background, Species, Trait } from "./srd/origins";
import { SPELLS } from "./srd/spells";
import type { Spell } from "./srd/spells";
import { SUBCLASSES } from "./srd/subclasses";
import type { Subclass } from "./srd/subclasses";
import { CLASSES_5_1, FIGHTING_STYLES_5_1 } from "./srd51/classes";
import { BACKGROUNDS_5_1, LANGUAGES_5_1, SPECIES_5_1 } from "./srd51/origins";
import { SPELLS_5_1 } from "./srd51/spells";
import { SUBCLASSES_5_1 } from "./srd51/subclasses";
import { w } from "./words";
import type { Words } from "./words";

/**
 * Rule packs: where a character's species, backgrounds, classes, subclasses
 * and spells come from. Each character keeps the ids of the packs it was made
 * with, and the rules only offer and read what those packs hold. An entry's
 * id is unique across every pack, so a choice names one entry. For now the
 * only pack is the SRD 5.2.1; other free rulebooks and players' own packs
 * come next (see the design note "Character Maker Packs" in Irma's notes).
 */
export interface PackContent {
  classes: readonly ClassInfo[];
  subclasses: readonly Subclass[];
  species: readonly Species[];
  backgrounds: readonly Background[];
  spells: readonly Spell[];
  fightingStyles: readonly FightingStyle[];
  invocations: readonly (Trait & { id: string })[];
  /** The languages a character picks from, besides those they know. */
  languages: readonly Language[];
}

export interface Pack {
  id: string;
  name: Words;
  /** Where a species or background takes its ability increases from by default. */
  boostsFrom: "background" | "species";
  licence: string;
  /** Ships with the maker, so a character file only names it. */
  builtIn: true;
  content: PackContent;
}

/** The Standard Array the SRD 5.2.1 suggests for a class of that name. */
const suggestedFor = (name: string) =>
  Object.entries(SUGGESTED_ARRAY).find(([id]) => id === name)?.[1];

export const SRD_5_2_1 = "srd-5.2.1";

export const SRD_5_1 = "srd-5.1";

export const PACKS: readonly Pack[] = [
  {
    boostsFrom: "background",
    builtIn: true,
    content: {
      backgrounds: BACKGROUNDS,
      classes: CLASSES.map((info) => ({
        ...info,
        suggested: SUGGESTED_ARRAY[info.id],
      })),
      fightingStyles: FIGHTING_STYLES,
      invocations: INVOCATIONS,
      languages: LANGUAGES,
      species: SPECIES,
      spells: SPELLS,
      subclasses: SUBCLASSES,
    },
    id: SRD_5_2_1,
    licence: "CC-BY-4.0",
    name: w("SRD 5.2.1 (2024 rules)", "SRD 5.2.1 (règles 2024)"),
  },
  {
    boostsFrom: "species",
    builtIn: true,
    content: {
      backgrounds: BACKGROUNDS_5_1,
      classes: CLASSES_5_1.map((info) => ({
        ...info,
        // The SRD 5.2.1's suggestions suit the same classes in the SRD 5.1
        suggested: suggestedFor(info.id.replace("srd-5.1:", "")),
      })),
      fightingStyles: FIGHTING_STYLES_5_1,
      invocations: [],
      languages: LANGUAGES_5_1,
      species: SPECIES_5_1,
      spells: SPELLS_5_1,
      subclasses: SUBCLASSES_5_1,
    },
    id: SRD_5_1,
    licence: "CC-BY-4.0",
    name: w("SRD 5.1 (2014 rules)", "SRD 5.1 (règles 2014)"),
  },
];

/** The packs a new character starts with. */
export const DEFAULT_PACKS: readonly string[] = [SRD_5_2_1];

export const packById = (id: string): Pack | undefined =>
  PACKS.find((pack) => pack.id === id);

const merged = new Map<string, PackContent>();

/**
 * Everything the packs named by `ids` hold, together; worked out once per
 * set of packs. Packs this maker doesn't have add nothing.
 */
export const contentOf = (ids: readonly string[]): PackContent => {
  const key = ids.join("\n");
  const known = merged.get(key);

  if (known) {
    return known;
  }

  const packs = ids.flatMap((id) => {
    const pack = packById(id);

    return pack ? [pack.content] : [];
  });

  const content: PackContent = {
    backgrounds: packs.flatMap((pack) => pack.backgrounds),
    classes: packs.flatMap((pack) => pack.classes),
    fightingStyles: packs.flatMap((pack) => pack.fightingStyles),
    invocations: packs.flatMap((pack) => pack.invocations),
    languages: [...new Set(packs.flatMap((pack) => pack.languages))],
    species: packs.flatMap((pack) => pack.species),
    spells: packs.flatMap((pack) => pack.spells),
    subclasses: packs.flatMap((pack) => pack.subclasses),
  };

  merged.set(key, content);

  return content;
};
