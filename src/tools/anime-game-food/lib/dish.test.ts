import { describe, expect, it } from "vitest";

import { cookOf, pickDish, SCENES, sourcesOfKind } from "./dish";
import type { SourceId } from "./dish";
import { DISHES } from "./dishes";
import { FOOD_WARS } from "./food-wars";
import { hasFrench, ingredientName } from "./ingredients";
import { POKEMON_SLEEP, realIngredient } from "./pokemon-sleep";

describe("the dishes", () => {
  it("has every Pokémon Sleep recipe but the three Mixed ones", () => {
    expect(POKEMON_SLEEP).toHaveLength(81);
    expect(POKEMON_SLEEP.some((d) => d.name.startsWith("Mixed"))).toBe(false);
  });

  it("gives every dish a name, a known scene and at least one ingredient", () => {
    for (const dish of DISHES) {
      expect(dish.name.trim(), dish.name).not.toBe("");
      expect(SCENES[dish.scene], `${dish.name}: ${dish.scene}`).toBeDefined();
      expect(dish.ingredients.length, dish.name).toBeGreaterThan(0);
    }
  });

  it("names each dish once within its source, cook included", () => {
    const seen = new Set<string>();

    for (const dish of DISHES) {
      const key = `${dish.source}:${dish.name}:${dish.cook}`;
      expect(seen.has(key), key).toBe(false);
      seen.add(key);
    }
  });

  it("lists an ingredient once per dish", () => {
    for (const dish of DISHES) {
      expect(new Set(dish.ingredients).size, dish.name).toBe(
        dish.ingredients.length
      );
    }
  });

  it("has a French name for every ingredient and theme", () => {
    for (const dish of DISHES) {
      for (const ingredient of [...dish.ingredients, dish.theme ?? "egg"]) {
        expect(hasFrench(ingredient), ingredient).toBe(true);
      }
    }
  });

  it("uses real food for the game's ingredient names", () => {
    expect(realIngredient("Fancy Apple")).toBe("apple");
    expect(realIngredient("Moomoo Milk")).toBe("milk");
    expect(() => realIngredient("Fancy Pear")).toThrow();
    expect(POKEMON_SLEEP.flatMap((d) => d.ingredients)).not.toContain(
      "Fancy Apple"
    );
  });

  it("says who cooked a dish in French", () => {
    const duo = FOOD_WARS.find((d) => d.name === "Bœuf bourguignon");
    expect(duo && cookOf(duo, "fr")).toBe("Yukihira Sōma et Tadokoro Megumi");
    expect(ingredientName("egg", "fr")).toBe("œuf");
    expect(ingredientName("egg", "en")).toBe("egg");
  });
});

describe("pickDish", () => {
  const all = new Set(sourcesOfKind());

  it("only picks from the sources chosen", () => {
    const games = new Set<SourceId>(sourcesOfKind("game"));

    for (let i = 0; i < 20; i += 1) {
      expect(pickDish(DISHES, games, null)?.source).toBe("pokemon-sleep");
    }

    const anime = new Set<SourceId>(sourcesOfKind("anime"));
    expect(pickDish(DISHES, anime, null)?.source).toBe("food-wars");
  });

  it("never shows the same dish twice in a row", () => {
    const first = pickDish(DISHES, all, null, () => 0);
    expect(first).toBe(DISHES[0]);
    expect(pickDish(DISHES, all, first, () => 0)).toBe(DISHES[1]);
  });

  it("keeps the one dish when there's only one", () => {
    const only = [DISHES[0]].filter((d) => d !== undefined);
    expect(pickDish(only, all, only[0] ?? null)).toBe(only[0]);
  });

  it("picks nothing when no source is chosen", () => {
    expect(pickDish(DISHES, new Set(), null)).toBeNull();
  });

  it("can reach the last dish", () => {
    expect(pickDish(DISHES, all, null, () => 0.999999)).toBe(DISHES.at(-1));
  });
});
