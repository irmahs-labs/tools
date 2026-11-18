import { useState } from "react";

import { Footer } from "../../../components/footer";
import { Window } from "../../../components/window";
import { useCopy } from "../../../lib/language";
import { linkTo } from "../../../router";
import type { Character } from "../lib/character";
import { STEPS, choicesLeft, isComplete } from "../lib/rules";
import type { Step } from "../lib/rules";
import { saveCharacter, useCharacters } from "../lib/storage";
import { CHARACTER_HOME, sheetPath } from "../paths";
import { COPY } from "./copy";
import { CharacterSheet } from "./sheet";
import { STEP_SCREENS } from "./steps";
import { Topbar } from "./topbar";

/** The steps across the top: each with how many choices it still needs. */
const StepNav = ({
  character,
  step,
  onStep,
}: {
  character: Character;
  step: Step;
  onStep: (step: Step) => void;
}) => {
  const t = useCopy(COPY);
  const left = choicesLeft(character);

  return (
    <nav className="step-nav" aria-label={t.steps.class}>
      <ol>
        {STEPS.map((entry, index) => (
          <li key={entry}>
            <button
              type="button"
              className="step-tab"
              aria-current={entry === step ? "step" : undefined}
              onClick={() => onStep(entry)}
            >
              <span className="step-num" aria-hidden="true">
                {left[entry] === 0 ? "✓" : index + 1}
              </span>
              {t.steps[entry]}
              {left[entry] > 0 ? (
                <span className="visually-hidden">, {t.left(left[entry])}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Making one character: its steps on the left, its sheet on the right,
 * worked out as each choice is made. Every change is saved at once, in
 * this browser.
 */
const Editing = ({ initial }: { initial: Character }) => {
  const t = useCopy(COPY);
  const [character, setCharacter] = useState(initial);
  const [step, setStep] = useState<Step>("class");
  const index = STEPS.indexOf(step);
  const Screen = STEP_SCREENS[step];

  const update = (change: (c: Character) => Character) =>
    setCharacter((current) => {
      const next = change(current);

      saveCharacter(next);

      return next;
    });

  const go = (to: Step) => {
    setStep(to);
    window.scrollTo(0, 0);
  };

  const next = STEPS[index + 1];
  const previous = STEPS[index - 1];

  return (
    <div className="page dotted">
      <Topbar character={character.id} page="edit" />
      <main className="cm">
        <StepNav character={character} step={step} onStep={go} />
        <div className="cm-layout">
          <div className="stack">
            <Screen character={character} update={update} />
            <div className="step-buttons">
              {previous ? (
                <button
                  type="button"
                  className="pill"
                  onClick={() => go(previous)}
                >
                  ← {t.steps[previous]}
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button
                  type="button"
                  className="pill primary"
                  onClick={() => go(next)}
                >
                  {t.steps[next]} →
                </button>
              ) : (
                <a
                  href={sheetPath(character.id)}
                  onClick={linkTo(sheetPath(character.id))}
                  className="pill primary"
                >
                  {t.sheet} →
                </a>
              )}
            </div>
            <p className="hint" aria-live="polite">
              {isComplete(character) ? t.allDone : t.savedHere}
            </p>
          </div>
          <Window name="sheet.html" className="sheet-window">
            <CharacterSheet character={character} />
          </Window>
        </div>
      </main>
      <Footer />
    </div>
  );
};

/** The editor for the character at /character-maker/<id>, or a way back if there is none. */
export const Editor = ({ id }: { id: string }) => {
  const t = useCopy(COPY);
  const character = useCharacters().find((entry) => entry.id === id);

  if (!character) {
    return (
      <div className="page dotted">
        <Topbar page="edit" />
        <main className="landing">
          <p className="lead">{t.empty}</p>
          <a
            href={CHARACTER_HOME}
            onClick={linkTo(CHARACTER_HOME)}
            className="pill"
          >
            {t.back}
          </a>
        </main>
      </div>
    );
  }

  return <Editing key={character.id} initial={character} />;
};
