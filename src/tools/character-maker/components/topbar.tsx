import type { ReactNode } from "react";

import { AccountButton } from "../../../components/account-button";
import { LanguageToggle } from "../../../components/language-toggle";
import { ThemeToggle } from "../../../components/theme-toggle";
import { useCopy } from "../../../lib/language";
import { linkTo } from "../../../router";
import { CHARACTER_HOME } from "../paths";
import { COPY } from "./copy";
import { Logo } from "./logo";

/** Character Maker's header: its die and name, linking to its own page, the page's buttons, and the shared pills. */
export const Topbar = ({ children }: { children?: ReactNode }) => {
  const t = useCopy(COPY);

  return (
    <header className="topbar">
      <a
        href={CHARACTER_HOME}
        onClick={linkTo(CHARACTER_HOME)}
        className="brand"
      >
        <Logo />
        <span>
          <span className="brand-name">Character Maker</span>
          <span className="brand-by">{t.by}</span>
        </span>
      </a>
      {children ? <div className="topbar-actions">{children}</div> : null}
      <div className="topbar-end">
        <LanguageToggle />
        <ThemeToggle />
        <AccountButton />
      </div>
    </header>
  );
};
