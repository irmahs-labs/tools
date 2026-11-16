// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";

import { MAX_NAME, newCharacter } from "./character";
import {
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
});
