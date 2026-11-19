// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";

import { MAX_NAME, newCharacter } from "./character";
import {
  MAX_SLOTS,
  STORAGE_KEY,
  deleteCharacter,
  loadCharacters,
  saveCharacter,
} from "./storage";

afterEach(() => localStorage.clear());

describe("characters in this browser", () => {
  it("keeps each character, newest first, and deletes one", () => {
    saveCharacter({ ...newCharacter("one"), name: "Ana" });
    saveCharacter({ ...newCharacter("two"), name: "Ben" });

    expect(loadCharacters().map((c) => c.name)).toEqual(["Ben", "Ana"]);

    deleteCharacter("two");

    expect(loadCharacters().map((c) => c.name)).toEqual(["Ana"]);
  });

  it("stores only what the schema accepts", () => {
    saveCharacter({ ...newCharacter("long"), name: "x".repeat(MAX_NAME + 1) });

    expect(loadCharacters()).toEqual([]);
  });

  it("drops a damaged save without losing the others", () => {
    saveCharacter({ ...newCharacter("good"), name: "Ana" });

    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...raw, { id: 3, name: null }])
    );

    expect(loadCharacters().map((c) => c.name)).toEqual(["Ana"]);

    localStorage.setItem(STORAGE_KEY, "{not json");

    expect(loadCharacters()).toEqual([]);
  });

  it("keeps five characters at most, and never saves over one", () => {
    for (let index = 0; index < MAX_SLOTS; index += 1) {
      expect(saveCharacter(newCharacter(`c${index}`))).toBe(true);
    }

    expect(saveCharacter(newCharacter("sixth"))).toBe(false);
    expect(loadCharacters()).toHaveLength(MAX_SLOTS);
    // A character already here still saves
    expect(saveCharacter({ ...newCharacter("c0"), name: "Ana" })).toBe(true);
    expect(loadCharacters()[0]?.name).toBe("Ana");
  });

  it("reads saves from before subclasses and packs", () => {
    const { packs: _packs, subclass: _subclass, ...old } = newCharacter("old");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([old]));

    expect(loadCharacters()[0]).toMatchObject({
      id: "old",
      packs: ["srd-5.2.1"],
      subclass: null,
    });
  });

  it("renames a Human's and an Elf's picks in saves from before packs", () => {
    const {
      feats,
      speciesFeat: _feat,
      speciesSkill: _skill,
      ...character
    } = newCharacter("old");

    const old = {
      ...character,
      feats: { background: feats.background, human: feats.species },
      humanFeat: "skilled",
      humanSkill: "arcana",
      keenSense: null,
      speciesId: "human",
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([old]));

    const [read] = loadCharacters();

    expect(read).toMatchObject({
      speciesFeat: "skilled",
      speciesSkill: "arcana",
    });
    expect(read?.feats.species).toEqual(feats.species);
    expect(read).not.toHaveProperty("humanSkill");
  });
});
