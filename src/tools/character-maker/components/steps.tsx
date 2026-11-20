import { useLanguage } from "../../../lib/language";
import { MAX_NAME, MAX_NOTES } from "../lib/character";
import type { Character } from "../lib/character";
import {
  ARRAY_VALUES,
  assignArrayScore,
  setBackground,
  setClass,
  setScoreMethod,
  setSpecies,
  toggleIn,
} from "../lib/edits";
import { useOwnPacks } from "../lib/own-packs";
import { allPacks } from "../lib/packs";
import {
  backgroundOf,
  boostsOf,
  cantripCount,
  classOf,
  finalScores,
  formatBonus,
  initiateListOf,
  knownLanguages,
  languageCount,
  masterableWeapons,
  optionsFor,
  originSkills,
  pointsSpent,
  preparedCount,
  proficientSkills,
  rollScore,
  speciesCantrips,
  speciesOf,
  spellById,
  spellCount,
  spellsOn,
  subclassesFor,
} from "../lib/rules";
import type { FeatSource } from "../lib/rules";
import type { ClassInfo } from "../lib/srd/classes";
import {
  ABILITIES,
  ABILITY_NAMES,
  ABILITY_SHORT,
  ALIGNMENTS,
  ALIGNMENT_NAMES,
  LANGUAGE_NAMES,
  POINTS,
  POINT_COSTS,
  SKILLS,
  SKILL_INFO,
  modifier,
} from "../lib/srd/core";
import type { Ability, Language as Tongue, Skill } from "../lib/srd/core";
import {
  ARTISAN_TOOLS,
  GAMING_SETS,
  INSTRUMENTS,
  MASTERIES,
  OTHER_TOOLS,
  toolName,
} from "../lib/srd/equipment";
import {
  FEATS,
  INITIATE_LISTS,
  ORIGIN_FEATS,
  SIZE_NAMES,
} from "../lib/srd/origins";
import type { InitiateList, OriginFeat, Species } from "../lib/srd/origins";
import { distance } from "../lib/words";
import { Choices, Left } from "./choices";
import { COPY } from "./copy";

/** What every step is given: the character, and a way to change it. */
export interface StepProps {
  character: Character;
  update: (change: (c: Character) => Character) => void;
}

/** A package as listed: what's in it and its gold, or only gold, or no gold at all. */
const packageText = (
  pack: { text: { en: string; fr: string }; gold: number },
  t: (typeof COPY)["en"],
  language: "en" | "fr"
) => {
  if (!pack.text[language]) {
    return t.goldOnly(pack.gold);
  }

  return pack.gold > 0
    ? `${pack.text[language]}, ${t.gold(pack.gold)}`
    : pack.text[language];
};

/** A d6, for rolling scores. */
const rollDie = () => 1 + Math.floor(Math.random() * 6);

const CASTING_ABILITIES: readonly Ability[] = ["int", "wis", "cha"];

const LIST_NAMES: Record<InitiateList, { en: string; fr: string }> = {
  cleric: { en: "Cleric", fr: "Clerc" },
  druid: { en: "Druid", fr: "Druide" },
  wizard: { en: "Wizard", fr: "Magicien" },
};

// ── Class ──

/** The rule packs this character is made from: one or more, mixed freely. */
const PackPicker = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];

  // The player's own packs are offered too, as they are saved
  useOwnPacks();

  return (
    <fieldset className="panel">
      <legend>{t.packs}</legend>
      <Choices
        legend={<span className="visually-hidden">{t.packs}</span>}
        hint={t.packsHint}
        wide
        options={allPacks().map((pack) => ({
          // At least one: the last one picked stays
          disabled:
            character.packs.length === 1 && character.packs.includes(pack.id),
          id: pack.id,
          label: pack.name[language],
        }))}
        chosen={character.packs}
        onPick={(id) =>
          update((c) => ({
            ...c,
            packs: c.packs.includes(id)
              ? c.packs.filter((entry) => entry !== id)
              : [...c.packs, id],
          }))
        }
      />
    </fieldset>
  );
};

export const ClassStep = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const info = classOf(character);

  return (
    <>
      <PackPicker character={character} update={update} />
      <fieldset className="panel">
        <legend>{t.class}</legend>
        <Choices
          legend={<span className="visually-hidden">{t.class}</span>}
          options={optionsFor(character).classes.map((entry) => ({
            detail: `d${entry.hitDie} · ${entry.primary.map((ability) => ABILITY_SHORT[ability][language]).join(" / ")}`,
            id: entry.id,
            label: entry.name[language],
          }))}
          chosen={character.classId ? [character.classId] : []}
          onPick={(id) => update((c) => setClass(c, id))}
        />
      </fieldset>

      {info ? (
        <fieldset className="panel">
          <legend>{t.subclass}</legend>
          <Choices
            legend={t.subclassPick}
            hint={t.subclassHint}
            wide
            options={subclassesFor(character).map((entry) => ({
              detail: entry.features
                .map((feature) => feature.name[language])
                .join(" · "),
              id: entry.id,
              label: entry.name[language],
            }))}
            chosen={character.subclass ? [character.subclass] : []}
            onPick={(id) => update((c) => ({ ...c, subclass: id }))}
          />
        </fieldset>
      ) : null}

      {info?.order ? (
        <fieldset className="panel">
          <legend>{info.order.label[language]}</legend>
          <Choices
            legend={t.order}
            wide
            options={info.order.options.map((option) => ({
              detail: option.text[language],
              id: option.id,
              label: option.name[language],
            }))}
            chosen={character.order ? [character.order] : []}
            onPick={(id) => update((c) => ({ ...c, cantrips: [], order: id }))}
          />
        </fieldset>
      ) : null}

      {info ? (
        <ClassSummary info={info} />
      ) : (
        <p className="hint">{t.startHere}</p>
      )}
    </>
  );
};

const ClassSummary = ({ info }: { info: ClassInfo }) => {
  const language = useLanguage();
  const t = COPY[language];

  return (
    <fieldset className="panel">
      <legend>{info.name[language]}</legend>
      <p className="lead">
        <strong>
          {t.saves}
          {t.colon}
        </strong>{" "}
        {info.saves
          .map((ability) => ABILITY_NAMES[ability][language])
          .join(", ")}{" "}
        ·{" "}
        <strong>
          {t.armor}
          {t.colon}
        </strong>{" "}
        {info.armorText[language]} ·{" "}
        <strong>
          {t.weapons}
          {t.colon}
        </strong>{" "}
        {info.weapons[language]}
      </p>
      <ul className="feature-list">
        {info.features.map((feature) => (
          <li key={feature.name.en}>
            <strong>{feature.name[language]}.</strong> {feature.text[language]}
          </li>
        ))}
      </ul>
    </fieldset>
  );
};

// ── Origin: background, species, feats, languages ──

const FeatPicker = ({
  character,
  update,
  source,
  feat,
}: StepProps & { source: FeatSource; feat: OriginFeat }) => {
  const language = useLanguage();
  const t = COPY[language];
  const picks = character.feats[source];

  const setPicks = (change: (p: typeof picks) => typeof picks) =>
    update((c) => ({
      ...c,
      feats: { ...c.feats, [source]: change(c.feats[source]) },
    }));

  if (feat === "skilled") {
    const taken = new Set<string>(
      [...originSkills(character)].filter(
        (skill) => !picks.skilled.includes(skill)
      )
    );

    const tools = [
      ...ARTISAN_TOOLS,
      ...INSTRUMENTS,
      ...GAMING_SETS,
      ...OTHER_TOOLS,
    ];

    return (
      <Choices
        legend={
          <>
            {FEATS.skilled.name[language]}
            {t.colon}
            {t.skilledPick}{" "}
            <Left count={3 - picks.skilled.length} words={t.left} />
          </>
        }
        options={[
          ...SKILLS.map((skill) => ({
            disabled: picks.skilled.length >= 3 || taken.has(skill),
            id: skill,
            label: SKILL_INFO[skill].name[language],
          })),
          ...tools.map((tool) => ({
            disabled: picks.skilled.length >= 3,
            id: tool.id,
            label: tool.name[language],
          })),
        ]}
        chosen={picks.skilled}
        onPick={(id) =>
          setPicks((p) => ({ ...p, skilled: toggleIn(p.skilled, id, 3) }))
        }
      />
    );
  }

  if (feat !== "magic-initiate") {
    return null;
  }

  const list = initiateListOf(character, source);
  const { initiate } = picks;

  return (
    <div className="stack tight">
      <p className="lead">
        <strong>{FEATS["magic-initiate"].name[language]}</strong>
        {list ? ` · ${LIST_NAMES[list][language]}` : ""}
      </p>
      {source === "species" ? (
        <Choices
          legend={t.list}
          // Magic Initiate again must draw on another list than the background's
          options={INITIATE_LISTS.map((id) => ({
            disabled: id === initiateListOf(character, "background"),
            id,
            label: LIST_NAMES[id][language],
          }))}
          chosen={initiate.list ? [initiate.list] : []}
          onPick={(id) =>
            setPicks((p) => ({
              ...p,
              initiate: { ...p.initiate, cantrips: [], list: id, spell: null },
            }))
          }
        />
      ) : null}
      <Choices
        legend={t.castingAbility}
        options={CASTING_ABILITIES.map((ability) => ({
          id: ability,
          label: ABILITY_NAMES[ability][language],
        }))}
        chosen={initiate.ability ? [initiate.ability] : []}
        onPick={(id) =>
          setPicks((p) => ({ ...p, initiate: { ...p.initiate, ability: id } }))
        }
      />
      {list ? (
        <>
          <Choices
            legend={
              <>
                {t.cantrips}{" "}
                <Left count={2 - initiate.cantrips.length} words={t.left} />
              </>
            }
            options={spellsOn(character, list, 0).map((spell) => ({
              disabled: initiate.cantrips.length >= 2,
              id: spell.id,
              label: spell.name[language],
            }))}
            chosen={initiate.cantrips}
            onPick={(id) =>
              setPicks((p) => ({
                ...p,
                initiate: {
                  ...p.initiate,
                  cantrips: toggleIn(p.initiate.cantrips, id, 2),
                },
              }))
            }
          />
          <Choices
            legend={language === "fr" ? "Sort du 1er niveau" : "Level 1 spell"}
            options={spellsOn(character, list, 1).map((spell) => ({
              id: spell.id,
              label: spell.name[language],
            }))}
            chosen={initiate.spell ? [initiate.spell] : []}
            onPick={(id) =>
              setPicks((p) => ({
                ...p,
                initiate: { ...p.initiate, spell: id },
              }))
            }
          />
        </>
      ) : null}
    </div>
  );
};

/** The background's increases (SRD 5.2.1): +2 and +1, or +1 to all three of its abilities. */
const BoostPicker = ({
  abilities,
  character,
  update,
}: StepProps & { abilities: readonly Ability[] }) => {
  const language = useLanguage();
  const t = COPY[language];

  return (
    <>
      <fieldset className="segmented">
        <legend className="visually-hidden">{t.boost}</legend>
        {(["2-1", "1-1-1"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={character.boost.mode === mode}
            onClick={() =>
              update((c) => ({
                ...c,
                boost: { mode, plus1: null, plus2: null },
              }))
            }
          >
            {mode === "2-1" ? t.boostTwo : t.boostOne}
          </button>
        ))}
      </fieldset>
      {character.boost.mode === "2-1" ? (
        <div className="two-up">
          <Choices
            legend="+2"
            options={abilities.map((ability) => ({
              id: ability,
              label: ABILITY_NAMES[ability][language],
            }))}
            chosen={character.boost.plus2 ? [character.boost.plus2] : []}
            onPick={(id) =>
              update((c) => ({
                ...c,
                boost: {
                  ...c.boost,
                  plus1: c.boost.plus1 === id ? null : c.boost.plus1,
                  plus2: id,
                },
              }))
            }
          />
          <Choices
            legend="+1"
            options={abilities.map((ability) => ({
              disabled: ability === character.boost.plus2,
              id: ability,
              label: ABILITY_NAMES[ability][language],
            }))}
            chosen={character.boost.plus1 ? [character.boost.plus1] : []}
            onPick={(id) =>
              update((c) => ({ ...c, boost: { ...c.boost, plus1: id } }))
            }
          />
        </div>
      ) : null}
    </>
  );
};

const BackgroundPanel = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const background = backgroundOf(character);

  return (
    <fieldset className="panel">
      <legend>{t.background}</legend>
      <Choices
        legend={<span className="visually-hidden">{t.background}</span>}
        options={optionsFor(character).backgrounds.map((entry) => ({
          detail:
            entry.abilities && entry.feat
              ? `${entry.abilities.map((ability) => ABILITY_SHORT[ability][language]).join(", ")} · ${FEATS[entry.feat].name[language]}`
              : entry.skills
                  .map((skill) => SKILL_INFO[skill].name[language])
                  .join(", "),
          id: entry.id,
          label: entry.name[language],
        }))}
        chosen={character.backgroundId ? [character.backgroundId] : []}
        onPick={(id) => update((c) => setBackground(c, id))}
      />
      {background ? (
        <>
          <p className="lead">
            <strong>
              {t.skills}
              {t.colon}
            </strong>{" "}
            {background.skills
              .map((skill) => SKILL_INFO[skill].name[language])
              .join(", ")}
            {background.feat ? (
              <>
                {" "}
                ·{" "}
                <strong>
                  {t.feat}
                  {t.colon}
                </strong>{" "}
                {FEATS[background.feat].name[language]}
              </>
            ) : null}
          </p>
          {background.abilities ? (
            <BoostPicker
              abilities={background.abilities}
              character={character}
              update={update}
            />
          ) : null}
          {background.tool === "gaming-set" ? (
            <Choices
              legend={t.gamingSet}
              options={GAMING_SETS.map((set) => ({
                id: set.id,
                label: set.name[language],
              }))}
              chosen={
                character.backgroundTool ? [character.backgroundTool] : []
              }
              onPick={(id) => update((c) => ({ ...c, backgroundTool: id }))}
            />
          ) : null}
          {background.feat ? (
            <FeatPicker
              character={character}
              update={update}
              source="background"
              feat={background.feat}
            />
          ) : null}
        </>
      ) : null}
    </fieldset>
  );
};

/** The skills a species lets the player pick: one, or (a Half-Elf) two. */
const SpeciesSkills = ({
  character,
  update,
  choice,
  taken,
}: StepProps & {
  choice: {
    label: { en: string; fr: string };
    from: readonly Skill[];
    count?: number;
  };
  taken: ReadonlySet<Skill>;
}) => {
  const language = useLanguage();
  const t = COPY[language];
  const count = choice.count ?? 1;
  const picked = character.speciesSkills;

  return (
    <Choices
      legend={
        <>
          {choice.label[language]}{" "}
          <Left count={count - picked.length} words={t.left} />
        </>
      }
      options={choice.from.map((skill) => ({
        disabled:
          (taken.has(skill) || picked.length >= count) &&
          !picked.includes(skill),
        id: skill,
        label: SKILL_INFO[skill].name[language],
      }))}
      chosen={picked}
      onPick={(id) =>
        update((c) => ({
          ...c,
          // One to pick: a new one takes the old one's place
          speciesSkills:
            count === 1 ? [id] : toggleIn(c.speciesSkills, id, count),
        }))
      }
    />
  );
};

/** What a species lets the player pick: +1s, skills, a tool, a cantrip. */
const SpeciesPicks = ({
  character,
  update,
  species,
  taken,
}: StepProps & { species: Species; taken: ReadonlySet<Skill> }) => {
  const language = useLanguage();
  const t = COPY[language];

  return (
    <>
      {species.boostChoice ? (
        <Choices
          legend={
            <>
              {t.boostPick(species.boostChoice.count)}{" "}
              <Left
                count={
                  species.boostChoice.count - character.speciesBoosts.length
                }
                words={t.left}
              />
            </>
          }
          options={ABILITIES.filter(
            (ability) => !species.boostChoice?.except.includes(ability)
          ).map((ability) => ({
            id: ability,
            label: ABILITY_NAMES[ability][language],
          }))}
          chosen={character.speciesBoosts}
          onPick={(id) =>
            update((c) => ({
              ...c,
              speciesBoosts: toggleIn(
                c.speciesBoosts,
                id,
                species.boostChoice?.count ?? 0
              ),
            }))
          }
        />
      ) : null}
      {species.skillChoice ? (
        <SpeciesSkills
          character={character}
          update={update}
          choice={species.skillChoice}
          taken={taken}
        />
      ) : null}
      {species.toolChoice ? (
        <Choices
          legend={species.toolChoice.label[language]}
          options={species.toolChoice.from.map((id) => ({
            id,
            label: toolName(id)[language],
          }))}
          chosen={character.speciesTool ? [character.speciesTool] : []}
          onPick={(id) => update((c) => ({ ...c, speciesTool: id }))}
        />
      ) : null}
      {species.cantripChoice ? (
        <Choices
          legend={species.cantripChoice.label[language]}
          options={spellsOn(character, species.cantripChoice.list, 0).map(
            (spell) => ({
              disabled: character.cantrips.includes(spell.id),
              id: spell.id,
              label: spell.name[language],
            })
          )}
          chosen={character.speciesCantrip ? [character.speciesCantrip] : []}
          onPick={(id) => update((c) => ({ ...c, speciesCantrip: id }))}
        />
      ) : null}
    </>
  );
};

const SpeciesPanel = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const species = speciesOf(character);
  const taken = proficientSkills(character);

  return (
    <fieldset className="panel">
      <legend>{t.species}</legend>
      <Choices
        legend={<span className="visually-hidden">{t.species}</span>}
        options={optionsFor(character).species.map((entry) => ({
          detail: `${entry.sizes.map((size) => SIZE_NAMES[size][language]).join(" / ")} · ${distance(entry.speed)[language]}`,
          id: entry.id,
          label: entry.name[language],
        }))}
        chosen={character.speciesId ? [character.speciesId] : []}
        onPick={(id) => update((c) => setSpecies(c, id))}
      />
      {species ? (
        <ul className="feature-list">
          {species.traits.map((trait) => (
            <li key={trait.name.en}>
              <strong>{trait.name[language]}.</strong> {trait.text[language]}
            </li>
          ))}
        </ul>
      ) : null}
      {species?.variants ? (
        <Choices
          legend={species.variants.label[language]}
          wide
          options={species.variants.options.map((option) => ({
            detail: option.text[language],
            id: option.id,
            label: option.name[language],
          }))}
          chosen={character.variant ? [character.variant] : []}
          onPick={(id) => update((c) => ({ ...c, variant: id }))}
        />
      ) : null}
      {species && species.sizes.length > 1 ? (
        <Choices
          legend={t.size}
          options={species.sizes.map((size) => ({
            id: size,
            label: SIZE_NAMES[size][language],
          }))}
          chosen={character.size ? [character.size] : []}
          onPick={(id) => update((c) => ({ ...c, size: id }))}
        />
      ) : null}
      {species?.castingChoice ? (
        <Choices
          legend={t.castingAbility}
          options={CASTING_ABILITIES.map((ability) => ({
            id: ability,
            label: ABILITY_NAMES[ability][language],
          }))}
          chosen={character.castingAbility ? [character.castingAbility] : []}
          onPick={(id) => update((c) => ({ ...c, castingAbility: id }))}
        />
      ) : null}
      {species ? (
        <SpeciesPicks
          character={character}
          update={update}
          species={species}
          taken={taken}
        />
      ) : null}
      {species?.featChoice ? (
        <>
          <Choices
            legend={t.versatile}
            wide
            options={ORIGIN_FEATS.map((feat) => ({
              detail: FEATS[feat].text[language],
              id: feat,
              label: FEATS[feat].name[language],
            }))}
            chosen={character.speciesFeat ? [character.speciesFeat] : []}
            onPick={(id) =>
              update((c) => ({
                ...c,
                feats: {
                  ...c.feats,
                  species: {
                    initiate: {
                      ability: null,
                      cantrips: [],
                      list: null,
                      spell: null,
                    },
                    skilled: [],
                  },
                },
                speciesFeat: id,
              }))
            }
          />
          {character.speciesFeat ? (
            <FeatPicker
              character={character}
              update={update}
              source="species"
              feat={character.speciesFeat}
            />
          ) : null}
        </>
      ) : null}
    </fieldset>
  );
};

export const OriginStep = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const count = languageCount(character);
  const known = knownLanguages(character);

  return (
    <>
      <BackgroundPanel character={character} update={update} />
      <SpeciesPanel character={character} update={update} />
      <fieldset className="panel">
        <legend>{t.languages}</legend>
        <Choices
          legend={
            <>
              {t.languagesPick(
                known.map((id) => LANGUAGE_NAMES[id][language]).join(", "),
                count
              )}{" "}
              <Left count={count - character.languages.length} words={t.left} />
            </>
          }
          options={optionsFor(character)
            .languages.filter((id) => !known.includes(id))
            .map((id) => ({
              disabled: character.languages.length >= count,
              id,
              label: LANGUAGE_NAMES[id][language],
            }))}
          chosen={character.languages}
          onPick={(id: Tongue) =>
            update((c) => ({
              ...c,
              languages: toggleIn(c.languages, id, count),
            }))
          }
        />
      </fieldset>
    </>
  );
};

// ── Ability scores ──

export const AbilitiesStep = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const { method, base } = character.scores;
  const boosts = boostsOf(character);
  const final = finalScores(character);
  const spent = pointsSpent(base);

  const setScore = (ability: Ability, score: number) =>
    update((c) => ({
      ...c,
      scores: { ...c.scores, base: { ...c.scores.base, [ability]: score } },
    }));

  const roll = () =>
    update((c) => {
      const rolled = { ...c.scores.base };

      for (const ability of ABILITIES) {
        rolled[ability] = rollScore(rollDie);
      }

      return { ...c, scores: { ...c.scores, base: rolled } };
    });

  return (
    <fieldset className="panel">
      <legend>{t.abilities}</legend>
      <fieldset className="segmented">
        <legend className="visually-hidden">{t.method}</legend>
        {(["array", "points", "roll"] as const).map((entry) => (
          <button
            key={entry}
            type="button"
            aria-pressed={method === entry}
            onClick={() => update((c) => setScoreMethod(c, entry))}
          >
            {
              {
                array: t.methodArray,
                points: t.methodPoints,
                roll: t.methodRoll,
              }[entry]
            }
          </button>
        ))}
      </fieldset>
      {method === "points" ? (
        <p className="hint" aria-live="polite">
          {t.pointsLeft(Number.isNaN(spent) ? 0 : POINTS - spent)}
        </p>
      ) : null}
      {method === "roll" ? (
        <button type="button" className="pill small" onClick={roll}>
          {t.reroll}
        </button>
      ) : null}
      <table className="score-table">
        <thead>
          <tr>
            <th scope="col">{t.ability}</th>
            <th scope="col">{t.base}</th>
            <th scope="col">{t.background}</th>
            <th scope="col">{t.total}</th>
            <th scope="col">{t.modifier}</th>
          </tr>
        </thead>
        <tbody>
          {ABILITIES.map((ability) => (
            <tr key={ability}>
              <th scope="row">{ABILITY_NAMES[ability][language]}</th>
              <td>
                {method === "array" ? (
                  <select
                    className="select score-select"
                    aria-label={ABILITY_NAMES[ability][language]}
                    value={base[ability]}
                    onChange={(event) =>
                      update((c) =>
                        assignArrayScore(c, ability, Number(event.target.value))
                      )
                    }
                  >
                    {ARRAY_VALUES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : null}
                {method === "points" ? (
                  <span className="stepper">
                    <button
                      type="button"
                      className="pill small"
                      aria-label={`− ${ABILITY_NAMES[ability][language]}`}
                      disabled={base[ability] <= 8}
                      onClick={() => setScore(ability, base[ability] - 1)}
                    >
                      −
                    </button>
                    <span className="stepper-value">{base[ability]}</span>
                    <button
                      type="button"
                      className="pill small"
                      aria-label={`+ ${ABILITY_NAMES[ability][language]}`}
                      disabled={
                        base[ability] >= 15 ||
                        spent +
                          (POINT_COSTS.get(base[ability] + 1) ?? 99) -
                          (POINT_COSTS.get(base[ability]) ?? 0) >
                          POINTS
                      }
                      onClick={() => setScore(ability, base[ability] + 1)}
                    >
                      +
                    </button>
                  </span>
                ) : null}
                {method === "roll" ? (
                  <input
                    className="text score-input"
                    type="number"
                    min={3}
                    max={18}
                    aria-label={ABILITY_NAMES[ability][language]}
                    value={base[ability]}
                    onChange={(event) =>
                      setScore(
                        ability,
                        Math.min(
                          18,
                          Math.max(3, Number(event.target.value) || 3)
                        )
                      )
                    }
                  />
                ) : null}
              </td>
              <td>{boosts[ability] ? `+${boosts[ability]}` : ""}</td>
              <td>{final[ability]}</td>
              <td>{formatBonus(modifier(final[ability]))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </fieldset>
  );
};

// ── Skills, tools, masteries ──

export const ProficienciesStep = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const info = classOf(character);

  if (!info) {
    return <p className="hint">{t.startHere}</p>;
  }

  const fromOrigin = new Set<Skill>(originSkills(character));
  const proficient = proficientSkills(character);

  const tools =
    info.toolChoice?.from === "instrument"
      ? INSTRUMENTS
      : [...ARTISAN_TOOLS, ...INSTRUMENTS];

  return (
    <>
      <fieldset className="panel">
        <legend>{t.skills}</legend>
        <Choices
          legend={
            <>
              {t.pick(info.skills.count)}{" "}
              <Left
                count={info.skills.count - character.classSkills.length}
                words={t.left}
              />
            </>
          }
          options={info.skills.from.map((skill) => ({
            detail: ABILITY_SHORT[SKILL_INFO[skill].ability][language],
            disabled:
              fromOrigin.has(skill) ||
              character.classSkills.length >= info.skills.count,
            id: skill,
            label: SKILL_INFO[skill].name[language],
          }))}
          chosen={[...character.classSkills, ...fromOrigin]}
          onPick={(id) =>
            update((c) => ({
              ...c,
              classSkills: toggleIn(c.classSkills, id, info.skills.count),
              expertise: c.expertise.filter((skill) => skill !== id),
            }))
          }
        />
        {info.expertise ? (
          <Choices
            legend={
              <>
                {t.expertise}
                {t.colon}
                {t.pick(info.expertise)}{" "}
                <Left
                  count={info.expertise - character.expertise.length}
                  words={t.left}
                />
              </>
            }
            options={[...proficient].map((skill) => ({
              disabled: character.expertise.length >= (info.expertise ?? 0),
              id: skill,
              label: SKILL_INFO[skill].name[language],
            }))}
            chosen={character.expertise}
            onPick={(id) =>
              update((c) => ({
                ...c,
                expertise: toggleIn(c.expertise, id, info.expertise ?? 0),
              }))
            }
          />
        ) : null}
      </fieldset>

      {info.toolChoice ? (
        <fieldset className="panel">
          <legend>{t.tools}</legend>
          <Choices
            legend={
              <>
                {t.toolsPick(info.toolChoice.count)}{" "}
                <Left
                  count={info.toolChoice.count - character.classTools.length}
                  words={t.left}
                />
              </>
            }
            options={tools.map((tool) => ({
              disabled:
                character.classTools.length >= (info.toolChoice?.count ?? 0),
              id: tool.id,
              label: tool.name[language],
            }))}
            chosen={character.classTools}
            onPick={(id) =>
              update((c) => ({
                ...c,
                classTools: toggleIn(
                  c.classTools,
                  id,
                  info.toolChoice?.count ?? 0
                ),
              }))
            }
          />
        </fieldset>
      ) : null}

      {info.weaponMastery ? (
        <fieldset className="panel">
          <legend>{t.weapons}</legend>
          <Choices
            legend={
              <>
                {t.weaponMastery(info.weaponMastery)}{" "}
                <Left
                  count={info.weaponMastery - character.weaponMasteries.length}
                  words={t.left}
                />
              </>
            }
            options={masterableWeapons(character).map((weapon) => ({
              detail: MASTERIES[weapon.mastery][language],
              disabled:
                character.weaponMasteries.length >= (info.weaponMastery ?? 0),
              id: weapon.id,
              label: weapon.name[language],
            }))}
            chosen={character.weaponMasteries}
            onPick={(id) =>
              update((c) => ({
                ...c,
                weaponMasteries: toggleIn(
                  c.weaponMasteries,
                  id,
                  info.weaponMastery ?? 0
                ),
              }))
            }
          />
        </fieldset>
      ) : null}

      {info.fightingStyle ? (
        <fieldset className="panel">
          <legend>{t.fightingStyle}</legend>
          <Choices
            legend={t.order}
            wide
            options={optionsFor(character).fightingStyles.map((style) => ({
              detail: style.text[language],
              id: style.id,
              label: style.name[language],
            }))}
            chosen={character.fightingStyle ? [character.fightingStyle] : []}
            onPick={(id) => update((c) => ({ ...c, fightingStyle: id }))}
          />
        </fieldset>
      ) : null}

      {info.invocations ? (
        <fieldset className="panel">
          <legend>{t.invocation}</legend>
          <Choices
            legend={t.order}
            wide
            options={optionsFor(character).invocations.map((invocation) => ({
              detail: invocation.text[language],
              id: invocation.id,
              label: invocation.name[language],
            }))}
            chosen={character.invocation ? [character.invocation] : []}
            onPick={(id) => update((c) => ({ ...c, invocation: id }))}
          />
        </fieldset>
      ) : null}
    </>
  );
};

// ── Spells ──

export const SpellsStep = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const info = classOf(character);
  const casting = info?.spellcasting;
  const fromSpecies = speciesCantrips(character);

  if (!info || !casting) {
    return (
      <fieldset className="panel">
        <legend>{t.spells}</legend>
        <p className="lead">
          {language === "fr"
            ? "Votre classe ne lance pas de sorts au niveau 1."
            : "Your class doesn’t cast spells at level 1."}
          {fromSpecies.length > 0
            ? ` ${t.cantrips}: ${fromSpecies.map((id) => spellById(id)?.name[language]).join(", ")}.`
            : ""}
        </p>
      </fieldset>
    );
  }

  const cantrips = cantripCount(character);
  const spells = spellCount(character);
  const prepared = preparedCount(character);

  return (
    <fieldset className="panel">
      <legend>{t.spells}</legend>
      {cantrips > 0 ? (
        <Choices
          legend={
            <>
              {t.cantrips}
              {t.colon}
              {t.pick(cantrips)}{" "}
              <Left
                count={cantrips - character.cantrips.length}
                words={t.left}
              />
            </>
          }
          options={spellsOn(character, info.id, 0).map((spell) => ({
            disabled:
              fromSpecies.includes(spell.id) ||
              character.cantrips.length >= cantrips,
            id: spell.id,
            label: spell.name[language],
          }))}
          chosen={character.cantrips}
          onPick={(id) =>
            update((c) => ({
              ...c,
              cantrips: toggleIn(c.cantrips, id, cantrips),
            }))
          }
        />
      ) : null}
      <Choices
        legend={
          <>
            {casting.spellbook ? t.spellbook : t.prepared}: {t.pick(spells)}{" "}
            <Left count={spells - character.spells.length} words={t.left} />
          </>
        }
        options={spellsOn(character, info.id, 1).map((spell) => ({
          detail: spell.ritual ? t.ritual : undefined,
          disabled:
            casting.always?.includes(spell.id) ||
            character.spells.length >= spells,
          id: spell.id,
          label: spell.name[language],
        }))}
        chosen={[...character.spells, ...(casting.always ?? [])]}
        onPick={(id) =>
          update((c) => ({
            ...c,
            prepared: c.prepared.filter((entry) => entry !== id),
            spells: toggleIn(c.spells, id, spells),
          }))
        }
      />
      {prepared > 0 ? (
        <Choices
          legend={
            <>
              {t.prepareFromBook}
              {t.colon}
              {t.pick(prepared)}{" "}
              <Left
                count={prepared - character.prepared.length}
                words={t.left}
              />
            </>
          }
          options={character.spells.map((id) => ({
            disabled: character.prepared.length >= prepared,
            id,
            label: spellById(id)?.name[language] ?? id,
          }))}
          chosen={character.prepared}
          onPick={(id) =>
            update((c) => ({
              ...c,
              prepared: toggleIn(c.prepared, id, prepared),
            }))
          }
        />
      ) : null}
      {casting.always ? (
        <p className="hint">
          {t.always}:{" "}
          {casting.always.map((id) => spellById(id)?.name[language]).join(", ")}
        </p>
      ) : null}
    </fieldset>
  );
};

// ── Equipment ──

export const EquipmentStep = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const info = classOf(character);
  const background = backgroundOf(character);
  const letters = ["A", "B", "C"];

  return (
    <>
      {info ? (
        <fieldset className="panel">
          <legend>{t.classGear}</legend>
          <Choices
            legend={<span className="visually-hidden">{t.classGear}</span>}
            wide
            options={info.packages.map((pack, index) => ({
              detail: packageText(pack, t, language),
              id: String(index),
              label: letters[index] ?? String(index + 1),
            }))}
            chosen={[String(character.classPackage)]}
            onPick={(id) => update((c) => ({ ...c, classPackage: Number(id) }))}
          />
        </fieldset>
      ) : (
        <p className="hint">{t.startHere}</p>
      )}
      {background ? (
        <fieldset className="panel">
          <legend>{t.backgroundGear}</legend>
          <Choices
            legend={<span className="visually-hidden">{t.backgroundGear}</span>}
            wide
            options={[
              {
                detail: packageText(
                  { gold: background.gold, text: background.equipment },
                  t,
                  language
                ),
                id: "a" as const,
                label: "A",
              },
              ...(background.goldInstead
                ? [
                    {
                      detail: t.goldOnly(background.goldInstead),
                      id: "gold" as const,
                      label: "B",
                    },
                  ]
                : []),
            ]}
            chosen={[character.backgroundPackage]}
            onPick={(id) => update((c) => ({ ...c, backgroundPackage: id }))}
          />
        </fieldset>
      ) : null}
    </>
  );
};

// ── Details ──

export const DetailsStep = ({ character, update }: StepProps) => {
  const language = useLanguage();
  const t = COPY[language];

  return (
    <fieldset className="panel">
      <legend>{t.details}</legend>
      <label className="field">
        {t.name}
        <input
          className="text"
          value={character.name}
          maxLength={MAX_NAME}
          placeholder={t.namePlaceholder}
          onChange={(event) =>
            update((c) => ({ ...c, name: event.target.value }))
          }
        />
      </label>
      <Choices
        legend={t.alignment}
        options={ALIGNMENTS.map((id) => ({
          id,
          label: ALIGNMENT_NAMES[id][language],
        }))}
        chosen={character.alignment ? [character.alignment] : []}
        onPick={(id) => update((c) => ({ ...c, alignment: id }))}
      />
      <label className="field">
        {t.notes}
        <textarea
          className="text notes"
          rows={5}
          maxLength={MAX_NOTES}
          value={character.notes}
          onChange={(event) =>
            update((c) => ({ ...c, notes: event.target.value }))
          }
        />
      </label>
    </fieldset>
  );
};

/** Every step's screen, by step. */
export const STEP_SCREENS = {
  abilities: AbilitiesStep,
  class: ClassStep,
  details: DetailsStep,
  equipment: EquipmentStep,
  origin: OriginStep,
  proficiencies: ProficienciesStep,
  spells: SpellsStep,
} as const;
