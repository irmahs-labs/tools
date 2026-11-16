import { describe, expect, it } from "vitest";

import { pageAt } from "../../app";
import { characterPageAt, characterPath, sheetPath } from "./paths";

describe("Character Maker's addresses", () => {
  it("names its own page, a character, and a character's sheet", () => {
    expect(characterPageAt("/character-maker")).toEqual({ page: "home" });
    expect(characterPageAt(characterPath("abc-123"))).toEqual({
      id: "abc-123",
      page: "edit",
    });
    expect(characterPageAt(sheetPath("abc-123"))).toEqual({
      id: "abc-123",
      page: "sheet",
    });
  });

  it("leaves addresses it doesn't know to the hub", () => {
    expect(characterPageAt("/character-maker/a/b")).toBeNull();
    expect(characterPageAt("/character-maker/<script>")).toBeNull();
    expect(pageAt("/character-maker/a/b")).toBe("hub");
    expect(pageAt("/character-maker/")).toBe("characters");
    expect(pageAt("/character-maker/abc/sheet/")).toBe("character-sheet");
  });
});
