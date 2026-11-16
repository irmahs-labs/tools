import { useEffect } from "react";

import { Hub } from "./components/hub";
import { useLanguage } from "./lib/language";
import { usePath, withoutTrailingSlashes } from "./router";
import { Landing } from "./tools/album-cover-maker/components/landing";
import { Maker } from "./tools/album-cover-maker/components/maker";
import { ALBUM_HOME, ALBUM_MAKER } from "./tools/album-cover-maker/paths";

type Page = "hub" | "album" | "maker";

/** The page at `path`; any address Tools doesn't know is the hub. */
export const pageAt = (path: string): Page => {
  const bare = withoutTrailingSlashes(path);

  if (bare === ALBUM_MAKER) {
    return "maker";
  }

  return bare === ALBUM_HOME ? "album" : "hub";
};

export const App = () => {
  const page = pageAt(usePath());
  const french = useLanguage() === "fr";

  useEffect(() => {
    const by = french ? "par" : "by";
    const album = `Album Cover Maker ${by} Irma HS`;
    const make = french ? "Créer une pochette" : "Make a cover";

    const titles: Record<Page, string> = {
      album,
      hub: `Tools ${by} Irma HS`,
      maker: `${make} · ${album}`,
    };

    document.title = titles[page];
  }, [page, french]);

  if (page === "maker") {
    return <Maker />;
  }

  return page === "album" ? <Landing /> : <Hub />;
};
