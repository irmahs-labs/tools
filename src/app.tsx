import { useEffect } from "react";

import { Hub } from "./components/hub";
import { useLanguage } from "./lib/language";
import { usePath, withoutTrailingSlashes } from "./router";
import { Landing } from "./tools/album-cover-maker/components/landing";
import { Maker } from "./tools/album-cover-maker/components/maker";
import { ALBUM_HOME, ALBUM_MAKER } from "./tools/album-cover-maker/paths";
import { Editor } from "./tools/character-maker/components/editor";
import { Home as CharacterHome } from "./tools/character-maker/components/home";
import { PackEditor } from "./tools/character-maker/components/pack-editor";
import { SheetPage } from "./tools/character-maker/components/sheet-page";
import { characterPageAt } from "./tools/character-maker/paths";

type Page =
  | "hub"
  | "album"
  | "maker"
  | "characters"
  | "character"
  | "character-sheet"
  | "character-pack";

/** The page at `path`; any address Tools doesn't know is the hub. */
export const pageAt = (path: string): Page => {
  const bare = withoutTrailingSlashes(path);

  if (bare === ALBUM_MAKER) {
    return "maker";
  }

  if (bare === ALBUM_HOME) {
    return "album";
  }

  const character = characterPageAt(bare);

  if (character?.page === "home") {
    return "characters";
  }

  if (character?.page === "pack") {
    return "character-pack";
  }

  if (character) {
    return character.page === "sheet" ? "character-sheet" : "character";
  }

  return "hub";
};

/** The character id in a Character Maker address, or "". */
const characterIdAt = (path: string): string => {
  const found = characterPageAt(withoutTrailingSlashes(path));

  return found && "id" in found ? found.id : "";
};

export const App = () => {
  const path = usePath();
  const page = pageAt(path);
  const french = useLanguage() === "fr";

  useEffect(() => {
    const by = french ? "par" : "by";
    const album = `Album Cover Maker ${by} Irma HS`;
    const make = french ? "Créer une pochette" : "Make a cover";

    const characters = `Character Maker ${by} Irma HS`;
    const sheet = french ? "Fiche de personnage" : "Character sheet";
    const editing = french ? "Créer un personnage" : "Make a character";
    const pack = french ? "Votre contenu" : "Your own content";

    const titles: Record<Page, string> = {
      album,
      character: `${editing} · ${characters}`,
      "character-pack": `${pack} · ${characters}`,
      "character-sheet": `${sheet} · ${characters}`,
      characters,
      hub: `Tools ${by} Irma HS`,
      maker: `${make} · ${album}`,
    };

    document.title = titles[page];
  }, [page, french]);

  if (page === "maker") {
    return <Maker />;
  }

  if (page === "characters") {
    return <CharacterHome />;
  }

  if (page === "character") {
    return <Editor id={characterIdAt(path)} />;
  }

  if (page === "character-pack") {
    return <PackEditor id={characterIdAt(path)} />;
  }

  if (page === "character-sheet") {
    return <SheetPage id={characterIdAt(path)} />;
  }

  return page === "album" ? <Landing /> : <Hub />;
};
