import * as z from "zod/mini";

import { characterSchema } from "./character";
import type { Character } from "./character";
import { ownPackById, ownPackSchema } from "./own-packs";
import type { OwnPack } from "./own-packs";
import { packById } from "./packs";
import {
  backgroundOf,
  classOf,
  sheetOf,
  speciesCantrips,
  speciesOf,
  subclassOf,
  variantOf,
} from "./rules";

/**
 * A character as a file: what Export as JSON downloads, Import reads back,
 * and Mini Games' one-shot will read. It holds the choices (`character`),
 * the numbers already worked out (`sheet`), and the packs it was made with:
 * built-in ones by id, the player's own ones in full (`homemade`), so a
 * friend can import it without having them.
 */
export const FILE_FORMAT = "irmahs-character";

export const FILE_VERSION = 1;

/** The largest file Import reads, well over any real character. */
export const MAX_FILE_BYTES = 512 * 1024;

const sheetSummary = (c: Character) => {
  const sheet = sheetOf(c);

  return {
    armorClass: sheet.armorClass,
    attacks: sheet.attacks.map((attack) => ({
      bonus: attack.bonus,
      damage: attack.damage,
      type: attack.type,
      weapon: attack.weapon?.id ?? "unarmed",
    })),
    background: backgroundOf(c)?.id ?? null,
    cantrips: [...c.cantrips, ...speciesCantrips(c)],
    class: classOf(c)?.id ?? null,
    features: sheet.features.map((feature) => feature.name.en),
    hitDie: sheet.hitDie,
    hitPoints: sheet.hitPoints,
    initiative: sheet.initiative,
    level: 1,
    mods: sheet.mods,
    name: c.name,
    passivePerception: sheet.passivePerception,
    saves: sheet.saves,
    scores: sheet.scores,
    skills: sheet.skills,
    species: speciesOf(c)?.id ?? null,
    speed: sheet.speed,
    spellcasting: sheet.spellcasting,
    spells: c.spells,
    subclass: subclassOf(c)?.id ?? null,
    variant: variantOf(c)?.id ?? null,
  };
};

/** The file for one character. */
export const characterFile = (c: Character, now = new Date()) => ({
  character: c,
  exportedAt: now.toISOString(),
  format: FILE_FORMAT,
  homemade: c.packs.flatMap((id) => ownPackById(id) ?? []),
  packs: c.packs.map((id) => ({ id })),
  sheet: sheetSummary(c),
  version: FILE_VERSION,
});

/** What any version of the file starts with, read before the rest. */
const headSchema = z.object({
  format: z.literal(FILE_FORMAT),
  version: z.int(),
});

const fileSchema = z.object({
  character: z.unknown(),
  format: z.literal(FILE_FORMAT),
  homemade: z.array(z.unknown()),
  packs: z.array(z.object({ id: z.string() })),
  version: z.int(),
});

export type ImportResult =
  | {
      ok: true;
      character: Character;
      /** The player's own packs it uses that this browser doesn't have yet: they go in with it. */
      packs: OwnPack[];
    }
  | {
      ok: false;
      /** notCharacter: not a character file; newer: made by a newer maker; pack: needs a pack this browser lacks; damaged: the character in it doesn't read. */
      reason: "notCharacter" | "newer" | "pack" | "damaged";
      pack?: string;
    };

/**
 * Reads a character file's text. The character gets a new id, so importing
 * never replaces one already here.
 */
export const readCharacterFile = (
  text: string,
  newId: string = crypto.randomUUID(),
  now = new Date()
): ImportResult => {
  let json: unknown;

  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, reason: "notCharacter" };
  }

  const head = headSchema.safeParse(json);

  if (!head.success) {
    return { ok: false, reason: "notCharacter" };
  }

  if (head.data.version > FILE_VERSION) {
    return { ok: false, reason: "newer" };
  }

  const file = fileSchema.safeParse(json);

  if (!file.success) {
    return { ok: false, reason: "damaged" };
  }

  const carried = file.data.homemade.flatMap((entry) => {
    const pack = ownPackSchema.safeParse(entry);

    return pack.success && !packById(pack.data.id) ? [pack.data] : [];
  });

  const missing = file.data.packs.find(
    ({ id }) => !packById(id) && !carried.some((pack) => pack.id === id)
  );

  if (missing) {
    return { ok: false, pack: missing.id, reason: "pack" };
  }

  const character = characterSchema.safeParse(file.data.character);

  if (!character.success) {
    return { ok: false, reason: "damaged" };
  }

  return {
    character: { ...character.data, id: newId, updatedAt: now.toISOString() },
    ok: true,
    packs: carried.filter((pack) =>
      file.data.packs.some(({ id }) => id === pack.id)
    ),
  };
};

/** "Ana Tellwind" → "ana-tellwind", for file names. */
export const fileSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "") || "character";

/** Hands the browser a JSON file to save. */
const download = (json: string, fileName: string) => {
  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

/** Hands the browser a character's file to save. */
export const downloadCharacter = (c: Character) =>
  download(
    JSON.stringify(characterFile(c), null, 2),
    `${fileSlug(c.name)}.character.json`
  );

// ── A pack of one's own as a file ──

export const PACK_FORMAT = "irmahs-character-pack";

export const PACK_VERSION = 1;

/** The file for one of the player's own packs, to share with their table. */
export const packFile = (pack: OwnPack, now = new Date()) => ({
  exportedAt: now.toISOString(),
  format: PACK_FORMAT,
  pack,
  version: PACK_VERSION,
});

const packHeadSchema = z.object({
  format: z.literal(PACK_FORMAT),
  version: z.int(),
});

export type PackImportResult =
  | { ok: true; pack: OwnPack }
  | {
      ok: false;
      /** notPack: not a pack file; newer: made by a newer maker; damaged: the pack in it doesn't read; exists: this browser has it already. */
      reason: "notPack" | "newer" | "damaged" | "exists";
    };

/** Reads a pack file's text. A pack keeps its id, so the characters made with it find it. */
export const readPackFile = (text: string): PackImportResult => {
  let json: unknown;

  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, reason: "notPack" };
  }

  const head = packHeadSchema.safeParse(json);

  if (!head.success) {
    return { ok: false, reason: "notPack" };
  }

  if (head.data.version > PACK_VERSION) {
    return { ok: false, reason: "newer" };
  }

  const pack = z.object({ pack: ownPackSchema }).safeParse(json);

  if (!pack.success) {
    return { ok: false, reason: "damaged" };
  }

  if (packById(pack.data.pack.id)) {
    return { ok: false, reason: "exists" };
  }

  return { ok: true, pack: pack.data.pack };
};

export const downloadPack = (pack: OwnPack) =>
  download(
    JSON.stringify(packFile(pack), null, 2),
    `${fileSlug(pack.name)}.pack.json`
  );
