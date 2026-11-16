import type { ReactNode } from "react";

/** One option in a picker: a pressable toggle, with a second line if it has one. */
export interface Option<T extends string> {
  id: T;
  label: ReactNode;
  detail?: ReactNode;
  disabled?: boolean;
}

/**
 * A row of toggles where one or several are chosen: `chosen` holds the ids
 * pressed. It is a fieldset with its legend, so a screen reader hears what
 * the choice is for; `wide` gives each option a line of its own.
 */
export const Choices = <T extends string>({
  legend,
  hint,
  options,
  chosen,
  onPick,
  wide = false,
}: {
  legend: ReactNode;
  hint?: ReactNode;
  options: readonly Option<T>[];
  chosen: readonly string[];
  onPick: (id: T) => void;
  wide?: boolean;
}) => (
  <fieldset className="choices">
    <legend className="choices-legend">{legend}</legend>
    {hint ? <p className="hint">{hint}</p> : null}
    <div className={wide ? "choice-grid wide" : "choice-grid"}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="toggle choice"
          aria-pressed={chosen.includes(option.id)}
          disabled={option.disabled && !chosen.includes(option.id)}
          onClick={() => onPick(option.id)}
        >
          <span className="choice-label">{option.label}</span>
          {option.detail ? (
            <span className="choice-detail">{option.detail}</span>
          ) : null}
        </button>
      ))}
    </div>
  </fieldset>
);

/** "2 left" on a pill, or nothing once everything is picked. */
export const Left = ({
  count,
  words,
}: {
  count: number;
  words: (n: number) => string;
}) => (count > 0 ? <span className="left-pill">{words(count)}</span> : null);
