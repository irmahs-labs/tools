import type { Language } from "../../../lib/language";

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

/** Where a dish appears: a story arc or challenge, or a game's dish type. */
export const SCENES = {
  disgusting: { en: "Disgusting dishes", fr: "Plats immondes" },
  "ps-curry": { en: "Curry & stew", fr: "Curry et ragoût" },
  "ps-dessert": { en: "Dessert & drink", fr: "Dessert et boisson" },
  "ps-salad": { en: "Salad", fr: "Salade" },
  "s1-breakfast": {
    en: "Season 1 · Training camp breakfast buffet (eggs)",
    fr: "Saison 1 · Buffet du petit-déjeuner du camp (œufs)",
  },
  "s1-camp": {
    en: "Season 1 · Training camp",
    fr: "Saison 1 · Camp d’entraînement",
  },
  "s1-curry": {
    en: "Season 1 · Autumn Election preliminaries (curry)",
    fr: "Saison 1 · Qualifications de l’Élection d’automne (curry)",
  },
  "s1-diner": {
    en: "Season 1 · Yukihira diner and early Tōtsuki days",
    fr: "Saison 1 · Le restaurant Yukihira et les débuts à Tōtsuki",
  },
  "s1-donburi": {
    en: "Season 1 · Donburi duel, Sōma vs Mito Ikumi",
    fr: "Saison 1 · Duel de donburi, Sōma contre Mito Ikumi",
  },
  "s1-joichiro": {
    en: "Season 1 · Yukihira Jōichirō’s cooking",
    fr: "Saison 1 · La cuisine de Yukihira Jōichirō",
  },
  "s1-other": {
    en: "Season 1 · First-year dishes",
    fr: "Saison 1 · Plats de première année",
  },
  "s1-polar": {
    en: "Season 1 · Polar Star dorm",
    fr: "Saison 1 · Le foyer de l’Étoile polaire",
  },
  "s2-after": {
    en: "Season 2 · After the Autumn Election",
    fr: "Saison 2 · Après l’Élection d’automne",
  },
  "s2-bento": {
    en: "Season 2 · Autumn Election quarterfinals (bento)",
    fr: "Saison 2 · Quarts de finale de l’Élection d’automne (bento)",
  },
  "s2-burger": {
    en: "Season 2 · Autumn Election quarterfinals (hamburger)",
    fr: "Saison 2 · Quarts de finale de l’Élection d’automne (hamburger)",
  },
  "s2-dessert": {
    en: "Season 2 · Autumn Election quarterfinals (dessert)",
    fr: "Saison 2 · Quarts de finale de l’Élection d’automne (dessert)",
  },
  "s2-final": {
    en: "Season 2 · Autumn Election final (Pacific saury)",
    fr: "Saison 2 · Finale de l’Élection d’automne (balaou du Japon)",
  },
  "s2-ramen": {
    en: "Season 2 · Autumn Election quarterfinals (ramen)",
    fr: "Saison 2 · Quarts de finale de l’Élection d’automne (ramen)",
  },
  "s2-semi": {
    en: "Season 2 · Autumn Election semifinals (main dish)",
    fr: "Saison 2 · Demi-finales de l’Élection d’automne (plat principal)",
  },
  "s3-central": {
    en: "Season 3 · The Central era",
    fr: "Saison 3 · L’ère de Central",
  },
  "s3-eizan": {
    en: "Season 3 · Shokugeki against Eizan",
    fr: "Saison 3 · Shokugeki contre Eizan",
  },
  "s3-exams": {
    en: "Season 3 · Promotion exams in Hokkaidō",
    fr: "Saison 3 · Examens de passage à Hokkaidō",
  },
  "s3-moon": {
    en: "Season 3 · Moon Banquet Festival",
    fr: "Saison 3 · Festival du banquet de la lune",
  },
  "s3-team1": {
    en: "Season 3 · Team shokugeki, first round",
    fr: "Saison 3 · Shokugeki par équipes, premier tour",
  },
  "s3-training": {
    en: "Season 3 · Team shokugeki training (hachis Parmentier)",
    fr: "Saison 3 · Entraînement au shokugeki par équipes (hachis Parmentier)",
  },
  "s4-final": {
    en: "Season 4 · Team shokugeki, final round",
    fr: "Saison 4 · Shokugeki par équipes, dernier tour",
  },
  "s4-team2": {
    en: "Season 4 · Team shokugeki, second round",
    fr: "Saison 4 · Shokugeki par équipes, deuxième tour",
  },
  "s4-team3": {
    en: "Season 4 · Team shokugeki, third round",
    fr: "Saison 4 · Shokugeki par équipes, troisième tour",
  },
  "s4-team4": {
    en: "Season 4 · Team shokugeki, fourth round",
    fr: "Saison 4 · Shokugeki par équipes, quatrième tour",
  },
  "s5-blue": { en: "Season 5 · BLUE", fr: "Saison 5 · BLUE" },
  "s5-blue-soup": {
    en: "Season 5 · BLUE preliminaries (soup)",
    fr: "Saison 5 · Qualifications du BLUE (soupe)",
  },
  "s5-summer": {
    en: "Season 5 · Summer exam",
    fr: "Saison 5 · Examen d’été",
  },
} satisfies Record<string, Record<Language, string>>;

export type SceneId = keyof typeof SCENES;

/** "Season 1 · Training camp", in the page's language. */
export const sceneOf = (dish: Dish, language: Language): string =>
  SCENES[dish.scene][language];

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
