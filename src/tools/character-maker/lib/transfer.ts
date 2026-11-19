import * as z from "zod/mini";

import { characterSchema } from "./character";
import type { Character } from "./character";
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
 * built-in ones by id, the player's own ones in full (`homemade`, none yet),
 * so a friend can import it without having them.
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
  homemade: [],
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
  | { ok: true; character: Character }
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

  const missing = file.data.packs.find(({ id }) => !packById(id));

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
  };
};

/** "Ana Tellwind" → "ana-tellwind", for file names. */
export const fileSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "") || "character";

/** Hands the browser a character's file to save. */
export const downloadCharacter = (c: Character) => {
  const blob = new Blob([JSON.stringify(characterFile(c), null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileSlug(c.name)}.character.json`;
  link.click();
  URL.revokeObjectURL(url);
};
