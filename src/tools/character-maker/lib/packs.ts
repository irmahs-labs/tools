import { w } from "./words";
import type { Words } from "./words";

/**
 * Rule packs: where a character's species, backgrounds, classes and spells
 * come from. Each character keeps the ids of the packs it was made with. For
 * now the only pack is the SRD 5.2.1 the maker was built on; other free
 * rulebooks and players' own packs come next (see the design note "Character
 * Maker Packs" in Irma's notes).
 */
export interface Pack {
  id: string;
  name: Words;
  /** Where a species or background takes its ability increases from by default. */
  boostsFrom: "background" | "species";
  licence: string;
  /** Ships with the maker, so a character file only names it. */
  builtIn: true;
}

export const SRD_5_2_1 = "srd-5.2.1";

export const PACKS: readonly Pack[] = [
  {
    boostsFrom: "background",
    builtIn: true,
    id: SRD_5_2_1,
    licence: "CC-BY-4.0",
    name: w("SRD 5.2.1 (2024 rules)", "SRD 5.2.1 (règles 2024)"),
  },
];

/** The packs a new character starts with. */
export const DEFAULT_PACKS: readonly string[] = [SRD_5_2_1];

export const packById = (id: string): Pack | undefined =>
  PACKS.find((pack) => pack.id === id);
