import { describe, expect, it } from "vitest";

import { newCharacter } from "./character";
import type { Character } from "./character";
import { assignArrayScore, setClass, setScoreMethod } from "./edits";
import {
  cantripCount,
  choicesLeft,
  finalScores,
  isComplete,
  pointsSpent,
  preparedCount,
  rollScore,
  scoresReady,
  sheetOf,
  spellCount,
} from "./rules";
import { CLASSES } from "./srd/classes";
import { WEAPONS, armorById, weaponById } from "./srd/equipment";
import { BACKGROUNDS, BACKGROUND_GEAR, SPECIES } from "./srd/origins";
import { SPELLS } from "./srd/spells";

const make = (changes: Partial<Character>): Character => ({
  ...newCharacter("test", new Date("2026-11-16T12:00:00Z")),
  ...changes,
});

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

describe("the SRD data", () => {
  it("has every cantrip and level 1 spell, named in both languages", () => {
    expect(SPELLS).toHaveLength(84);
    expect(new Set(SPELLS.map((spell) => spell.id)).size).toBe(SPELLS.length);

    for (const spell of SPELLS) {
      expect(spell.name.en).not.toBe("");
      expect(spell.name.fr).not.toBe("");
    }
  });

  it("only names spells, weapons and armor it has", () => {
    const spellIds = new Set(SPELLS.map((spell) => spell.id));

    for (const species of SPECIES) {
      for (const id of [
        ...(species.cantrips ?? []),
        ...(species.variants?.options.flatMap(
          (option) => option.cantrips ?? []
        ) ?? []),
      ]) {
        expect(spellIds.has(id), id).toBe(true);
      }
    }

    for (const info of CLASSES) {
      for (const id of info.spellcasting?.always ?? []) {
        expect(spellIds.has(id), id).toBe(true);
      }

      for (const id of info.packages.flatMap((pack) => pack.gear)) {
        expect(Boolean(weaponById(id) ?? armorById(id)), id).toBe(true);
      }
    }

    for (const background of BACKGROUNDS) {
      for (const id of BACKGROUND_GEAR[background.id]) {
        expect(weaponById(id), id).toBeDefined();
      }
    }
  });

  it("gives every caster enough spells on their list to choose from", () => {
    for (const info of CLASSES) {
      const casting = info.spellcasting;

      if (casting) {
        const onList = (level: number) =>
          SPELLS.filter(
            (spell) => spell.level === level && spell.classes.includes(info.id)
          );

        // One more cantrip for a Thaumaturge or Magician
        expect(onList(0).length, info.id).toBeGreaterThanOrEqual(
          casting.cantrips > 0 ? casting.cantrips + 1 : 0
        );
        expect(onList(1).length, info.id).toBeGreaterThanOrEqual(
          casting.spellbook ?? casting.prepared
        );
      }
    }
  });

  it("knows every weapon on the SRD's table", () => {
    expect(WEAPONS).toHaveLength(38);
  });
});

describe("ability scores", () => {
  it("costs 27 points for the SRD's example spread", () => {
    expect(
      pointsSpent({ cha: 8, con: 14, dex: 14, int: 8, str: 15, wis: 12 })
    ).toBe(27);
    expect(
      pointsSpent({ cha: 16, con: 8, dex: 8, int: 8, str: 8, wis: 8 })
    ).toBeNaN();
  });

  it("checks a Standard Array is one of each score", () => {
    const array = setScoreMethod(make({}), "array");

    expect(scoresReady(array)).toBe(true);

    const swapped = assignArrayScore(array, "cha", 15);

    expect(scoresReady(swapped)).toBe(true);
    expect(swapped.scores.base.cha).toBe(15);
    expect(swapped.scores.base.str).toBe(8);
  });

  it("rolls four d6 and keeps the highest three", () => {
    const dice = [1, 6, 5, 4];

    expect(rollScore(() => dice.shift() ?? 1)).toBe(15);
  });

  it("adds the background's +2 and +1, never past 20", () => {
    const character = make({
      backgroundId: "soldier",
      boost: { mode: "2-1", plus1: "con", plus2: "str" },
      scores: scores(15, 14, 13, 8, 10, 12),
    });

    expect(finalScores(character)).toMatchObject({ con: 14, dex: 14, str: 17 });

    const even = make({
      backgroundId: "sage",
      boost: { mode: "1-1-1", plus1: null, plus2: null },
      scores: scores(8, 8, 15, 15, 15, 8),
    });

    expect(finalScores(even)).toMatchObject({
      con: 16,
      int: 16,
      str: 8,
      wis: 16,
    });
  });
});

describe("the sheet", () => {
  it("works out a dwarf cleric in chain shirt and shield", () => {
    const cleric = make({
      backgroundId: "acolyte",
      boost: { mode: "2-1", plus1: "cha", plus2: "wis" },
      classId: "cleric",
      classSkills: ["medicine", "history"],
      order: "thaumaturge",
      scores: scores(14, 14, 13, 10, 15, 12),
      speciesId: "dwarf",
    });

    const sheet = sheetOf(cleric);

    // 13 + Dex (max 2) + Shield 2
    expect(sheet.armorClass).toBe(17);
    expect(sheet.armorWorn).toEqual(["chain-shirt", "shield"]);
    // d8 + Con +1 + Dwarven Toughness
    expect(sheet.hitPoints).toBe(10);
    expect(sheet.saves.wis).toEqual({ bonus: 5, proficient: true });
    expect(sheet.spellcasting).toMatchObject({ attack: 5, dc: 13, slots: 2 });
    // Thaumaturge: Wisdom +3 on Religion, which the Acolyte is proficient in
    expect(
      sheet.skills.find((entry) => entry.skill === "religion")?.bonus
    ).toBe(5);
    expect(cantripCount(cleric)).toBe(4);
  });

  it("gives a barbarian Unarmored Defense, and a monk theirs without a Shield", () => {
    const barbarian = make({
      classId: "barbarian",
      scores: scores(15, 14, 14, 8, 10, 8),
    });

    expect(sheetOf(barbarian).armorClass).toBe(14);
    expect(sheetOf(barbarian).hitPoints).toBe(14);

    const monk = make({
      classId: "monk",
      scores: scores(10, 15, 13, 8, 14, 8),
    });

    expect(sheetOf(monk).armorClass).toBe(14);
  });

  it("slows a fighter too weak for chain mail, and adds Defense", () => {
    const fighter = make({
      classId: "fighter",
      fightingStyle: "defense",
      scores: scores(12, 14, 13, 8, 10, 12),
    });

    const sheet = sheetOf(fighter);

    expect(sheet.armorClass).toBe(17);
    expect(sheet.slowed).toBe(true);
    expect(sheet.speed).toBe(20);
  });

  it("attacks with a rogue's best ability on Finesse weapons", () => {
    const rogue = make({
      backgroundId: "criminal",
      classId: "rogue",
      scores: scores(8, 15, 13, 12, 10, 14),
      weaponMasteries: ["dagger"],
    });

    const dagger = sheetOf(rogue).attacks.find(
      (attack) => attack.weapon?.id === "dagger"
    );

    expect(dagger).toMatchObject({ bonus: 4, damage: "1d4+2", mastered: true });
    // Alert, from the Criminal: Proficiency Bonus on Initiative
    expect(sheetOf(rogue).initiative).toBe(4);
  });

  it("lets a monk roll a d6 for a dagger, with Dexterity", () => {
    const monk = make({
      classId: "monk",
      scores: scores(10, 16, 13, 8, 14, 8),
    });

    const dagger = sheetOf(monk).attacks.find(
      (attack) => attack.weapon?.id === "dagger"
    );

    expect(dagger?.damage).toBe("1d6+3");
  });

  it("counts a wizard's spellbook and prepared spells", () => {
    const wizard = make({ classId: "wizard" });

    expect(spellCount(wizard)).toBe(6);
    expect(preparedCount(wizard)).toBe(4);
    expect(cantripCount(wizard)).toBe(3);
  });
});

describe("what's left to choose", () => {
  it("starts with something in every step but equipment", () => {
    const left = choicesLeft(make({ scores: scores(15, 15, 15, 15, 15, 15) }));

    expect(left.class).toBe(1);
    expect(left.abilities).toBe(1);
    expect(left.equipment).toBe(0);
  });

  it("clears a class's own choices when the class changes", () => {
    const rogue = make({
      classId: "rogue",
      expertise: ["stealth"],
      weaponMasteries: ["dagger"],
    });

    const wizard = setClass(rogue, "wizard");

    expect(wizard.expertise).toEqual([]);
    expect(wizard.weaponMasteries).toEqual([]);
  });

  it("finishes a whole halfling fighter", () => {
    const fighter = make({
      alignment: "ng",
      backgroundId: "soldier",
      backgroundTool: "dice",
      boost: { mode: "2-1", plus1: "con", plus2: "str" },
      classId: "fighter",
      classSkills: ["acrobatics", "perception"],
      fightingStyle: "defense",
      languages: ["halfling", "elvish"],
      name: "Pip",
      scores: scores(15, 14, 13, 8, 10, 12),
      speciesId: "halfling",
      weaponMasteries: ["greatsword", "flail", "javelin"],
    });

    expect(choicesLeft(fighter)).toEqual({
      abilities: 0,
      class: 0,
      details: 0,
      equipment: 0,
      origin: 0,
      proficiencies: 0,
      spells: 0,
    });
    expect(isComplete(fighter)).toBe(true);
  });
});
