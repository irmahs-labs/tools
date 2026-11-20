import { useLanguage } from "../../../lib/language";
import { MAX_EQUIPMENT } from "../lib/own-packs";
import type {
  OwnBackground,
  OwnSpecies,
  OwnSpell,
  OwnSubclass,
} from "../lib/own-packs";
import { allPacks } from "../lib/packs";
import { CLASSES } from "../lib/srd/classes";
import {
  ABILITIES,
  ABILITY_NAMES,
  ALL_LANGUAGES,
  LANGUAGE_NAMES,
  SKILLS,
  SKILL_INFO,
} from "../lib/srd/core";
import {
  ARTISAN_TOOLS,
  GAMING_SETS,
  INSTRUMENTS,
  OTHER_TOOLS,
} from "../lib/srd/equipment";
import { FEATS, INITIATE_LISTS, ORIGIN_FEATS } from "../lib/srd/origins";
import { OWN_COPY } from "./own-copy";
import {
  NumberField,
  PickField,
  SelectField,
  TextField,
  TraitsField,
} from "./pack-fields";

/**
 * The forms for each kind of a player's own content. Each edits a draft
 * the pack editor holds, and saves nothing itself.
 */
interface FormProps<T> {
  draft: T;
  change: (draft: T) => void;
}

const NONE = "none";

const useWords = () => {
  const language = useLanguage();

  return { language, t: OWN_COPY[language] };
};

const useSkillOptions = () => {
  const { language } = useWords();

  return SKILLS.map((id) => ({ id, label: SKILL_INFO[id].name[language] }));
};

/** Every cantrip in the maker's packs and the player's own, each name once. */
const cantripOptions = (language: "en" | "fr") => {
  const seen = new Set<string>();

  return allPacks()
    .flatMap((pack) => pack.content.spells)
    .filter((spell) => {
      if (spell.level !== 0 || seen.has(spell.name.en)) {
        return false;
      }

      seen.add(spell.name.en);

      return true;
    })
    .map((spell) => ({ id: spell.id, label: spell.name[language] }));
};

const ABILITY_STEPS = [0, 1, 2] as const;

/** The 2014 rules' fixed increases: 0, +1 or +2 to each ability. */
const BoostsField = ({ draft, change }: FormProps<OwnSpecies>) => {
  const { language, t } = useWords();

  return (
    <fieldset className="choices">
      <legend className="choices-legend">{t.boosts}</legend>
      <p className="hint">{t.boostsHint}</p>
      <div className="own-boosts">
        {ABILITIES.map((ability) => (
          <SelectField
            key={ability}
            label={ABILITY_NAMES[ability][language]}
            value={String(draft.boosts[ability])}
            options={ABILITY_STEPS.map((step) => ({
              id: String(step),
              label: step === 0 ? "0" : `+${step}`,
            }))}
            onChange={(value) =>
              change({
                ...draft,
                boosts: { ...draft.boosts, [ability]: Number(value) },
              })
            }
          />
        ))}
      </div>
      <NumberField
        label={t.boostChoice}
        value={draft.boostChoice}
        min={0}
        max={3}
        onChange={(boostChoice) => change({ ...draft, boostChoice })}
      />
    </fieldset>
  );
};

const SpeciesSenses = ({ draft, change }: FormProps<OwnSpecies>) => {
  const { language, t } = useWords();

  return (
    <div className="own-row">
      <SelectField
        label={t.size}
        value={draft.size}
        options={[
          { id: "medium", label: t.sizes.medium },
          { id: "small", label: t.sizes.small },
          { id: "either", label: t.sizeEither },
        ]}
        onChange={(size) => change({ ...draft, size })}
      />
      <NumberField
        label={t.speed}
        value={draft.speed}
        min={0}
        max={120}
        step={5}
        onChange={(speed) => change({ ...draft, speed })}
      />
      <NumberField
        label={t.darkvision}
        value={draft.darkvision}
        min={0}
        max={300}
        step={30}
        onChange={(darkvision) => change({ ...draft, darkvision })}
      />
      <NumberField
        label={t.hitPoints}
        value={draft.hitPointsPerLevel}
        min={0}
        max={2}
        onChange={(hitPointsPerLevel) =>
          change({ ...draft, hitPointsPerLevel })
        }
      />
      <SelectField
        label={t.cantrip}
        value={draft.cantrip ?? NONE}
        options={[{ id: NONE, label: t.none }, ...cantripOptions(language)]}
        onChange={(cantrip) =>
          change({ ...draft, cantrip: cantrip === NONE ? null : cantrip })
        }
      />
    </div>
  );
};

const SpeciesProficiencies = ({ draft, change }: FormProps<OwnSpecies>) => {
  const { language, t } = useWords();
  const skills = useSkillOptions();

  return (
    <>
      <PickField
        legend={t.skills}
        options={skills}
        chosen={draft.skills}
        max={4}
        onChange={(picked) => change({ ...draft, skills: picked })}
      />
      <NumberField
        label={t.skillChoice}
        value={draft.skillChoice}
        min={0}
        max={4}
        onChange={(skillChoice) => change({ ...draft, skillChoice })}
      />
      <PickField
        legend={t.languages}
        options={ALL_LANGUAGES.map((id) => ({
          id,
          label: LANGUAGE_NAMES[id][language],
        }))}
        chosen={draft.languages}
        max={4}
        onChange={(languages) => change({ ...draft, languages })}
      />
      <NumberField
        label={t.extraLanguages}
        value={draft.extraLanguages}
        min={0}
        max={3}
        onChange={(extraLanguages) => change({ ...draft, extraLanguages })}
      />
    </>
  );
};

export const SpeciesForm = ({ draft, change }: FormProps<OwnSpecies>) => {
  const { t } = useWords();

  return (
    <>
      <TextField
        label={t.name}
        value={draft.name}
        onChange={(name) => change({ ...draft, name })}
      />
      <SpeciesSenses draft={draft} change={change} />
      <BoostsField draft={draft} change={change} />
      <SpeciesProficiencies draft={draft} change={change} />
      <TraitsField
        legend={t.traits}
        addLabel={t.addTrait}
        traits={draft.traits}
        max={12}
        onChange={(traits) => change({ ...draft, traits })}
      />
    </>
  );
};

/** Every tool a background can teach, and a gaming set of their choice. */
const toolOptions = (language: "en" | "fr", anyGamingSet: string) => [
  ...[...ARTISAN_TOOLS, ...INSTRUMENTS, ...GAMING_SETS, ...OTHER_TOOLS].map(
    (tool) => ({ id: tool.id, label: tool.name[language] })
  ),
  { id: "gaming-set", label: anyGamingSet },
];

const className = (id: string, language: "en" | "fr") =>
  CLASSES.find((info) => info.id === id)?.name[language] ?? id;

const BackgroundFeat = ({ draft, change }: FormProps<OwnBackground>) => {
  const { language, t } = useWords();

  return (
    <div className="own-row">
      <SelectField
        label={t.feat}
        value={draft.feat ?? NONE}
        options={[
          { id: NONE, label: t.none },
          ...ORIGIN_FEATS.map((id) => ({
            id,
            label: FEATS[id].name[language],
          })),
        ]}
        onChange={(feat) =>
          change({
            ...draft,
            feat: ORIGIN_FEATS.find((id) => id === feat) ?? null,
          })
        }
      />
      {draft.feat === "magic-initiate" ? (
        <SelectField
          label={t.initiateList}
          value={draft.initiateList ?? "wizard"}
          options={INITIATE_LISTS.map((id) => ({
            id,
            label: className(id, language),
          }))}
          onChange={(initiateList) => change({ ...draft, initiateList })}
        />
      ) : null}
      <SelectField
        label={t.tool}
        value={draft.tool ?? NONE}
        options={[
          { id: NONE, label: t.none },
          ...toolOptions(language, t.anyGamingSet),
        ]}
        onChange={(tool) =>
          change({ ...draft, tool: tool === NONE ? null : tool })
        }
      />
      <NumberField
        label={t.extraLanguages}
        value={draft.languages}
        min={0}
        max={3}
        onChange={(languages) => change({ ...draft, languages })}
      />
    </div>
  );
};

export const BackgroundForm = ({ draft, change }: FormProps<OwnBackground>) => {
  const { language, t } = useWords();
  const skills = useSkillOptions();

  return (
    <>
      <TextField
        label={t.name}
        value={draft.name}
        onChange={(name) => change({ ...draft, name })}
      />
      <PickField
        legend={t.abilities}
        hint={t.abilitiesHint}
        options={ABILITIES.map((id) => ({
          id,
          label: ABILITY_NAMES[id][language],
        }))}
        chosen={draft.abilities}
        max={3}
        onChange={(abilities) => change({ ...draft, abilities })}
      />
      <PickField
        legend={t.skills}
        options={skills}
        chosen={draft.skills}
        max={4}
        onChange={(picked) => change({ ...draft, skills: picked })}
      />
      <BackgroundFeat draft={draft} change={change} />
      <TraitsField
        legend={t.feature}
        addLabel={t.addFeature}
        traits={draft.feature ? [draft.feature] : []}
        max={1}
        onChange={([feature]) => change({ ...draft, feature: feature ?? null })}
      />
      <TextField
        label={t.equipment}
        value={draft.equipment}
        max={MAX_EQUIPMENT}
        multiline
        onChange={(equipment) => change({ ...draft, equipment })}
      />
      <NumberField
        label={t.gold}
        value={draft.gold}
        min={0}
        max={1000}
        onChange={(gold) => change({ ...draft, gold })}
      />
    </>
  );
};

const CLASS_OPTIONS = (language: "en" | "fr") =>
  CLASSES.map((info) => ({ id: info.id, label: info.name[language] }));

export const SpellForm = ({ draft, change }: FormProps<OwnSpell>) => {
  const { language, t } = useWords();

  return (
    <>
      <TextField
        label={t.name}
        value={draft.name}
        onChange={(name) => change({ ...draft, name })}
      />
      <SelectField
        label={t.level}
        value={String(draft.level)}
        options={[
          { id: "0", label: t.cantripLevel },
          { id: "1", label: t.level1 },
        ]}
        onChange={(level) => change({ ...draft, level: level === "1" ? 1 : 0 })}
      />
      <PickField
        legend={t.classes}
        options={CLASS_OPTIONS(language)}
        chosen={draft.classes}
        max={CLASSES.length}
        onChange={(classes) => change({ ...draft, classes })}
      />
      <PickField
        legend={t.ritual}
        options={[{ id: "ritual", label: t.ritual }]}
        chosen={draft.ritual ? ["ritual"] : []}
        max={1}
        onChange={(picked) =>
          change({ ...draft, ritual: picked.includes("ritual") })
        }
      />
    </>
  );
};

export const SubclassForm = ({ draft, change }: FormProps<OwnSubclass>) => {
  const { language, t } = useWords();

  return (
    <>
      <TextField
        label={t.name}
        value={draft.name}
        onChange={(name) => change({ ...draft, name })}
      />
      <SelectField
        label={t.class}
        value={draft.classId}
        options={CLASS_OPTIONS(language)}
        onChange={(classId) => change({ ...draft, classId })}
      />
      <TraitsField
        legend={t.features}
        addLabel={t.addFeature}
        traits={draft.features}
        max={12}
        onChange={(features) => change({ ...draft, features })}
      />
    </>
  );
};
