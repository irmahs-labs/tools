import {
  CLASSES,
  FIGHTING_STYLES,
  INVOCATIONS,
  SUGGESTED_ARRAY,
} from "./srd/classes";
import type { ClassInfo } from "./srd/classes";
import { BACKGROUNDS, SPECIES } from "./srd/origins";
import type { Background, Species, Trait } from "./srd/origins";
import { SPELLS } from "./srd/spells";
import type { Spell } from "./srd/spells";
import { SUBCLASSES } from "./srd/subclasses";
import type { Subclass } from "./srd/subclasses";
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
  fightingStyles: readonly (Trait & { id: string })[];
  invocations: readonly (Trait & { id: string })[];
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

export const SRD_5_2_1 = "srd-5.2.1";

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
      species: SPECIES,
      spells: SPELLS,
      subclasses: SUBCLASSES,
    },
    id: SRD_5_2_1,
    licence: "CC-BY-4.0",
    name: w("SRD 5.2.1 (2024 rules)", "SRD 5.2.1 (règles 2024)"),
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
    species: packs.flatMap((pack) => pack.species),
    spells: packs.flatMap((pack) => pack.spells),
    subclasses: packs.flatMap((pack) => pack.subclasses),
  };

  merged.set(key, content);

  return content;
};
