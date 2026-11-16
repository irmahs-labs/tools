import { useState } from "react";

import { Window } from "../../../components/window";
import { useCopy, useLanguage } from "../../../lib/language";
import { linkTo, navigate } from "../../../router";
import { newCharacter } from "../lib/character";
import { backgroundOf, classOf, speciesOf } from "../lib/rules";
import { deleteCharacter, saveCharacter, useCharacters } from "../lib/storage";
import { characterPath, sheetPath } from "../paths";
import { COPY } from "./copy";
import { Topbar } from "./topbar";

/** Starts a new character, saved at once, and opens it. */
const startCharacter = () => {
  const character = newCharacter();

  saveCharacter(character);
  navigate(characterPath(character.id));
};

/** Character Maker's own page: what it does, a way to start, and the characters made in this browser. */
export const Home = () => {
  const language = useLanguage();
  const t = useCopy(COPY);
  const characters = useCharacters();
  // A delete asks twice: the first press arms it
  const [armed, setArmed] = useState<string | null>(null);

  return (
    <div className="page dotted">
      <Topbar />
      <main className="landing cm-home">
        <Window name="hello.txt" className="hub-hello">
          <p className="badge">{t.compatible}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-lead">{t.heroLead}</p>
          <button
            type="button"
            className="pill primary big"
            onClick={startCharacter}
          >
            {t.make}
          </button>
        </Window>

        {characters.length === 0 ? (
          <p className="lead center">{t.empty}</p>
        ) : (
          <ul className="character-list">
            {characters.map((character) => (
              <li key={character.id}>
                <Window
                  name={`${(character.name.trim() || "character").toLowerCase().replaceAll(/[^\p{L}\p{N}]+/gu, "-")}.txt`}
                >
                  <h2 className="character-name">
                    {character.name.trim() || t.untitled}
                  </h2>
                  <p className="hint">
                    {[
                      classOf(character)?.name[language],
                      speciesOf(character)?.name[language],
                      backgroundOf(character)?.name[language],
                    ]
                      .filter(Boolean)
                      .join(" · ") || t.startHere}
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
                      onClick={() => {
                        if (armed === character.id) {
                          deleteCharacter(character.id);
                          setArmed(null);
                        } else {
                          setArmed(character.id);
                        }
                      }}
                    >
                      {armed === character.id ? t.deleteSure : t.delete}
                    </button>
                  </div>
                </Window>
              </li>
            ))}
          </ul>
        )}

        <p className="hint center">{t.savedHere}</p>
        <p className="credit">{t.credit}</p>
      </main>
      <footer className="footer">
        {t.more} <a href="https://irmahs.dev">irmahs.dev</a>
      </footer>
    </div>
  );
};
