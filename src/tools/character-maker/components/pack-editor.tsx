import { useState } from "react";

import { Footer } from "../../../components/footer";
import { Window } from "../../../components/window";
import { useLanguage } from "../../../lib/language";
import { linkTo } from "../../../router";
import {
  MAX_ENTRIES,
  OWN_KINDS,
  blankBackground,
  blankSpecies,
  blankSpell,
  blankSubclass,
  saveOwnPack,
  useOwnPacks,
} from "../lib/own-packs";
import type {
  OwnBackground,
  OwnKind,
  OwnPack,
  OwnSpecies,
  OwnSpell,
  OwnSubclass,
  OwnTrait,
} from "../lib/own-packs";
import { downloadPack } from "../lib/transfer";
import { CHARACTER_HOME } from "../paths";
import { COPY } from "./copy";
import { OWN_COPY } from "./own-copy";
import {
  BackgroundForm,
  SpeciesForm,
  SpellForm,
  SubclassForm,
} from "./pack-forms";
import { Topbar } from "./topbar";

/** The entry open in its form: which kind, and its draft. */
type Editing =
  | { kind: "species"; draft: OwnSpecies }
  | { kind: "backgrounds"; draft: OwnBackground }
  | { kind: "spells"; draft: OwnSpell }
  | { kind: "subclasses"; draft: OwnSubclass };

const blankOf = (kind: OwnKind): Editing => {
  if (kind === "species") {
    return { draft: blankSpecies(), kind };
  }

  if (kind === "backgrounds") {
    return { draft: blankBackground(), kind };
  }

  return kind === "spells"
    ? { draft: blankSpell(), kind }
    : { draft: blankSubclass(), kind };
};

/** One entry as `list` is, put in or put back over its last version. */
const upsert = <T extends { id: string }>(list: readonly T[], entry: T): T[] =>
  list.some((each) => each.id === entry.id)
    ? list.map((each) => (each.id === entry.id ? entry : each))
    : [...list, entry];

/** Traits without a name aren't kept: a name is what the sheet lists. */
const named = (traits: readonly OwnTrait[]) =>
  traits.flatMap((trait) =>
    trait.name.trim()
      ? [{ name: trait.name.trim(), text: trait.text.trim() }]
      : []
  );

/** The pack with the draft saved in it, tidied as the schema wants it. */
const withEntry = (pack: OwnPack, editing: Editing): OwnPack => {
  const name = editing.draft.name.trim();

  switch (editing.kind) {
    case "species": {
      const traits = named(editing.draft.traits);

      return {
        ...pack,
        species: upsert(pack.species, { ...editing.draft, name, traits }),
      };
    }

    case "backgrounds": {
      const [feature] = named(
        editing.draft.feature ? [editing.draft.feature] : []
      );

      return {
        ...pack,
        backgrounds: upsert(pack.backgrounds, {
          ...editing.draft,
          feature: feature ?? null,
          name,
        }),
      };
    }

    case "spells": {
      return {
        ...pack,
        spells: upsert(pack.spells, { ...editing.draft, name }),
      };
    }

    default: {
      const features = named(editing.draft.features);

      return {
        ...pack,
        subclasses: upsert(pack.subclasses, {
          ...editing.draft,
          features,
          name,
        }),
      };
    }
  }
};

/** The pack without the entry `id`: ids are random, so it's in one list only. */
const withoutEntry = (pack: OwnPack, id: string): OwnPack => {
  const keep = <T extends { id: string }>(list: readonly T[]) =>
    list.filter((entry) => entry.id !== id);

  return {
    ...pack,
    backgrounds: keep(pack.backgrounds),
    species: keep(pack.species),
    spells: keep(pack.spells),
    subclasses: keep(pack.subclasses),
  };
};

/** A background raises three abilities, or none. */
const canSave = (editing: Editing) =>
  editing.draft.name.trim().length > 0 &&
  (editing.kind !== "backgrounds" ||
    editing.draft.abilities.length === 0 ||
    editing.draft.abilities.length === 3);

const EntryForm = ({
  editing,
  change,
}: {
  editing: Editing;
  change: (editing: Editing) => void;
}) => {
  switch (editing.kind) {
    case "species": {
      return (
        <SpeciesForm
          draft={editing.draft}
          change={(draft) => change({ draft, kind: "species" })}
        />
      );
    }

    case "backgrounds": {
      return (
        <BackgroundForm
          draft={editing.draft}
          change={(draft) => change({ draft, kind: "backgrounds" })}
        />
      );
    }

    case "spells": {
      return (
        <SpellForm
          draft={editing.draft}
          change={(draft) => change({ draft, kind: "spells" })}
        />
      );
    }

    default: {
      return (
        <SubclassForm
          draft={editing.draft}
          change={(draft) => change({ draft, kind: "subclasses" })}
        />
      );
    }
  }
};

/** The entries of one kind, as `pack` holds them, for the editor. */
const entriesOf = (pack: OwnPack, kind: OwnKind): Editing[] => {
  if (kind === "species") {
    return pack.species.map((draft) => ({ draft, kind }));
  }

  if (kind === "backgrounds") {
    return pack.backgrounds.map((draft) => ({ draft, kind }));
  }

  return kind === "spells"
    ? pack.spells.map((draft) => ({ draft, kind }))
    : pack.subclasses.map((draft) => ({ draft, kind }));
};

/** One entry in its list: edit it, or delete it after a second click. */
const EntryRow = ({
  entry,
  onEdit,
  onDelete,
}: {
  entry: Editing;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const t = OWN_COPY[useLanguage()];
  const [sure, setSure] = useState(false);

  return (
    <li className="own-entry">
      <span>{entry.draft.name}</span>
      <span className="character-actions">
        {sure ? (
          <>
            <button
              type="button"
              className="pill small"
              onClick={() => setSure(false)}
            >
              {t.cancel}
            </button>
            <button
              type="button"
              className="pill small danger"
              onClick={onDelete}
            >
              {t.delete}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="pill small" onClick={onEdit}>
              {t.edit}
            </button>
            <button
              type="button"
              className="pill small"
              onClick={() => setSure(true)}
            >
              {t.delete}
            </button>
          </>
        )}
      </span>
    </li>
  );
};

/** One kind's entries, or the form for the one being edited. */
const KindSection = ({
  pack,
  kind,
  editing,
  onEdit,
}: {
  pack: OwnPack;
  kind: OwnKind;
  editing: Editing | null;
  onEdit: (editing: Editing | null) => void;
}) => {
  const t = OWN_COPY[useLanguage()];
  const entries = entriesOf(pack, kind);

  if (editing?.kind === kind) {
    const save = () => {
      if (saveOwnPack(withEntry(pack, editing))) {
        onEdit(null);
      }
    };

    return (
      <Window name={`${kind}.txt`} className="own-kind">
        <form
          className="own-form"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <h2>{t.kinds[kind]}</h2>
          <EntryForm editing={editing} change={onEdit} />
          <div className="character-actions">
            <button
              type="submit"
              className="pill primary"
              disabled={!canSave(editing)}
            >
              {t.save}
            </button>
            <button type="button" className="pill" onClick={() => onEdit(null)}>
              {t.cancel}
            </button>
          </div>
          {canSave(editing) ? null : <p className="hint">{t.saveHint}</p>}
        </form>
      </Window>
    );
  }

  return (
    <Window name={`${kind}.txt`} className="own-kind">
      <h2>{t.kinds[kind]}</h2>
      {entries.length === 0 ? (
        <p className="hint">{t.empty}</p>
      ) : (
        <ul className="own-entries">
          {entries.map((entry) => (
            <EntryRow
              key={entry.draft.id}
              entry={entry}
              onEdit={() => onEdit(entry)}
              onDelete={() => saveOwnPack(withoutEntry(pack, entry.draft.id))}
            />
          ))}
        </ul>
      )}
      {entries.length < MAX_ENTRIES ? (
        <button
          type="button"
          className="pill small"
          disabled={editing !== null}
          onClick={() => onEdit(blankOf(kind))}
        >
          {t.add[kind]}
        </button>
      ) : null}
    </Window>
  );
};

/** The pack's name, saved as it is typed once it has one. */
const PackName = ({ pack }: { pack: OwnPack }) => {
  const t = OWN_COPY[useLanguage()];
  const [name, setName] = useState(pack.name);

  return (
    <label className="field">
      {t.packName}
      <input
        className="text"
        maxLength={60}
        value={name}
        onChange={(event) => {
          setName(event.target.value);

          if (event.target.value.trim()) {
            saveOwnPack({ ...pack, name: event.target.value.trim() });
          }
        }}
      />
    </label>
  );
};

/**
 * One of the player's own packs: its name, and its species, backgrounds,
 * spells and subclasses, each added or changed in a form. Saved in this
 * browser as each entry is.
 */
export const PackEditor = ({ id }: { id: string }) => {
  const language = useLanguage();
  const t = OWN_COPY[language];
  const pack = useOwnPacks().find((entry) => entry.id === id);
  const [editing, setEditing] = useState<Editing | null>(null);

  return (
    <div className="page dotted">
      <Topbar page="pack" pack={pack ? { id, name: pack.name } : undefined}>
        {pack ? (
          <button
            type="button"
            className="pill small"
            onClick={() => downloadPack(pack)}
          >
            {COPY[language].exportJson}
          </button>
        ) : null}
      </Topbar>
      <main className="landing cm-home own-editor">
        {pack ? (
          <>
            <Window name="pack.txt" className="hub-hello">
              <PackName pack={pack} />
              <p className="hint">{t.typedOnce}</p>
            </Window>
            {OWN_KINDS.map((kind) => (
              <KindSection
                key={kind}
                pack={pack}
                kind={kind}
                editing={editing}
                onEdit={setEditing}
              />
            ))}
          </>
        ) : (
          <p className="lead center">
            {t.notFound}{" "}
            <a href={CHARACTER_HOME} onClick={linkTo(CHARACTER_HOME)}>
              {t.myPacks}
            </a>
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};
