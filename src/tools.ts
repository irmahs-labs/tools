import type { ComponentType } from "react";

import type { Language } from "./lib/language";
import { Logo as AlbumCoverLogo } from "./tools/album-cover-maker/components/logo";
import { ALBUM_HOME, ALBUM_MAKER } from "./tools/album-cover-maker/paths";
import { Logo as FoodLogo } from "./tools/anime-game-food/components/logo";
import { FOOD_HOME } from "./tools/anime-game-food/paths";
import { Logo as CharacterLogo } from "./tools/character-maker/components/logo";
import { CHARACTER_HOME } from "./tools/character-maker/paths";

/**
 * Every tool on the site. Adding one is an entry here and a folder under
 * src/tools/<slug>/, its pages under /<slug>; the hub lists it.
 */
export interface Tool {
  slug: string;
  href: string;
  /** Its name and the card's line, in each of the site's languages. */
  name: Record<Language, string>;
  blurb: Record<Language, string>;
  /** The card's window name, a file with an extension that exists. */
  legend: string;
  Logo: ComponentType<{ size?: number }>;
  /** Its own pages, for the phone's menu. */
  pages: readonly { href: string; name: Record<Language, string> }[];
}

export const TOOLS: readonly Tool[] = [
  {
    Logo: FoodLogo,
    blurb: {
      en: "Click once for a dish from an anime or a game, with its ingredients. Pick which shows and games it draws from.",
      fr: "Un clic pour un plat tiré d’un animé ou d’un jeu, avec ses ingrédients. Choisissez les séries et les jeux.",
    },
    href: FOOD_HOME,
    legend: "anime-game-food.exe",
    name: { en: "Anime & Game Food", fr: "Anime & Game Food" },
    pages: [
      { href: FOOD_HOME, name: { en: "Get a dish", fr: "Tirer un plat" } },
    ],
    slug: "anime-game-food",
  },
  {
    Logo: CharacterLogo,
    blurb: {
      en: "Make a level 1 fifth edition character step by step, with every number worked out, and print its sheet.",
      fr: "Créez pas à pas un personnage de niveau 1 pour la cinquième édition, chaque nombre calculé, et imprimez sa fiche.",
    },
    href: CHARACTER_HOME,
    legend: "character-maker.exe",
    name: { en: "Character Maker", fr: "Character Maker" },
    pages: [
      {
        href: CHARACTER_HOME,
        name: { en: "My characters", fr: "Mes personnages" },
      },
    ],
    slug: "character-maker",
  },
  {
    Logo: AlbumCoverLogo,
    blurb: {
      en: "Drop in a photo, add a title, export a 3000 × 3000 cover and a player mock-up.",
      fr: "Glissez une photo, ajoutez un titre, exportez une pochette de 3000 × 3000 et une maquette de lecteur.",
    },
    href: ALBUM_HOME,
    legend: "album-cover-maker.exe",
    name: { en: "Album Cover Maker", fr: "Album Cover Maker" },
    pages: [
      { href: ALBUM_HOME, name: { en: "About", fr: "À propos" } },
      {
        href: ALBUM_MAKER,
        name: { en: "Make a cover", fr: "Créer une pochette" },
      },
    ],
    slug: "album-cover-maker",
  },
];
