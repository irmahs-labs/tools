import { useRef } from "react";
import type { ReactNode } from "react";

import { useCopy, useLanguage } from "../lib/language";
import type { Language } from "../lib/language";
import { linkTo, usePath, withoutTrailingSlashes } from "../router";
import type { LinkClick } from "../router";
import { TOOLS } from "../tools";
import type { Tool } from "../tools";
import { AccountButton } from "./account-button";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

const COPY = {
  en: {
    all: "all tools",
    app: "Tools · by Irma HS",
    close: "Close the menu",
    menu: "Menu",
    pages: (tool: string) => `${tool}: its pages`,
    tools: "Every tool and its pages",
  },
  fr: {
    all: "tous les outils",
    app: "Tools · par Irma HS",
    close: "Fermer le menu",
    menu: "Menu",
    pages: (tool: string) => `${tool} : ses pages`,
    tools: "Tous les outils et leurs pages",
  },
};

/** A tab: where it goes, what it says, and whether it's the page open. */
export interface ToolTab {
  href: string;
  label: string;
  current?: boolean;
}

/** A tool's own pages as tabs, the one at `path` open. */
const tabsOf = (tool: Tool, language: Language, path: string): ToolTab[] =>
  tool.pages.map((page) => ({
    current: page.href === path,
    href: page.href,
    label: page.name[language],
  }));

const MenuIcon = ({ close = false }: { close?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d={close ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
  </svg>
);

/**
 * A phone's menu: a ☰ button that opens a drawer from the left with every
 * tool and its pages, the one open in lime. A native dialog, so Escape
 * closes it and the focus stays inside.
 */
const ToolMenu = ({
  slug,
  tabs,
}: {
  slug: string;
  /** The open tool's tabs, listed under it: a character's editor and sheet too */
  tabs: readonly ToolTab[];
}) => {
  const t = useCopy(COPY);
  const language = useLanguage();
  const drawer = useRef<HTMLDialogElement>(null);
  const close = () => drawer.current?.close();

  const go = (href: string) => (event: LinkClick) => {
    close();
    linkTo(href)(event);
  };

  return (
    <>
      <button
        type="button"
        className="tool-menu-button"
        aria-label={t.menu}
        aria-haspopup="dialog"
        onClick={() => drawer.current?.showModal()}
      >
        <MenuIcon />
      </button>
      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- the backdrop press is a mouse shortcut; Escape closes the dialog natively */}
      <dialog
        ref={drawer}
        className="tool-drawer"
        aria-label={t.tools}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <nav className="tool-drawer__body">
          <button
            type="button"
            className="tool-menu-button tool-drawer__close"
            aria-label={t.close}
            onClick={close}
          >
            <MenuIcon close />
          </button>
          <a href="/" onClick={go("/")} className="tool-drawer__link">
            ← {t.all}
          </a>
          {TOOLS.map((tool) => (
            <section key={tool.slug} className="tool-drawer__tool">
              <h2 className="tool-drawer__title">{tool.name[language]}</h2>
              <ul className="tool-drawer__pages">
                {(tool.slug === slug ? tabs : tabsOf(tool, language, "")).map(
                  (tab) => (
                    <li key={tab.href}>
                      <a
                        href={tab.href}
                        onClick={go(tab.href)}
                        className="tool-drawer__link"
                        aria-current={tab.current ? "page" : undefined}
                      >
                        {tab.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </section>
          ))}
        </nav>
      </dialog>
    </>
  );
};

/**
 * Every tool page's header, uncluttered: the tool's logo and name, "Tools
 * · by Irma HS" under it, the page's own buttons (`actions`, and `end`
 * before the shared pills), and the shared pills. Under it, a quiet way
 * back to every tool, then the tool's pages as tabs, the open one lifted in
 * lime. On a
 * phone the tabs give way to the menu.
 */
export const ToolHeader = ({
  slug,
  tabs,
  actions,
  end,
  className = "",
}: {
  slug: string;
  /** Its tabs; by default the tool's own pages, the one at this address open. */
  tabs?: readonly ToolTab[];
  actions?: ReactNode;
  end?: ReactNode;
  className?: string;
}) => {
  const t = useCopy(COPY);
  const language = useLanguage();
  const tool = TOOLS.find((entry) => entry.slug === slug);

  if (!tool) {
    throw new Error(`There is no tool called ${slug}`);
  }

  const name = tool.name[language];
  const path = withoutTrailingSlashes(usePath());

  const shown = tabs ?? tabsOf(tool, language, path);

  return (
    <>
      <header className={`topbar ${className}`}>
        <ToolMenu slug={slug} tabs={shown} />
        <a
          href={tool.href}
          onClick={linkTo(tool.href)}
          className="brand"
          aria-label={name}
        >
          <tool.Logo />
          <span>
            <span className="brand-name">{name}</span>
            <span className="brand-by">{t.app}</span>
          </span>
        </a>
        {actions ? <div className="topbar-actions">{actions}</div> : null}
        <div className="topbar-end">
          {end}
          <LanguageToggle />
          <ThemeToggle />
          <AccountButton />
        </div>
      </header>
      <nav className="tool-tabs" aria-label={t.pages(name)}>
        <a href="/" onClick={linkTo("/")} className="tool-tabs__back">
          ← {t.all}
        </a>
        {shown.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            onClick={linkTo(tab.href)}
            className="tool-tab"
            aria-current={tab.current ? "page" : undefined}
          >
            {tab.label}
          </a>
        ))}
      </nav>
    </>
  );
};
