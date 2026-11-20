// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";

import { newCharacter } from "./character";
import type { Character } from "./character";
import { setClass } from "./edits";
import {
  MAX_OWN_PACKS,
  OWN_PACKS_KEY,
  blankBackground,
  blankSpecies,
  blankSpell,
  blankSubclass,
  deleteOwnPack,
  newOwnPack,
  ownPacks,
  saveOwnPack,
} from "./own-packs";
import type { OwnPack } from "./own-packs";
import { SRD_5_1, SRD_5_2_1, contentOf, packById } from "./packs";
import {
  backgroundOf,
  boostsOf,
  sheetOf,
  speciesCantrips,
  speciesOf,
  spellsOn,
  subclassesFor,
} from "./rules";
import {
  characterFile,
  packFile,
  readCharacterFile,
  readPackFile,
} from "./transfer";

/** Empties this browser's storage, as another tab clearing it would. */
const clearStorage = () => {
  localStorage.clear();
  window.dispatchEvent(new StorageEvent("storage", { key: null }));
};

afterEach(clearStorage);

/** A homebrew pack: a species, a background, a spell and a subclass. */
const homebrew = (): OwnPack => ({
  ...newOwnPack("Tables of Tallow"),
  backgrounds: [
    {
      ...blankBackground("candler"),
      abilities: ["dex", "int", "wis"],
      equipment: "Candles, a knife",
      feat: "alert",
      gold: 12,
      name: "Candler",
      skills: ["sleight-of-hand", "investigation"],
      tool: "calligraphers-supplies",
    },
  ],
  id: "own-tallow0000",
  species: [
    {
      ...blankSpecies("waxling"),
      boosts: { cha: 0, con: 2, dex: 0, int: 0, str: 0, wis: 1 },
      cantrip: "fire-bolt",
      darkvision: 60,
      languages: ["common"],
      name: "Waxling",
      size: "either",
      skills: ["perception"],
      speed: 25,
      traits: [{ name: "Melt", text: "Resistance to cold." }],
    },
  ],
  spells: [
    {
      ...blankSpell("wick"),
      classes: ["wizard"],
      level: 1,
      name: "Wick Light",
    },
  ],
  subclasses: [
    {
      ...blankSubclass("wax"),
      classId: "wizard",
      features: [{ name: "Wax Ward", text: "A ward of wax." }],
      name: "School of Wax",
    },
  ],
});

const withPacks = (c: Character, packs: string[]): Character => ({
  ...c,
  packs,
});

describe("a player's own packs", () => {
  it("are kept in this browser, newest first, and deleted", () => {
    expect(saveOwnPack(homebrew())).toBe(true);
    expect(saveOwnPack(newOwnPack("Second"))).toBe(true);
    expect(ownPacks().map((pack) => pack.name)).toEqual([
      "Second",
      "Tables of Tallow",
    ]);

    deleteOwnPack("own-tallow0000");

    expect(ownPacks().map((pack) => pack.name)).toEqual(["Second"]);
  });

  it("never go past the slots, and only as the schema accepts them", () => {
    for (let index = 0; index < MAX_OWN_PACKS; index += 1) {
      expect(saveOwnPack(newOwnPack(`Pack ${index}`))).toBe(true);
    }

    expect(saveOwnPack(newOwnPack("One too many"))).toBe(false);
    expect(saveOwnPack({ ...homebrew(), name: "" })).toBe(false);
  });

  it("drop a damaged save without losing the others", () => {
    saveOwnPack(homebrew());

    const raw = JSON.parse(localStorage.getItem(OWN_PACKS_KEY) ?? "[]");
    localStorage.setItem(
      OWN_PACKS_KEY,
      JSON.stringify([...raw, { id: "own-broken", name: 7 }])
    );
    window.dispatchEvent(new StorageEvent("storage", { key: OWN_PACKS_KEY }));

    expect(ownPacks().map((pack) => pack.id)).toEqual(["own-tallow0000"]);
  });

  it("are rule packs a character can be made from", () => {
    saveOwnPack(homebrew());

    expect(packById("own-tallow0000")?.builtIn).toBe(false);

    const c = withPacks(
      {
        ...setClass(
          withPacks(newCharacter("ana"), [SRD_5_2_1, "own-tallow0000"]),
          "wizard"
        ),
        backgroundId: "own-tallow0000:candler",
        boost: { mode: "2-1", plus1: "int", plus2: "dex" },
        speciesId: "own-tallow0000:waxling",
        subclass: "own-tallow0000:wax",
      },
      [SRD_5_2_1, "own-tallow0000"]
    );

    expect(speciesOf(c)).toMatchObject({
      darkvision: 60,
      sizes: ["medium", "small"],
      speed: 25,
    });
    expect(backgroundOf(c)?.name.en).toBe("Candler");
    expect(boostsOf(c)).toMatchObject({ con: 2, dex: 2, int: 1, wis: 1 });
    expect(speciesCantrips(c)).toContain("fire-bolt");
    expect(spellsOn(c, "wizard", 1).map((spell) => spell.id)).toContain(
      "own-tallow0000:wick"
    );
    expect(subclassesFor(c).map((entry) => entry.id)).toContain(
      "own-tallow0000:wax"
    );
    expect(sheetOf(c).features.map((feature) => feature.name.en)).toEqual(
      expect.arrayContaining(["Melt", "School of Wax: Wax Ward"])
    );
  });

  it("fit the 2014 rules' classes as well", () => {
    saveOwnPack(homebrew());

    const c = setClass(
      withPacks(newCharacter("ben"), [SRD_5_1, "own-tallow0000"]),
      "srd-5.1:wizard"
    );

    expect(spellsOn(c, "srd-5.1:wizard", 1).map((spell) => spell.id)).toContain(
      "own-tallow0000:wick"
    );
    expect(subclassesFor(c).map((entry) => entry.id)).toContain(
      "own-tallow0000:wax:5.1"
    );
  });

  it("are read again once they change", () => {
    saveOwnPack(homebrew());

    const before = contentOf(["own-tallow0000"]).species.length;

    saveOwnPack({ ...homebrew(), species: [] });

    expect(before).toBe(1);
    expect(contentOf(["own-tallow0000"]).species).toEqual([]);
  });
});

describe("pack files", () => {
  it("import a pack a friend exported, keeping its id", () => {
    const text = JSON.stringify(packFile(homebrew()));

    expect(readPackFile(text)).toMatchObject({
      ok: true,
      pack: { id: "own-tallow0000", name: "Tables of Tallow" },
    });
  });

  it("say why a file can't be imported", () => {
    const file = packFile(homebrew());

    expect(readPackFile("{nope")).toEqual({ ok: false, reason: "notPack" });
    expect(readPackFile(JSON.stringify({ ...file, version: 2 }))).toEqual({
      ok: false,
      reason: "newer",
    });
    expect(
      readPackFile(JSON.stringify({ ...file, pack: { id: "own-x" } }))
    ).toEqual({ ok: false, reason: "damaged" });

    saveOwnPack(homebrew());

    expect(readPackFile(JSON.stringify(file))).toEqual({
      ok: false,
      reason: "exists",
    });
  });
});

describe("character files with a player's own pack", () => {
  it("carry the pack, so a friend can import the character without it", () => {
    saveOwnPack(homebrew());

    const c = withPacks(
      { ...newCharacter("ana"), speciesId: "own-tallow0000:waxling" },
      [SRD_5_2_1, "own-tallow0000"]
    );

    const text = JSON.stringify(characterFile(c));

    expect(characterFile(c).homemade.map((pack) => pack.id)).toEqual([
      "own-tallow0000",
    ]);

    // The friend's browser has no packs of its own
    clearStorage();

    const result = readCharacterFile(text, "copy");

    expect(result).toMatchObject({
      character: { speciesId: "own-tallow0000:waxling" },
      ok: true,
      packs: [{ id: "own-tallow0000" }],
    });
  });

  it("carry nothing for a pack this browser has already", () => {
    saveOwnPack(homebrew());

    const c = withPacks(newCharacter("ana"), [SRD_5_2_1, "own-tallow0000"]);

    expect(readCharacterFile(JSON.stringify(characterFile(c)))).toMatchObject({
      ok: true,
      packs: [],
    });
  });
});
