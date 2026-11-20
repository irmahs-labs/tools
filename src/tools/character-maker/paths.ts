/** Where Character Maker lives inside Tools: its own page, each character, each character's sheet, and each pack of the player's own. */
export const CHARACTER_HOME = "/character-maker";

export const characterPath = (id: string) => `${CHARACTER_HOME}/${id}`;

export const sheetPath = (id: string) => `${CHARACTER_HOME}/${id}/sheet`;

export const packPath = (id: string) => `${CHARACTER_HOME}/packs/${id}`;

/** The page under /character-maker that `path` (without trailing slashes) names, or null. */
export const characterPageAt = (
  path: string
):
  | { page: "home" }
  | { page: "edit" | "sheet" | "pack"; id: string }
  | null => {
  if (path === CHARACTER_HOME) {
    return { page: "home" };
  }

  const pack = /^\/character-maker\/packs\/(?<id>own-[a-z0-9]{8,32})$/u.exec(
    path
  )?.groups?.id;

  if (pack) {
    return { id: pack, page: "pack" };
  }

  const match =
    /^\/character-maker\/(?<id>[\w-]{1,64})(?<sheet>\/sheet)?$/u.exec(path);

  const id = match?.groups?.id;

  if (!id) {
    return null;
  }

  return { id, page: match.groups?.sheet ? "sheet" : "edit" };
};
