import { useCopy } from "../lib/language";
import { SiteLinks } from "./site-links";

const COPY = {
  en: { more: "more apps at" },
  fr: { more: "plus d’apps sur" },
};

/**
 * The end of every Tools page: "more apps at irmahs.dev", then the
 * legal pages on irmahs.dev.
 */
export const Footer = () => {
  const t = useCopy(COPY);

  return (
    <footer className="site-end">
      <p className="footer">
        {t.more} <a href="https://irmahs.dev">irmahs.dev</a>
      </p>
      <SiteLinks />
    </footer>
  );
};
