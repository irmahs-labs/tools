import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Footer } from "../../../components/footer";
import { Window } from "../../../components/window";
import { useCopy, useLanguage } from "../../../lib/language";
import { linkTo, navigate } from "../../../router";
import { newCharacter } from "../lib/character";
import type { Character } from "../lib/character";
import { packById } from "../lib/packs";
import { backgroundOf, classOf, speciesOf, subclassOf } from "../lib/rules";
import {
  MAX_SLOTS,
  deleteCharacter,
  saveCharacter,
  useCharacters,
} from "../lib/storage";
import {
  MAX_FILE_BYTES,
  downloadCharacter,
  fileSlug,
  readCharacterFile,
} from "../lib/transfer";
import type { ImportResult } from "../lib/transfer";
import { characterPath, sheetPath } from "../paths";
import { COPY } from "./copy";
import { Topbar } from "./topbar";

/** Opens the sheet in a new tab with the print dialog, where it saves as PDF. */
const exportPdf = (id: string) =>
  window.open(`${sheetPath(id)}?print`, "_blank", "noopener");

/** The message for an import that didn't go in. */
const importProblem = (
  result: Exclude<ImportResult, { ok: true }>,
  t: (typeof COPY)["en"]
) => {
  if (result.reason === "pack") {
    return t.importPack(result.pack ?? "");
  }

  return t.importFailed[result.reason];
};

/** One saved character: what it is, and what can be done with it. */
const CharacterCard = ({
  character,
  onDelete,
}: {
  character: Character;
  onDelete: (character: Character) => void;
}) => {
  const language = useLanguage();
  const t = useCopy(COPY);
  const info = classOf(character);
  const subclass = subclassOf(character);

  return (
    <Window name={`${fileSlug(character.name)}.txt`}>
      <h2 className="character-name">{character.name.trim() || t.untitled}</h2>
      <p className="hint">
        {[
          info && subclass
            ? `${info.name[language]} (${subclass.name[language]})`
            : info?.name[language],
          speciesOf(character)?.name[language],
          backgroundOf(character)?.name[language],
        ]
          .filter(Boolean)
          .join(" · ") || t.startHere}
      </p>
      <p className="hint character-packs">
        {t.packs}
        {t.colon}
        {character.packs
          .map((id) => packById(id)?.name[language] ?? id)
          .join(", ")}
      </p>
      <div className="character-actions">
        <a
          href={characterPath(character.id)}
          onClick={linkTo(characterPath(character.id))}
          className="pill small"
        >
          {t.edit}
        </a>
        <a
          href={sheetPath(character.id)}
          onClick={linkTo(sheetPath(character.id))}
          className="pill small"
        >
          {t.sheet}
        </a>
        <button
          type="button"
          className="pill small"
          onClick={() => exportPdf(character.id)}
        >
          {t.exportPdf}
        </button>
        <button
          type="button"
          className="pill small"
          onClick={() => downloadCharacter(character)}
        >
          {t.exportJson}
        </button>
        <button
          type="button"
          className="pill small"
          onClick={() => onDelete(character)}
        >
          {t.delete}
        </button>
      </div>
    </Window>
  );
};

/**
 * Asks before a character goes, and offers to keep a copy first: the
 * sheet as a PDF, or the character file to import again later.
 */
const DeleteDialog = ({
  dialog,
  character,
  onClose,
}: {
  dialog: React.RefObject<HTMLDialogElement | null>;
  character: Character | null;
  onClose: () => void;
}) => {
  const t = useCopy(COPY);
  const name = character?.name.trim() || t.untitled;

  return (
    <dialog
      ref={dialog}
      className="cm-dialog"
      aria-labelledby="cm-delete-title"
      onClose={onClose}
    >
      {character ? (
        <>
          <h2 id="cm-delete-title">{t.deleteTitle(name)}</h2>
          <p>{t.deleteLead}</p>
          <div className="character-actions">
            <button
              type="button"
              className="pill small"
              onClick={() => exportPdf(character.id)}
            >
              {t.exportPdf}
            </button>
            <button
              type="button"
              className="pill small"
              onClick={() => downloadCharacter(character)}
            >
              {t.exportJson}
            </button>
          </div>
          <div className="cm-dialog-end">
            <button
              type="button"
              className="pill"
              onClick={() => dialog.current?.close()}
            >
              {t.cancel}
            </button>
            <button
              type="button"
              className="pill danger"
              onClick={() => {
                deleteCharacter(character.id);
                dialog.current?.close();
              }}
            >
              {t.deleteForGood}
            </button>
          </div>
        </>
      ) : null}
    </dialog>
  );
};

/** Character Maker's own page: what it does, a way to start or import, and the characters made in this browser. */
export const Home = () => {
  const t = useCopy(COPY);
  const characters = useCharacters();
  const full = characters.length >= MAX_SLOTS;
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<Character | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  const start = () => {
    const character = newCharacter();

    if (saveCharacter(character)) {
      navigate(characterPath(character.id));
    } else {
      setMessage(t.full(MAX_SLOTS));
    }
  };

  const chooseFile = () => {
    if (full) {
      setMessage(t.full(MAX_SLOTS));
    } else {
      picker.current?.click();
    }
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setMessage(t.importFailed.notCharacter);

      return;
    }

    const result = readCharacterFile(await file.text());

    if (!result.ok) {
      setMessage(importProblem(result, t));

      return;
    }

    setMessage(
      saveCharacter(result.character)
        ? t.imported(result.character.name.trim() || t.untitled)
        : t.full(MAX_SLOTS)
    );
  };

  const askDelete = (character: Character) => {
    setDeleting(character);
    dialog.current?.showModal();
  };

  return (
    <div className="page dotted">
      <Topbar page="home" />
      <main className="landing cm-home">
        <Window name="hello.txt" className="hub-hello">
          <p className="badge">{t.compatible}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-lead">{t.heroLead}</p>
          <div className="character-actions">
            <button type="button" className="pill primary big" onClick={start}>
              {t.make}
            </button>
            <button type="button" className="pill big" onClick={chooseFile}>
              {t.importJson}
            </button>
            <input
              ref={picker}
              type="file"
              accept="application/json,.json"
              aria-label={t.importJson}
              hidden
              onChange={importFile}
            />
          </div>
          <p className="hint">
            {t.characterSlots(characters.length, MAX_SLOTS)}
          </p>
          <p className="hint cm-message" aria-live="polite">
            {message}
          </p>
        </Window>

        {characters.length === 0 ? (
          <p className="lead center">{t.empty}</p>
        ) : (
          <ul className="character-list">
            {characters.map((character) => (
              <li key={character.id}>
                <CharacterCard character={character} onDelete={askDelete} />
              </li>
            ))}
          </ul>
        )}

        <p className="hint center">{t.savedHere}</p>
        <p className="credit">{t.credit}</p>
      </main>
      <DeleteDialog
        dialog={dialog}
        character={deleting}
        onClose={() => setDeleting(null)}
      />
      <Footer />
    </div>
  );
};
