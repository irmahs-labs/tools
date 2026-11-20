import type { ReactNode } from "react";

import { ToolHeader } from "../../../components/tool-header";
import { useCopy } from "../../../lib/language";
import { CHARACTER_HOME, characterPath, packPath, sheetPath } from "../paths";
import { COPY } from "./copy";

/**
 * Character Maker's header, the one every tool has: its tabs are your
 * characters, and with one open, its editor and its sheet, or the pack
 * open. `children` are
 * the page's own buttons, like printing the sheet.
 */
export const Topbar = ({
  character,
  pack,
  page,
  children,
}: {
  /** The character open, if any. */
  character?: string;
  /** The player's own pack open, if any. */
  pack?: { id: string; name: string };
  page: "home" | "edit" | "sheet" | "pack";
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
    ...(pack
      ? [
          {
            current: page === "pack",
            href: packPath(pack.id),
            label: pack.name,
          },
        ]
      : []),
  ];

  return <ToolHeader slug="character-maker" tabs={tabs} actions={children} />;
};
