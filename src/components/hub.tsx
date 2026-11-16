import { useLanguage } from "../lib/language";
import { linkTo } from "../router";
import { TOOLS } from "../tools";
import { AccountButton } from "./account-button";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";
import { ToolsLogo } from "./tools-logo";
import { Window } from "./window";

const COPY = {
  en: {
    by: "by Irma HS",
    lead: "Free, in your browser, nothing to install. Pick one and get making.",
    more: "more apps at",
    title: "Little tools for making things.",
  },
  fr: {
    by: "par Irma HS",
    lead: "Gratuits, dans votre navigateur, rien à installer. Choisissez-en un et lancez-vous.",
    more: "plus d’apps sur",
    title: "De petits outils pour créer.",
  },
};

const Arrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12 H19 M13 6 L19 12 L13 18" />
  </svg>
);

/** The front page: a hello window, then one card per tool. */
export const Hub = () => {
  const language = useLanguage();
  const t = COPY[language];

  return (
    <div className="page dotted">
      <header className="topbar">
        <a href="/" onClick={linkTo("/")} className="brand">
          <ToolsLogo />
          <span>
            <span className="brand-name">Tools</span>
            <span className="brand-by">{t.by}</span>
          </span>
        </a>
        <div className="topbar-end">
          <LanguageToggle />
          <ThemeToggle />
          <AccountButton />
        </div>
      </header>

      <main className="landing hub">
        <Window name="hello.txt" className="hub-hello">
          <h1>{t.title}</h1>
          <p className="hero-lead">{t.lead}</p>
        </Window>

        <ul className="tool-cards">
          {TOOLS.map((tool) => (
            <li key={tool.slug}>
              <a
                href={tool.href}
                onClick={linkTo(tool.href)}
                aria-label={tool.name[language]}
                className="window tool-card"
              >
                <div className="window-bar">
                  <span className="window-name">{tool.legend}</span>
                  <span className="window-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div className="window-body tool-card__body">
                  <tool.Logo size={56} />
                  <div className="tool-card__text">
                    <h2 className="tool-card__name">
                      {tool.name[language]}
                      <Arrow />
                    </h2>
                    <p className="tool-card__blurb">{tool.blurb[language]}</p>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <footer className="footer">
        {t.more} <a href="https://irmahs.dev">irmahs.dev</a>
      </footer>
    </div>
  );
};
