import type { ComponentType } from "react";

import type { Language } from "./lib/language";
import { Logo as AlbumCoverLogo } from "./tools/album-cover-maker/components/logo";
import { ALBUM_HOME } from "./tools/album-cover-maker/paths";

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
}

export const TOOLS: readonly Tool[] = [
  {
    Logo: AlbumCoverLogo,
    blurb: {
      en: "Drop in a photo, add a title, export a 3000 × 3000 cover and a player mock-up.",
      fr: "Glissez une photo, ajoutez un titre, exportez une pochette de 3000 × 3000 et une maquette de lecteur.",
    },
    href: ALBUM_HOME,
    legend: "album-cover-maker.exe",
    name: { en: "Album Cover Maker", fr: "Album Cover Maker" },
    slug: "album-cover-maker",
  },
];
