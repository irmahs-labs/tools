import type { Language } from "../../../lib/language";
import { useLanguage } from "../../../lib/language";
import type { Character } from "../lib/character";
import {
  backgroundOf,
  classOf,
  formatBonus,
  goldOf,
  orderOf,
  originFeats,
  sheetOf,
  speciesCantrips,
  speciesOf,
  spellById,
  toolProficiencies,
  variantOf,
} from "../lib/rules";
import type { Sheet } from "../lib/rules";
import {
  ABILITIES,
  ABILITY_NAMES,
  ABILITY_SHORT,
  ALIGNMENT_NAMES,
  LANGUAGE_NAMES,
  PROFICIENCY_BONUS,
  SKILL_INFO,
} from "../lib/srd/core";
import {
  DAMAGE_TYPES,
  MASTERIES,
  armorById,
  toolName,
} from "../lib/srd/equipment";
import { SIZE_NAMES } from "../lib/srd/origins";
import { distance } from "../lib/words";
import { COPY } from "./copy";
import type { Copy } from "./copy";

interface PartProps {
  character: Character;
  sheet: Sheet;
  language: Language;
  t: Copy;
}

/** Spell names for ids, in the page's language, skipping any unknown. */
const spellNames = (ids: readonly string[], language: Language) =>
  ids.flatMap((id) => {
    const spell = spellById(id);

    return spell ? [spell.name[language]] : [];
  });

/** Words joined by commas, or a dash for none. */
const listed = (words: readonly (string | null | undefined)[], none: string) =>
  words.filter(Boolean).join(", ") || none;

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="sheet-stat">
    <span className="sheet-stat-value">{value}</span>
    <span className="sheet-stat-label">{label}</span>
  </div>
);

const Head = ({ character, language, t }: PartProps) => {
  const info = classOf(character);
  const species = speciesOf(character);
  const variant = variantOf(character);
  const background = backgroundOf(character);

  const speciesName =
    species && variant
      ? `${species.name[language]} (${variant.name[language]})`
      : species?.name[language];

  return (
    <header className="sheet-head">
      <h2 className="sheet-name">{character.name.trim() || t.untitled}</h2>
      <p className="sheet-sub">
        {[
          t.level1,
          info?.name[language],
          speciesName,
          background?.name[language],
          character.alignment
            ? ALIGNMENT_NAMES[character.alignment][language]
            : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </header>
  );
};

/** The skills in the alphabetical order of their names in `language`. */
const inShownOrder = (skills: Sheet["skills"], language: Language) =>
  // oxlint-disable-next-line unicorn/no-array-sort -- sorts a fresh copy; toSorted is past this build's target
  [...skills].sort((a, b) =>
    SKILL_INFO[a.skill].name[language].localeCompare(
      SKILL_INFO[b.skill].name[language],
      language
    )
  );

/** ● proficient, ◆ expertise, ○ neither. */
const mark = (proficient: boolean, expertise = false) => {
  if (expertise) {
    return "◆";
  }

  return proficient ? "●" : "○";
};

const Abilities = ({ sheet, language, t }: PartProps) => (
  <section className="sheet-abilities" aria-label={t.abilities}>
    {ABILITIES.map((ability) => (
      <div key={ability} className="sheet-ability">
        <abbr
          className="sheet-ability-name"
          title={ABILITY_NAMES[ability][language]}
        >
          {ABILITY_SHORT[ability][language]}
        </abbr>
        <span className="sheet-ability-mod">
          {formatBonus(sheet.mods[ability])}
        </span>
        <span className="sheet-ability-score">{sheet.scores[ability]}</span>
        <span className="sheet-ability-save">
          {mark(sheet.saves[ability].proficient)} {t.save}{" "}
          {formatBonus(sheet.saves[ability].bonus)}
        </span>
      </div>
    ))}
  </section>
);

const Stats = ({ character, sheet, language, t }: PartProps) => {
  const size = character.size ?? speciesOf(character)?.sizes[0];

  const worn = sheet.armorWorn.flatMap((id) => {
    const armor = armorById(id);

    return armor ? [armor.name[language]] : [];
  });

  return (
    <>
      <section className="sheet-stats" aria-label={t.ac}>
        <Stat label={t.ac} value={sheet.armorClass} />
        <Stat label={t.hitPoints} value={sheet.hitPoints} />
        <Stat
          label={t.hitDie}
          value={sheet.hitDie ? `1d${sheet.hitDie}` : t.none}
        />
        <Stat label={t.initiative} value={formatBonus(sheet.initiative)} />
        <Stat label={t.speed} value={distance(sheet.speed)[language]} />
        <Stat label={t.proficiency} value={formatBonus(PROFICIENCY_BONUS)} />
        <Stat label={t.passive} value={sheet.passivePerception} />
        <Stat
          label={t.size}
          value={size ? SIZE_NAMES[size][language] : t.none}
        />
      </section>
      <p className="sheet-note">
        {t.armor}
        {t.colon}
        {listed(worn, t.noArmor)}
        {sheet.slowed ? ` · ${t.slowed}` : ""}
      </p>
    </>
  );
};

const Skills = ({ sheet, language, t }: PartProps) => (
  <section className="sheet-box" aria-labelledby="sheet-skills">
    <h3 id="sheet-skills" className="sheet-title">
      {t.skills}
    </h3>
    <ul className="sheet-skills">
      {inShownOrder(sheet.skills, language).map((entry) => (
        <li
          key={entry.skill}
          className={entry.proficient ? "is-proficient" : ""}
        >
          <span aria-hidden="true">
            {mark(entry.proficient, entry.expertise)}
          </span>
          <span className="sheet-skill-name">
            {SKILL_INFO[entry.skill].name[language]}{" "}
            <span className="muted">
              ({ABILITY_SHORT[SKILL_INFO[entry.skill].ability][language]})
            </span>
          </span>
          <span className="sheet-skill-bonus">{formatBonus(entry.bonus)}</span>
        </li>
      ))}
    </ul>
  </section>
);

const Attacks = ({ sheet, language, t }: PartProps) => (
  <section className="sheet-box" aria-labelledby="sheet-attacks">
    <h3 id="sheet-attacks" className="sheet-title">
      {t.attacks}
    </h3>
    <table className="sheet-table">
      <thead>
        <tr>
          <th scope="col">{t.weapons}</th>
          <th scope="col">{t.attack}</th>
          <th scope="col">{t.damage}</th>
        </tr>
      </thead>
      <tbody>
        {sheet.attacks.map((attack) => (
          <tr key={attack.weapon?.id ?? "unarmed"}>
            <th scope="row">
              {attack.weapon ? attack.weapon.name[language] : t.unarmed}
              {attack.mastered && attack.weapon ? (
                <span className="sheet-mastery">
                  {" "}
                  · {MASTERIES[attack.weapon.mastery][language]}
                </span>
              ) : null}
            </th>
            <td>{formatBonus(attack.bonus)}</td>
            <td>
              {attack.damage} {DAMAGE_TYPES[attack.type][language]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

const SpellLine = ({
  label,
  names,
  colon,
}: {
  label: string;
  names: string[];
  colon: string;
}) =>
  names.length > 0 ? (
    <p className="sheet-line">
      <strong>
        {label}
        {colon}
      </strong>
      {names.join(", ")}
    </p>
  ) : null;

const Spells = ({ character, sheet, language, t }: PartProps) => {
  const info = classOf(character);
  const casting = sheet.spellcasting;
  const wizard = Boolean(info?.spellcasting?.spellbook);

  const initiates = originFeats(character).filter(
    ({ feat }) => feat === "magic-initiate"
  );

  const cantrips = spellNames(
    [...character.cantrips, ...speciesCantrips(character)],
    language
  );

  if (!casting && cantrips.length === 0 && initiates.length === 0) {
    return null;
  }

  return (
    <section className="sheet-box" aria-labelledby="sheet-spells">
      <h3 id="sheet-spells" className="sheet-title">
        {t.spellcasting}
      </h3>
      {casting ? (
        <p className="sheet-line">
          {ABILITY_NAMES[casting.ability][language]} · {t.spellDc} {casting.dc}{" "}
          · {t.spellAttack} {formatBonus(casting.attack)} ·{" "}
          {t.slots(casting.slots)}
        </p>
      ) : null}
      <SpellLine colon={t.colon} label={t.cantrips} names={cantrips} />
      <SpellLine
        colon={t.colon}
        label={wizard ? t.spellbook : t.prepared}
        names={spellNames(character.spells, language)}
      />
      {wizard ? (
        <SpellLine
          colon={t.colon}
          label={t.prepared}
          names={spellNames(character.prepared, language)}
        />
      ) : null}
      <SpellLine
        colon={t.colon}
        label={t.always}
        names={spellNames(info?.spellcasting?.always ?? [], language)}
      />
      {initiates.map(({ source }) => {
        const picks = character.feats[source].initiate;

        return (
          <SpellLine
            colon={t.colon}
            key={source}
            label={`${t.initiate}${picks.ability ? ` (${ABILITY_SHORT[picks.ability][language]})` : ""}`}
            names={spellNames(
              [...picks.cantrips, ...(picks.spell ? [picks.spell] : [])],
              language
            )}
          />
        );
      })}
    </section>
  );
};

const Proficiencies = ({ character, language, t }: PartProps) => {
  const info = classOf(character);
  const order = orderOf(character);

  const armor = [
    info?.armorText[language],
    order?.armor ? t.orderArmor[order.armor] : null,
  ];

  const languages = [
    LANGUAGE_NAMES.common[language],
    ...character.languages.map((id) => LANGUAGE_NAMES[id][language]),
    ...(info?.languages?.known ?? []).map((id) => LANGUAGE_NAMES[id][language]),
  ];

  const tools = toolProficiencies(character).map((id) =>
    id === "gaming-set" ? t.gamingSet : toolName(id)[language]
  );

  return (
    <section className="sheet-box" aria-labelledby="sheet-proficiencies">
      <h3 id="sheet-proficiencies" className="sheet-title">
        {t.proficiencies}
      </h3>
      <p className="sheet-line">
        <strong>
          {t.weapons}
          {t.colon}
        </strong>{" "}
        {listed(
          [info?.weapons[language], order?.martial ? t.martialWeapons : null],
          t.none
        )}
      </p>
      <p className="sheet-line">
        <strong>
          {t.armor}
          {t.colon}
        </strong>{" "}
        {listed(armor, t.none)}
      </p>
      <p className="sheet-line">
        <strong>
          {t.tools}
          {t.colon}
        </strong>{" "}
        {listed(tools, t.none)}
      </p>
      <p className="sheet-line">
        <strong>
          {t.languages}
          {t.colon}
        </strong>{" "}
        {languages.join(", ")}
      </p>
    </section>
  );
};

const Equipment = ({ character, language, t }: PartProps) => {
  const info = classOf(character);
  const background = backgroundOf(character);

  const packages = [
    info?.packages[character.classPackage]?.text[language],
    background && character.backgroundPackage === "a"
      ? background.equipment[language]
      : null,
  ].filter((text): text is string => Boolean(text));

  return (
    <section className="sheet-box" aria-labelledby="sheet-equipment">
      <h3 id="sheet-equipment" className="sheet-title">
        {t.equipment}
      </h3>
      {packages.map((text) => (
        <p key={text} className="sheet-line">
          {text}
        </p>
      ))}
      <p className="sheet-line">
        <strong>{t.gold(goldOf(character))}</strong>
      </p>
    </section>
  );
};

const Features = ({ sheet, language, t }: PartProps) => (
  <section className="sheet-box" aria-labelledby="sheet-features">
    <h3 id="sheet-features" className="sheet-title">
      {t.features}
    </h3>
    <ul className="sheet-features">
      {sheet.features.map((feature) => (
        <li key={feature.name.en}>
          <strong>{feature.name[language]}.</strong> {feature.text[language]}
        </li>
      ))}
    </ul>
  </section>
);

/**
 * A level 1 character sheet: everything a player needs at the table, worked
 * out from the character's choices. It is the editor's live preview, and on
 * its own page it prints on one page (the print styles hide the rest).
 */
export const CharacterSheet = ({ character }: { character: Character }) => {
  const language = useLanguage();

  const parts: PartProps = {
    character,
    language,
    sheet: sheetOf(character),
    t: COPY[language],
  };

  return (
    <article className="sheet" lang={language}>
      <Head {...parts} />
      <Abilities {...parts} />
      <Stats {...parts} />
      <div className="sheet-columns">
        <Skills {...parts} />
        <div className="sheet-stack">
          <Attacks {...parts} />
          <Spells {...parts} />
          <Proficiencies {...parts} />
          <Equipment {...parts} />
        </div>
      </div>
      <Features {...parts} />
      {character.notes.trim() ? (
        <section className="sheet-box" aria-labelledby="sheet-notes">
          <h3 id="sheet-notes" className="sheet-title">
            {parts.t.details}
          </h3>
          <p className="sheet-line sheet-notes">{character.notes}</p>
        </section>
      ) : null}
      <footer className="sheet-foot">
        <p>
          {parts.t.createdBy} · {parts.t.compatible}
        </p>
        <p>{parts.t.credit}</p>
      </footer>
    </article>
  );
};
