/** Where Character Maker lives inside Tools: its own page, each character, and each character's sheet. */
export const CHARACTER_HOME = "/character-maker";

export const characterPath = (id: string) => `${CHARACTER_HOME}/${id}`;

export const sheetPath = (id: string) => `${CHARACTER_HOME}/${id}/sheet`;

/** The page under /character-maker that `path` (without trailing slashes) names, or null. */
export const characterPageAt = (
  path: string
): { page: "home" } | { page: "edit" | "sheet"; id: string } | null => {
  if (path === CHARACTER_HOME) {
    return { page: "home" };
  }

  const match =
    /^\/character-maker\/(?<id>[\w-]{1,64})(?<sheet>\/sheet)?$/u.exec(path);

  const id = match?.groups?.id;

  if (!id) {
    return null;
  }

  return { id, page: match.groups?.sheet ? "sheet" : "edit" };
};
