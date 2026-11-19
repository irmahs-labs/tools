import { describe, expect, it } from "vitest";

import { newCharacter } from "./character";
import type { Character } from "./character";
import { setClass } from "./edits";
import { FILE_VERSION, characterFile, readCharacterFile } from "./transfer";

const ana = (): Character => ({
  ...setClass({ ...newCharacter("ana"), name: "Ana Tellwind" }, "fighter"),
  subclass: "champion",
});

describe("character files", () => {
  it("export the choices, the worked-out sheet and the packs", () => {
    const file = characterFile(ana(), new Date("2026-11-19T10:00:00Z"));

    expect(file).toMatchObject({
      format: "irmahs-character",
      homemade: [],
      packs: [{ id: "srd-5.2.1" }],
      version: FILE_VERSION,
    });
    expect(file.sheet).toMatchObject({
      class: "fighter",
      level: 1,
      name: "Ana Tellwind",
      subclass: "champion",
    });
    expect(file.sheet.hitPoints).toBeGreaterThan(0);
  });

  it("import as a new character, never over the one exported", () => {
    const text = JSON.stringify(characterFile(ana()));
    const result = readCharacterFile(text, "copy");

    expect(result).toMatchObject({
      character: { classId: "fighter", id: "copy", name: "Ana Tellwind" },
      ok: true,
    });
  });

  it("say why a file can't be imported", () => {
    const file = characterFile(ana());

    expect(readCharacterFile("{nope")).toEqual({
      ok: false,
      reason: "notCharacter",
    });
    expect(readCharacterFile(JSON.stringify({ name: "Ana" }))).toEqual({
      ok: false,
      reason: "notCharacter",
    });
    expect(
      readCharacterFile(JSON.stringify({ ...file, version: FILE_VERSION + 1 }))
    ).toEqual({ ok: false, reason: "newer" });
    expect(
      readCharacterFile(
        JSON.stringify({ ...file, packs: [{ id: "my-homebrew" }] })
      )
    ).toEqual({ ok: false, pack: "my-homebrew", reason: "pack" });
    expect(
      readCharacterFile(
        JSON.stringify({ ...file, character: { ...file.character, name: 7 } })
      )
    ).toEqual({ ok: false, reason: "damaged" });
  });
});
