import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Window } from "../../../components/window";
import { useLanguage } from "../../../lib/language";
import { linkTo, navigate } from "../../../router";
import {
  MAX_OWN_PACKS,
  OWN_KINDS,
  deleteOwnPack,
  newOwnPack,
  saveOwnPack,
  useOwnPacks,
} from "../lib/own-packs";
import type { OwnPack } from "../lib/own-packs";
import { useCharacters } from "../lib/storage";
import {
  MAX_FILE_BYTES,
  downloadPack,
  fileSlug,
  readPackFile,
} from "../lib/transfer";
import { packPath } from "../paths";
import { COPY } from "./copy";
import { OWN_COPY } from "./own-copy";

/** What a pack holds: "2 species · 1 spell". */
const contents = (pack: OwnPack, t: (typeof OWN_COPY)["en"]) =>
  OWN_KINDS.filter((kind) => pack[kind].length > 0)
    .map((kind) => t.count[kind](pack[kind].length))
    .join(" · ") || t.empty;

/** Asks before a pack goes, offers its file first, and says who uses it. */
const DeletePackDialog = ({
  dialog,
  pack,
  onClose,
}: {
  dialog: React.RefObject<HTMLDialogElement | null>;
  pack: OwnPack | null;
  onClose: () => void;
}) => {
  const language = useLanguage();
  const t = OWN_COPY[language];

  const users = useCharacters().filter((c) =>
    pack ? c.packs.includes(pack.id) : false
  ).length;

  return (
    <dialog
      ref={dialog}
      className="cm-dialog"
      aria-labelledby="cm-delete-pack-title"
      onClose={onClose}
    >
      {pack ? (
        <>
          <h2 id="cm-delete-pack-title">{t.deleteTitle(pack.name)}</h2>
          <p>{t.deleteLead}</p>
          {users > 0 ? <p>{t.deleteUsedBy(users)}</p> : null}
          <div className="cm-dialog-buttons">
            <button
              type="button"
              className="pill small"
              onClick={() => downloadPack(pack)}
            >
              {COPY[language].exportJson}
            </button>
            <button
              type="button"
              className="pill small"
              onClick={() => dialog.current?.close()}
            >
              {COPY[language].cancel}
            </button>
            <button
              type="button"
              className="pill small danger"
              onClick={() => {
                deleteOwnPack(pack.id);
                dialog.current?.close();
              }}
            >
              {t.delete}
            </button>
          </div>
        </>
      ) : null}
    </dialog>
  );
};

/**
 * The player's own packs on Character Maker's page: make one, import one a
 * friend shared, and edit, export or delete each.
 */
export const OwnPacksSection = () => {
  const language = useLanguage();
  const t = OWN_COPY[language];
  const packs = useOwnPacks();
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<OwnPack | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const full = packs.length >= MAX_OWN_PACKS;

  const start = () => {
    const pack = newOwnPack(t.newPackName);

    if (saveOwnPack(pack)) {
      navigate(packPath(pack.id));
    } else {
      setMessage(t.full(MAX_OWN_PACKS));
    }
  };

  const chooseFile = () => {
    if (full) {
      setMessage(t.full(MAX_OWN_PACKS));
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
      setMessage(t.importFailed.notPack);

      return;
    }

    const result = readPackFile(await file.text());

    if (!result.ok) {
      setMessage(t.importFailed[result.reason]);

      return;
    }

    setMessage(
      saveOwnPack(result.pack)
        ? t.imported(result.pack.name)
        : t.full(MAX_OWN_PACKS)
    );
  };

  return (
    <section className="own-packs" aria-labelledby="own-packs-title">
      <Window name="my-packs.txt" className="hub-hello">
        <h2 id="own-packs-title" className="character-name">
          {t.myPacks}
        </h2>
        <p>{t.lead}</p>
        <div className="character-actions">
          <button type="button" className="pill primary" onClick={start}>
            {t.newPack}
          </button>
          <button type="button" className="pill" onClick={chooseFile}>
            {t.importPack}
          </button>
          <input
            ref={picker}
            type="file"
            accept="application/json,.json"
            aria-label={t.importPack}
            hidden
            onChange={importFile}
          />
        </div>
        <p className="hint">{t.packSlots(packs.length, MAX_OWN_PACKS)}</p>
        <p className="hint cm-message" aria-live="polite">
          {message}
        </p>
      </Window>
      {packs.length > 0 ? (
        <ul className="character-list">
          {packs.map((pack) => (
            <li key={pack.id}>
              <Window name={`${fileSlug(pack.name)}.pack`}>
                <h3 className="character-name">{pack.name}</h3>
                <p className="hint">{contents(pack, t)}</p>
                <div className="character-actions">
                  <a
                    href={packPath(pack.id)}
                    onClick={linkTo(packPath(pack.id))}
                    className="pill small"
                  >
                    {t.edit}
                  </a>
                  <button
                    type="button"
                    className="pill small"
                    onClick={() => downloadPack(pack)}
                  >
                    {COPY[language].exportJson}
                  </button>
                  <button
                    type="button"
                    className="pill small"
                    onClick={() => {
                      setDeleting(pack);
                      dialog.current?.showModal();
                    }}
                  >
                    {t.delete}
                  </button>
                </div>
              </Window>
            </li>
          ))}
        </ul>
      ) : null}
      <DeletePackDialog
        dialog={dialog}
        pack={deleting}
        onClose={() => setDeleting(null)}
      />
    </section>
  );
};
