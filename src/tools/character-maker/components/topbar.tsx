import type { ReactNode } from "react";

import { ToolHeader } from "../../../components/tool-header";
import { useCopy } from "../../../lib/language";
import { CHARACTER_HOME, characterPath, sheetPath } from "../paths";
import { COPY } from "./copy";

/**
 * Character Maker's header, the one every tool has: its tabs are your
 * characters, and with one open, its editor and its sheet. `children` are
 * the page's own buttons, like printing the sheet.
 */
export const Topbar = ({
  character,
  page,
  children,
}: {
  /** The character open, if any. */
  character?: string;
  page: "home" | "edit" | "sheet";
  children?: ReactNode;
}) => {
  const t = useCopy(COPY);

  const tabs = [
    { current: page === "home", href: CHARACTER_HOME, label: t.myCharacters },
    ...(character
      ? [
          {
            current: page === "edit",
            href: characterPath(character),
            label: t.editTab,
          },
          {
            current: page === "sheet",
            href: sheetPath(character),
            label: t.sheetTab,
          },
        ]
      : []),
  ];

  return <ToolHeader slug="character-maker" tabs={tabs} actions={children} />;
};
