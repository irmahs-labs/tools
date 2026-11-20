import { useLanguage } from "../../../lib/language";
import { MAX_ENTRY_NAME, MAX_TEXT } from "../lib/own-packs";
import type { OwnTrait } from "../lib/own-packs";
import { Choices } from "./choices";
import { OWN_COPY } from "./own-copy";

/**
 * The inputs the forms for a player's own content are made of: each with
 * its label, and the limits the pack schema checks.
 */

export const TextField = ({
  label,
  value,
  max = MAX_ENTRY_NAME,
  multiline = false,
  onChange,
}: {
  label: string;
  value: string;
  max?: number;
  multiline?: boolean;
  onChange: (value: string) => void;
}) => (
  <label className="field">
    {label}
    {multiline ? (
      <textarea
        className="text notes"
        rows={3}
        maxLength={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ) : (
      <input
        className="text"
        maxLength={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )}
  </label>
);

/** A whole number from `min` to `max`, by `step`. */
export const NumberField = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) => (
  <label className="field">
    {label}
    <input
      className="text number-input"
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => {
        const typed = Math.round(Number(event.target.value));

        onChange(
          Number.isFinite(typed) ? Math.min(max, Math.max(min, typed)) : min
        );
      }}
    />
  </label>
);

export const SelectField = <T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (value: T) => void;
}) => (
  <label className="field">
    {label}
    <select
      className="select"
      value={value}
      onChange={(event) =>
        onChange(
          options.find((option) => option.id === event.target.value)?.id ??
            value
        )
      }
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

/** Toggles where up to `max` of `options` are picked. */
export const PickField = <T extends string>({
  legend,
  hint,
  options,
  chosen,
  max,
  onChange,
}: {
  legend: string;
  hint?: string;
  options: readonly { id: T; label: string }[];
  chosen: readonly T[];
  max: number;
  onChange: (chosen: T[]) => void;
}) => (
  <Choices
    legend={legend}
    hint={hint}
    options={options.map((option) => ({
      ...option,
      disabled: chosen.length >= max,
    }))}
    chosen={chosen}
    onPick={(id) =>
      onChange(
        chosen.includes(id)
          ? chosen.filter((entry) => entry !== id)
          : [...chosen, id]
      )
    }
  />
);

/** A list of traits or features, each a name and what it does. */
export const TraitsField = ({
  legend,
  addLabel,
  traits,
  max,
  onChange,
}: {
  legend: string;
  addLabel: string;
  traits: readonly OwnTrait[];
  max: number;
  onChange: (traits: OwnTrait[]) => void;
}) => {
  const t = OWN_COPY[useLanguage()];

  const change = (index: number, trait: OwnTrait) =>
    onChange(traits.map((entry, at) => (at === index ? trait : entry)));

  return (
    <fieldset className="choices own-traits">
      <legend className="choices-legend">{legend}</legend>
      {traits.map((trait, index) => (
        // The list only grows at its end and shrinks by a button on the row
        // oxlint-disable-next-line react/no-array-index-key -- a trait has no id of its own
        <div key={index} className="own-trait">
          <TextField
            label={t.name}
            value={trait.name}
            onChange={(name) => change(index, { ...trait, name })}
          />
          <TextField
            label={t.text}
            value={trait.text}
            max={MAX_TEXT}
            multiline
            onChange={(text) => change(index, { ...trait, text })}
          />
          <button
            type="button"
            className="pill small"
            onClick={() => onChange(traits.filter((_, at) => at !== index))}
          >
            {t.remove}
          </button>
        </div>
      ))}
      {traits.length < max ? (
        <button
          type="button"
          className="pill small"
          onClick={() => onChange([...traits, { name: "", text: "" }])}
        >
          {addLabel}
        </button>
      ) : null}
    </fieldset>
  );
};
