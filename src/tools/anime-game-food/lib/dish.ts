import type { Language } from "../../../lib/language";
import { BLURBS } from "./data/blurbs";
import { SCENES } from "./data/scenes";
import type { SceneId } from "./data/scenes";

export type SourceKind = "anime" | "game";

export type SourceId = "food-wars" | "pokemon-sleep";

/** An anime or a game the dishes come from. Its name is the same in both languages. */
export interface Source {
  id: SourceId;
  kind: SourceKind;
  name: string;
}

export const SOURCES: readonly Source[] = [
  { id: "food-wars", kind: "anime", name: "Food Wars!" },
  { id: "pokemon-sleep", kind: "game", name: "Pokémon Sleep" },
];

/**
 * A dish as it's written in the data: its name as the show or game gives
 * it (the same in both languages), who cooked it ("" when nobody in
 * particular), where it appears (a key of SCENES), a theme ingredient when
 * the challenge had one, and its ingredients in English, the keys of
 * INGREDIENT_FR.
 */
export interface Dish {
  source: SourceId;
  name: string;
  cook: string;
  scene: SceneId;
  theme?: string;
  ingredients: readonly string[];
}

/** "Season 1 · Training camp", in the page's language. */
export const sceneOf = (dish: Dish, language: Language): string =>
  SCENES[dish.scene][language];

/** The one line on a dish, in the page's language; "" if it has none. */
export const blurbOf = (dish: Dish, language: Language): string => {
  const blurbs: Readonly<Record<string, readonly [string, string]>> =
    BLURBS[dish.source];

  const [en, fr] = blurbs[dish.name] ?? ["", ""];

  return language === "fr" ? fr : en;
};

/** The source a dish comes from. */
export const sourceOf = (dish: Dish): Source => {
  const source = SOURCES.find((s) => s.id === dish.source);

  if (!source) {
    throw new Error(`No source ${dish.source}`);
  }

  return source;
};

/** The ids of every source of a kind, or of every source. */
export const sourcesOfKind = (kind?: SourceKind): SourceId[] =>
  SOURCES.flatMap((s) => (!kind || s.kind === kind ? [s.id] : []));

/** "Yukihira Sōma and Tadokoro Megumi" with the "and" in the page's language. */
export const cookOf = (dish: Dish, language: Language): string =>
  language === "fr"
    ? dish.cook
        .replaceAll(" and ", " et ")
        .replace(/^Team (?<team>.+)$/u, "L’équipe $<team>")
        .replace(/^Yukihira diner$/u, "Le restaurant Yukihira")
    : dish.cook;

/**
 * A dish from one of `sources`, never the one just shown when there's
 * another to pick. `random` is Math.random's shape, so tests can pass
 * their own. Null when no source is picked.
 */
export const pickDish = (
  dishes: readonly Dish[],
  sources: ReadonlySet<SourceId>,
  previous: Dish | null,
  random: () => number = Math.random
): Dish | null => {
  const from = dishes.filter((d) => sources.has(d.source));
  const fresh = from.length > 1 ? from.filter((d) => d !== previous) : from;

  if (fresh.length === 0) {
    return null;
  }

  return fresh[Math.floor(random() * fresh.length)] ?? null;
};
