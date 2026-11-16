import { useMemo, useSyncExternalStore } from "react";

import { characterSchema } from "./character";
import type { Character } from "./character";

/**
 * The characters a visitor made, kept in this browser's localStorage only:
 * nothing leaves the browser. Each is read through the character schema, so
 * one damaged save is dropped without losing the others.
 */
export const STORAGE_KEY = "tools:character-maker:v1";

const EVENT = "character-maker-saved";

/** The characters in a saved list, dropping any that no longer read as one. */
const parseCharacters = (raw: string): Character[] => {
  try {
    const list: unknown = raw ? JSON.parse(raw) : [];

    return Array.isArray(list)
      ? list.flatMap((entry) => {
          const parsed = characterSchema.safeParse(entry);

          return parsed.success ? [parsed.data] : [];
        })
      : [];
  } catch {
    return [];
  }
};

const readRaw = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

export const loadCharacters = (): Character[] => parseCharacters(readRaw());

export const saveCharacters = (characters: readonly Character[]) => {
  // Only what the schema accepts is stored: what a visitor typed is checked
  // (its type and its length) before it goes in
  const checked = characters.flatMap((character) => {
    const parsed = characterSchema.safeParse(character);

    return parsed.success ? [parsed.data] : [];
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  } catch {
    // Storage full or off: the character stays on the page for this visit
  }

  window.dispatchEvent(new Event(EVENT));
};

/** Saves one character over its last version, newest first. */
export const saveCharacter = (character: Character, now = new Date()) => {
  const others = loadCharacters().filter((entry) => entry.id !== character.id);

  saveCharacters([{ ...character, updatedAt: now.toISOString() }, ...others]);
};

export const deleteCharacter = (id: string) =>
  saveCharacters(loadCharacters().filter((entry) => entry.id !== id));

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

/** The saved characters, kept current as they are saved. */
export const useCharacters = (): Character[] => {
  const raw = useSyncExternalStore(subscribe, readRaw);

  return useMemo(() => parseCharacters(raw), [raw]);
};
