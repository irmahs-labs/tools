import { describe, expect, it } from "vitest";

import { newCharacter } from "./character";
import type { Character } from "./character";
import { SRD_5_1, contentOf } from "./packs";
import {
  boostsOf,
  choicesLeft,
  knownLanguages,
  languageCount,
  proficientSkills,
  proficientWith,
  sheetOf,
  speciesCantrips,
  spellCount,
  spellsOn,
} from "./rules";
import { armorById, weaponById } from "./srd/equipment";

/** A character made from the SRD 5.1 only. */
const make = (changes: Partial<Character>): Character => ({
  ...newCharacter("srd51", new Date("2026-11-20T12:00:00Z")),
  packs: [SRD_5_1],
  ...changes,
});

const content = contentOf([SRD_5_1]);

const scores = (
  str: number,
  dex: number,
  con: number,
  int: number,
  wis: number,
  cha: number
) => ({
  base: { cha, con, dex, int, str, wis },
  method: "points" as const,
});

describe("the SRD 5.1 pack", () => {
  it("has the nine races, twelve classes, their subclasses and the Acolyte", () => {
    expect(content.species).toHaveLength(9);
    expect(content.classes).toHaveLength(12);
    expect(content.subclasses).toHaveLength(12);
    expect(content.backgrounds.map((entry) => entry.id)).toEqual([
      "srd-5.1:acolyte",
    ]);

    for (const subclass of content.subclasses) {
      expect(
        content.classes.some((info) => info.id === subclass.classId),
        subclass.id
      ).toBe(true);
    }
  });

  it("only names weapons, armor and spells it has", () => {
    const spellIds = new Set(content.spells.map((spell) => spell.id));

    for (const info of content.classes) {
      for (const id of info.packages.flatMap((pack) => pack.gear)) {
        expect(Boolean(weaponById(id) ?? armorById(id)), id).toBe(true);
      }

      for (const id of info.weaponList ?? []) {
        expect(id === "simple" || Boolean(weaponById(id)), id).toBe(true);
      }
    }

    for (const species of content.species) {
      for (const id of species.cantrips ?? []) {
        expect(spellIds.has(id), id).toBe(true);
      }
    }
  });

  it("gives every class that casts at level 1 enough spells to pick", () => {
    for (const info of content.classes) {
      const casting = info.spellcasting;

      if (casting) {
        const character = make({ classId: info.id });

        expect(
          spellsOn(character, info.id, 0).length,
          info.id
        ).toBeGreaterThanOrEqual(casting.cantrips);
        expect(
          spellsOn(character, info.id, 1).length,
          info.id
        ).toBeGreaterThanOrEqual(casting.spellbook ?? casting.prepared);
      }
    }
  });
});

describe("an SRD 5.1 character", () => {
  it("takes its increases from its race: a Hill Dwarf Cleric", () => {
    const cleric = make({
      classId: "srd-5.1:cleric",
      scores: scores(14, 10, 14, 8, 15, 12),
      speciesId: "srd-5.1:hill-dwarf",
    });

    expect(boostsOf(cleric)).toMatchObject({ con: 2, wis: 1 });

    const sheet = sheetOf(cleric);

    // Con 16 (+3) on a d8, and Dwarven Toughness
    expect(sheet.hitPoints).toBe(12);
    expect(sheet.speed).toBe(25);
    // Wisdom 16 (+3): prepares 3 + 1
    expect(spellCount(cleric)).toBe(4);
    expect(knownLanguages(cleric)).toEqual(["common", "dwarvish"]);
    expect(proficientWith(cleric, weaponById("warhammer") ?? never())).toBe(
      true
    );
  });

  it("asks a Half-Elf for two +1s and two skills, and an Acolyte for two languages", () => {
    const halfElf = make({
      backgroundId: "srd-5.1:acolyte",
      speciesId: "srd-5.1:half-elf",
    });

    expect(choicesLeft(halfElf).origin).toBe(4 + 1 + 2);
    expect(languageCount(halfElf)).toBe(3);

    const done = {
      ...halfElf,
      // Charisma doesn't count: the Half-Elf's +2 is already there
      speciesBoosts: ["cha", "str", "dex"] satisfies Character["speciesBoosts"],
      speciesSkills: ["stealth", "arcana"] satisfies Character["speciesSkills"],
    };

    expect(boostsOf(done)).toMatchObject({ cha: 2, dex: 1, str: 1 });
    expect(proficientSkills(done).has("arcana")).toBe(true);
    expect(proficientSkills(done).has("religion")).toBe(true);
  });

  it("lets a High Elf pick a wizard cantrip, and knows only a Wizard's few weapons", () => {
    const elf = make({
      classId: "srd-5.1:wizard",
      speciesCantrip: "srd-5.1:fire-bolt",
      speciesId: "srd-5.1:high-elf",
    });

    expect(speciesCantrips(elf)).toEqual(["srd-5.1:fire-bolt"]);
    expect(proficientWith(elf, weaponById("quarterstaff") ?? never())).toBe(
      true
    );
    // Elf Weapon Training
    expect(proficientWith(elf, weaponById("longbow") ?? never())).toBe(true);
    expect(proficientWith(elf, weaponById("club") ?? never())).toBe(false);
    // A cantrip from another list doesn't count
    expect(
      speciesCantrips({ ...elf, speciesCantrip: "srd-5.1:sacred-flame" })
    ).toEqual([]);
  });
});

/** A weapon that isn't there fails the test. */
const never = (): never => {
  throw new Error("missing weapon");
};
