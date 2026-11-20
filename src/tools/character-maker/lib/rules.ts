import type { Character, FeatPicks } from "./character";
import { allPacks, contentOf } from "./packs";
import type { ClassInfo, FightingStyle, Order } from "./srd/classes";
import {
  ABILITIES,
  EXTRA_LANGUAGES,
  POINT_COSTS,
  POINTS,
  PROFICIENCY_BONUS,
  SCORE_CAP,
  SKILLS,
  SKILL_INFO,
  STANDARD_ARRAY,
  modifier,
} from "./srd/core";
import type { Ability, Language, Skill } from "./srd/core";
import { WEAPONS, armorById, weaponById } from "./srd/equipment";
import type { Weapon } from "./srd/equipment";
import { FEATS } from "./srd/origins";
import type {
  Background,
  InitiateList,
  OriginFeat,
  Species,
  Trait,
  Variant,
} from "./srd/origins";
import type { Spell } from "./srd/spells";
import type { Subclass } from "./srd/subclasses";

/**
 * The rules of "Character Creation" for a level 1 character, as plain
 * functions: what a character's choices add up to on the sheet, and which
 * choices are still to make. What there is to choose from comes from the
 * character's rule packs (packs.ts).
 */

// ── Looking things up ──

/** What the character's packs hold: the classes, species, spells… to choose from. */
export const optionsFor = (c: Character) => contentOf(c.packs);

export const classOf = (c: Character): ClassInfo | null =>
  optionsFor(c).classes.find((entry) => entry.id === c.classId) ?? null;

export const backgroundOf = (c: Character): Background | null =>
  optionsFor(c).backgrounds.find((entry) => entry.id === c.backgroundId) ??
  null;

export const speciesOf = (c: Character): Species | null =>
  optionsFor(c).species.find((entry) => entry.id === c.speciesId) ?? null;

export const variantOf = (c: Character): Variant | null =>
  speciesOf(c)?.variants?.options.find((entry) => entry.id === c.variant) ??
  null;

/** The subclass picked, if it belongs to the class picked. */
export const subclassOf = (c: Character): Subclass | null =>
  optionsFor(c).subclasses.find(
    (entry) => entry.id === c.subclass && entry.classId === c.classId
  ) ?? null;

/** The subclasses the character's class can take. */
export const subclassesFor = (c: Character): Subclass[] =>
  optionsFor(c).subclasses.filter((entry) => entry.classId === c.classId);

/** The Fighting Style picked, for a class that has one. */
export const fightingStyleOf = (c: Character): FightingStyle | null =>
  classOf(c)?.fightingStyle
    ? (optionsFor(c).fightingStyles.find(
        (entry) => entry.id === c.fightingStyle
      ) ?? null)
    : null;

export const orderOf = (c: Character): Order | null =>
  classOf(c)?.order?.options.find((entry) => entry.id === c.order) ?? null;

/** A spell from any pack: a spell's id names it in every pack. */
export const spellById = (id: string): Spell | undefined =>
  allPacks()
    .flatMap((pack) => pack.content.spells)
    .find((spell) => spell.id === id);

/** The cantrips or level 1 spells in the character's packs on a class's (or Magic Initiate's) list. */
export const spellsOn = (
  c: Character,
  list: ClassInfo["id"] | InitiateList,
  level: 0 | 1
) =>
  optionsFor(c).spells.filter(
    (spell) => spell.level === level && spell.classes.includes(list)
  );

// ── Ability scores ──

/** A copy, highest first. */
const byHighest = (numbers: readonly number[]): number[] =>
  // oxlint-disable-next-line unicorn/no-array-sort -- sorts a fresh copy; toSorted is past this build's target
  [...numbers].sort((a, b) => b - a);

/** Points spent on a point-buy set; NaN when a score is outside 8 to 15. */
export const pointsSpent = (base: Record<Ability, number>): number =>
  ABILITIES.reduce(
    (sum, ability) => sum + (POINT_COSTS.get(base[ability]) ?? Number.NaN),
    0
  );

/** Whether the base scores are a whole, fair set for their method. */
export const scoresReady = (c: Character): boolean => {
  const values = ABILITIES.map((ability) => c.scores.base[ability]);

  if (c.scores.method === "array") {
    return byHighest(values).join(",") === STANDARD_ARRAY.join(",");
  }

  if (c.scores.method === "points") {
    // All 27 points spent, none overspent
    return pointsSpent(c.scores.base) === POINTS;
  }

  return values.every((value) => value >= 3 && value <= 18);
};

/** Four d6, the lowest dropped; `roll` gives a die from 1 to 6, for tests. */
export const rollScore = (roll: () => number): number =>
  byHighest([roll(), roll(), roll(), roll()])
    .slice(0, 3)
    .reduce((sum, die) => sum + die, 0);

/** The +1s a species lets the player place that count: allowed ones, no more than it gives. */
export const speciesBoostPicks = (c: Character): Ability[] => {
  const choice = speciesOf(c)?.boostChoice;

  if (!choice) {
    return [];
  }

  return [...new Set(c.speciesBoosts)]
    .filter((ability) => !choice.except.includes(ability))
    .slice(0, choice.count);
};

/** What the background adds, from its three abilities (SRD 5.2.1). */
const backgroundBoosts = (
  c: Character,
  abilities: readonly Ability[],
  boosts: Record<Ability, number>
) => {
  if (c.boost.mode === "1-1-1") {
    for (const ability of abilities) {
      boosts[ability] += 1;
    }

    return;
  }

  if (c.boost.plus2 && abilities.includes(c.boost.plus2)) {
    boosts[c.boost.plus2] += 2;
  }

  if (
    c.boost.plus1 &&
    c.boost.plus1 !== c.boost.plus2 &&
    abilities.includes(c.boost.plus1)
  ) {
    boosts[c.boost.plus1] += 1;
  }
};

/** What the background (SRD 5.2.1) or the species (SRD 5.1) adds to each ability. */
export const boostsOf = (c: Character): Record<Ability, number> => {
  const boosts: Record<Ability, number> = {
    cha: 0,
    con: 0,
    dex: 0,
    int: 0,
    str: 0,
    wis: 0,
  };

  const abilities = backgroundOf(c)?.abilities;

  if (abilities) {
    backgroundBoosts(c, abilities, boosts);
  }

  const species = speciesOf(c);

  for (const ability of ABILITIES) {
    boosts[ability] += species?.boosts?.[ability] ?? 0;
  }

  for (const ability of speciesBoostPicks(c)) {
    boosts[ability] += 1;
  }

  return boosts;
};

/** A value for each ability, worked out by `of`. */
const perAbility = <T>(of: (ability: Ability) => T): Record<Ability, T> => ({
  cha: of("cha"),
  con: of("con"),
  dex: of("dex"),
  int: of("int"),
  str: of("str"),
  wis: of("wis"),
});

export const finalScores = (c: Character): Record<Ability, number> => {
  const boosts = boostsOf(c);

  return perAbility((ability) =>
    Math.min(SCORE_CAP, c.scores.base[ability] + boosts[ability])
  );
};

// ── Origin feats ──

/** Where an Origin feat comes from: the background, or a species that lets you pick one. */
export type FeatSource = "background" | "species";

/** The character's Origin feats: their background's, and the one their species lets them pick. */
export const originFeats = (
  c: Character
): { source: FeatSource; feat: OriginFeat }[] => {
  const feats: { source: FeatSource; feat: OriginFeat }[] = [];
  const background = backgroundOf(c);

  if (background?.feat) {
    feats.push({ feat: background.feat, source: "background" });
  }

  if (speciesOf(c)?.featChoice && c.speciesFeat) {
    feats.push({ feat: c.speciesFeat, source: "species" });
  }

  return feats;
};

/** The list a Magic Initiate draws on: the background's own, or the one picked. */
export const initiateListOf = (
  c: Character,
  source: FeatSource
): InitiateList | null =>
  source === "background"
    ? (backgroundOf(c)?.initiateList ?? null)
    : c.feats.species.initiate.list;

/** A Skilled pick that is a skill, or null when it's a tool. */
const skillNamed = (id: string): Skill | null =>
  SKILLS.find((skill) => skill === id) ?? null;

const skilledSkills = (picks: FeatPicks): Skill[] =>
  picks.skilled.flatMap((id) => {
    const skill = skillNamed(id);

    return skill ? [skill] : [];
  });

const skilledTools = (picks: FeatPicks): string[] =>
  picks.skilled.filter((id) => skillNamed(id) === null);

// ── Proficiencies ──

/** The skills a species lets the player pick that count: on its list, no more than it gives. */
export const speciesSkillPicks = (c: Character): Skill[] => {
  const choice = speciesOf(c)?.skillChoice;

  return choice
    ? [...new Set(c.speciesSkills)]
        .filter((skill) => choice.from.includes(skill))
        .slice(0, choice.count ?? 1)
    : [];
};

/** Skill proficiencies that don't come from the class's own picks. */
export const originSkills = (c: Character): Skill[] => {
  const skills = new Set<Skill>();

  for (const skill of backgroundOf(c)?.skills ?? []) {
    skills.add(skill);
  }

  const species = speciesOf(c);

  for (const skill of species?.skills ?? []) {
    skills.add(skill);
  }

  for (const skill of speciesSkillPicks(c)) {
    skills.add(skill);
  }

  for (const { feat, source } of originFeats(c)) {
    if (feat === "skilled") {
      for (const skill of skilledSkills(c.feats[source])) {
        skills.add(skill);
      }
    }
  }

  return [...skills];
};

export const proficientSkills = (c: Character): Set<Skill> =>
  new Set([...originSkills(c), ...c.classSkills]);

/** Tools the character is proficient with, by id. */
export const toolProficiencies = (c: Character): string[] => {
  const tools = new Set<string>();
  const background = backgroundOf(c);

  if (background?.tool) {
    tools.add(
      background.tool === "gaming-set"
        ? (c.backgroundTool ?? "gaming-set")
        : background.tool
    );
  }

  const species = speciesOf(c);

  for (const tool of species?.tools ?? []) {
    tools.add(tool);
  }

  if (c.speciesTool && species?.toolChoice?.from.includes(c.speciesTool)) {
    tools.add(c.speciesTool);
  }

  for (const tool of classOf(c)?.tools ?? []) {
    tools.add(tool);
  }

  for (const tool of c.classTools) {
    tools.add(tool);
  }

  for (const { feat, source } of originFeats(c)) {
    if (feat === "skilled") {
      for (const tool of skilledTools(c.feats[source])) {
        tools.add(tool);
      }
    }
  }

  return [...tools];
};

/** Whether the character can use a weapon with their Proficiency Bonus. */
export const proficientWith = (c: Character, weapon: Weapon): boolean => {
  const info = classOf(c);

  if (speciesOf(c)?.weapons?.includes(weapon.id)) {
    return true;
  }

  // A class that names its weapons (SRD 5.1's Wizard, Rogue…) knows only those
  if (info?.weaponList) {
    return (
      info.weaponList.includes(weapon.id) ||
      (info.weaponList.includes("simple") && weapon.category === "simple")
    );
  }

  if (weapon.category === "simple") {
    return true;
  }

  if (!info) {
    return false;
  }

  if (orderOf(c)?.martial || info.martial === "all") {
    return true;
  }

  if (info.martial === "light") {
    return Boolean(weapon.light);
  }

  return (
    info.martial === "finesse-or-light" &&
    Boolean(weapon.finesse || weapon.light)
  );
};

/** The weapons whose mastery the character may pick: those they're proficient with, melee only for a Barbarian. */
export const masterableWeapons = (c: Character): Weapon[] =>
  WEAPONS.filter(
    (weapon) =>
      proficientWith(c, weapon) &&
      (!classOf(c)?.masteryMeleeOnly || weapon.kind === "melee")
  );

// ── Equipment ──

/** The weapons and armor the character starts with, by id, from the packages they took. */
export const gearOf = (c: Character): string[] => {
  const info = classOf(c);
  const background = backgroundOf(c);

  return [
    ...(info?.packages[c.classPackage]?.gear ?? []),
    ...(background && c.backgroundPackage === "a" ? background.gear : []),
  ];
};

export const goldOf = (c: Character): number => {
  const info = classOf(c);
  const background = backgroundOf(c);
  const classGold = info?.packages[c.classPackage]?.gold ?? 0;

  if (!background) {
    return classGold;
  }

  return classGold + (c.backgroundPackage === "a" ? background.gold : 50);
};

// ── The sheet ──

export interface Attack {
  weapon: Weapon | null;
  bonus: number;
  /** "1d8+3". */
  damage: string;
  type: Weapon["type"];
  mastered: boolean;
}

export interface SpellcastingSheet {
  ability: Ability;
  dc: number;
  attack: number;
  slots: number;
  pact: boolean;
}

export interface Sheet {
  scores: Record<Ability, number>;
  mods: Record<Ability, number>;
  saves: Record<Ability, { bonus: number; proficient: boolean }>;
  skills: {
    skill: Skill;
    bonus: number;
    proficient: boolean;
    expertise: boolean;
  }[];
  hitPoints: number;
  hitDie: number | null;
  armorClass: number;
  /** What the Armor Class is made of: armor ids, or "unarmored". */
  armorWorn: string[];
  speed: number;
  /** The heavy armor is too heavy for the character's Strength. */
  slowed: boolean;
  initiative: number;
  passivePerception: number;
  attacks: Attack[];
  spellcasting: SpellcastingSheet | null;
  features: Trait[];
}

const signed = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

export const formatBonus = signed;

/** The damage as written: the die and the modifier, "1d8+3", "1d4−1", "1". */
const damageOf = (dice: string, mod: number) =>
  mod === 0 ? dice : `${dice}${mod > 0 ? "+" : "−"}${Math.abs(mod)}`;

const isMonkWeapon = (weapon: Weapon) =>
  weapon.kind === "melee" &&
  (weapon.category === "simple" || Boolean(weapon.light));

const armorClassOf = (c: Character, mods: Record<Ability, number>) => {
  const info = classOf(c);
  const order = orderOf(c);
  const gear = gearOf(c);

  const trained = (category: "light" | "medium" | "heavy" | "shield") =>
    Boolean(info?.armor[category]) ||
    order?.armor === category ||
    (category === "medium" &&
      order?.armor === "heavy" &&
      Boolean(info?.armor.medium));

  const body = gear
    .map((id) => armorById(id))
    .find(
      (armor) => armor && armor.category !== "shield" && trained(armor.category)
    );

  const shield = gear.includes("shield") && trained("shield");
  let ac = 10 + mods.dex;
  const worn: string[] = [];

  if (body) {
    ac = body.ac + Math.min(mods.dex, body.maxDex ?? 0);
    worn.push(body.id);
  } else if (info?.unarmored) {
    ac = 10 + mods.dex + mods[info.unarmored.ability];
  }

  const shieldCounts =
    shield && (!info?.unarmored || info.unarmored.shield || body);

  if (shieldCounts) {
    ac += 2;
    worn.push("shield");
  }

  if (body) {
    ac += fightingStyleOf(c)?.armoredAc ?? 0;
  }

  return { ac, slowedBy: body?.strength ?? 0, worn };
};

const attacksOf = (c: Character, mods: Record<Ability, number>): Attack[] => {
  const ids = [...new Set(gearOf(c))];
  const info = classOf(c);
  const martialArts = info?.martialArtsDie;
  const rangedBonus = fightingStyleOf(c)?.rangedAttack ?? 0;

  const attacks = ids.flatMap((id): Attack[] => {
    const weapon = weaponById(id);

    if (!weapon) {
      return [];
    }

    let mod = weapon.kind === "ranged" ? mods.dex : mods.str;

    if (weapon.finesse || (martialArts && isMonkWeapon(weapon))) {
      mod = Math.max(mods.str, mods.dex);
    }

    const proficient = proficientWith(c, weapon);

    // Martial Arts: a d6 in place of a Monk weapon's smaller die
    const dice =
      martialArts && isMonkWeapon(weapon) && weapon.damage === "1d4"
        ? martialArts
        : weapon.damage;

    return [
      {
        bonus:
          mod +
          (proficient ? PROFICIENCY_BONUS : 0) +
          (weapon.kind === "ranged" ? rangedBonus : 0),
        damage: damageOf(dice, mod),
        mastered: c.weaponMasteries.includes(weapon.id),
        type: weapon.type,
        weapon,
      },
    ];
  });

  // Everyone can make an Unarmed Strike, with their Proficiency Bonus
  const unarmedMod = martialArts ? Math.max(mods.str, mods.dex) : mods.str;

  attacks.push({
    bonus: unarmedMod + PROFICIENCY_BONUS,
    damage: martialArts
      ? damageOf(martialArts, unarmedMod)
      : `${Math.max(0, 1 + mods.str)}`,
    mastered: false,
    type: "bludgeoning",
    weapon: null,
  });

  return attacks;
};

/** Every trait and feature the sheet lists, from species, background feats and class. */
export const featuresOf = (c: Character): Trait[] => {
  const species = speciesOf(c);
  const variant = variantOf(c);
  const info = classOf(c);
  const order = orderOf(c);
  const features: Trait[] = [];

  if (species) {
    features.push(...species.traits);
  }

  if (species?.variants && variant) {
    features.push({
      name: {
        en: `${species.variants.label.en}: ${variant.name.en}`,
        fr: `${species.variants.label.fr} : ${variant.name.fr}`,
      },
      text: variant.text,
    });
  }

  const backgroundTrait = backgroundOf(c)?.trait;

  if (backgroundTrait) {
    features.push(backgroundTrait);
  }

  for (const { feat } of originFeats(c)) {
    features.push(FEATS[feat]);
  }

  if (info) {
    features.push(...info.features);
  }

  const subclass = subclassOf(c);

  if (subclass) {
    features.push(
      ...subclass.features.map((feature) => ({
        name: {
          en: `${subclass.name.en}: ${feature.name.en}`,
          fr: `${subclass.name.fr} : ${feature.name.fr}`,
        },
        text: feature.text,
      }))
    );
  }

  if (info?.order && order) {
    features.push({
      name: {
        en: `${info.order.label.en}: ${order.name.en}`,
        fr: `${info.order.label.fr} : ${order.name.fr}`,
      },
      text: order.text,
    });
  }

  const style = fightingStyleOf(c);

  if (style) {
    features.push(style);
  }

  const invocation = optionsFor(c).invocations.find(
    (entry) => entry.id === c.invocation
  );

  if (info?.invocations && invocation) {
    features.push(invocation);
  }

  return features;
};

export const sheetOf = (c: Character): Sheet => {
  const info = classOf(c);
  const species = speciesOf(c);
  const variant = variantOf(c);
  const order = orderOf(c);
  const scores = finalScores(c);

  const mods = perAbility((ability) => modifier(scores[ability]));

  const saves = perAbility((ability) => {
    const proficient = Boolean(info?.saves.includes(ability));

    return {
      bonus: mods[ability] + (proficient ? PROFICIENCY_BONUS : 0),
      proficient,
    };
  });

  const proficient = proficientSkills(c);
  const orderBonus = order?.checks ? Math.max(1, mods.wis) : 0;

  const skills = SKILLS.map((skill) => {
    const isProficient = proficient.has(skill);

    const expertise =
      Boolean(info?.expertise) && c.expertise.includes(skill) && isProficient;

    return {
      bonus:
        mods[SKILL_INFO[skill].ability] +
        (isProficient ? PROFICIENCY_BONUS : 0) +
        (expertise ? PROFICIENCY_BONUS : 0) +
        (order?.checks?.includes(skill) ? orderBonus : 0),
      expertise,
      proficient: isProficient,
      skill,
    };
  });

  const { ac, slowedBy, worn } = armorClassOf(c, mods);
  const slowed = slowedBy > 0 && scores.str < slowedBy;
  const alert = originFeats(c).some(({ feat }) => feat === "alert");

  const perception =
    skills.find((entry) => entry.skill === "perception")?.bonus ?? mods.wis;

  const casting = info?.spellcasting;

  return {
    armorClass: ac,
    armorWorn: worn,
    attacks: attacksOf(c, mods),
    features: featuresOf(c),
    hitDie: info?.hitDie ?? null,
    hitPoints: Math.max(
      1,
      (info?.hitDie ?? 0) + mods.con + (species?.hitPointsPerLevel ?? 0)
    ),
    initiative: mods.dex + (alert ? PROFICIENCY_BONUS : 0),
    mods,
    passivePerception: 10 + perception,
    saves,
    scores,
    skills,
    slowed,
    speed: (variant?.speed ?? species?.speed ?? 30) - (slowed ? 10 : 0),
    spellcasting: casting
      ? {
          ability: casting.ability,
          attack: mods[casting.ability] + PROFICIENCY_BONUS,
          dc: 8 + mods[casting.ability] + PROFICIENCY_BONUS,
          pact: Boolean(casting.pact),
          slots: casting.slots,
        }
      : null,
  };
};

// ── Spells to pick ──

/** How many class cantrips to pick: the class's, and one more for a Thaumaturge or Magician. */
export const cantripCount = (c: Character): number =>
  (classOf(c)?.spellcasting?.cantrips ?? 0) +
  (orderOf(c)?.extraCantrip ? 1 : 0);

/** How many spells the class prepares: a set number, or (SRD 5.1) the ability's modifier + 1, at least 1. */
const preparedOf = (c: Character): number => {
  const casting = classOf(c)?.spellcasting;

  if (!casting) {
    return 0;
  }

  return casting.preparedFromAbility
    ? Math.max(1, modifier(finalScores(c)[casting.ability]) + 1)
    : casting.prepared;
};

/** How many level 1 spells to pick: prepared ones, or the Wizard's spellbook. */
export const spellCount = (c: Character): number =>
  classOf(c)?.spellcasting?.spellbook ?? preparedOf(c);

/** How many of the spellbook's spells a Wizard prepares. */
export const preparedCount = (c: Character): number =>
  classOf(c)?.spellcasting?.spellbook ? preparedOf(c) : 0;

/** Cantrips the character knows from their species: given, or picked (a High Elf's). */
export const speciesCantrips = (c: Character): string[] => {
  const species = speciesOf(c);
  const choice = species?.cantripChoice;

  const picked =
    choice &&
    c.speciesCantrip &&
    spellsOn(c, choice.list, 0).some((spell) => spell.id === c.speciesCantrip)
      ? [c.speciesCantrip]
      : [];

  return [
    ...(species?.cantrips ?? []),
    ...(variantOf(c)?.cantrips ?? []),
    ...picked,
  ];
};

// ── What's left to choose ──

export const STEPS = [
  "class",
  "origin",
  "abilities",
  "proficiencies",
  "spells",
  "equipment",
  "details",
] as const;

export type Step = (typeof STEPS)[number];

const featPicksLeft = (c: Character, source: FeatSource, feat: OriginFeat) => {
  const picks = c.feats[source];

  if (feat === "skilled") {
    return Math.max(0, 3 - picks.skilled.length);
  }

  if (feat !== "magic-initiate") {
    return 0;
  }

  const { initiate } = picks;
  const list = initiateListOf(c, source);

  return (
    (list ? 0 : 1) +
    (initiate.ability ? 0 : 1) +
    Math.max(0, 2 - initiate.cantrips.length) +
    (initiate.spell ? 0 : 1)
  );
};

/** The languages the character knows without picking: Common, or their species' (SRD 5.1). */
export const knownLanguages = (c: Character): Language[] => [
  ...(speciesOf(c)?.languages?.known ?? ["common"]),
];

/** How many languages besides those the character picks: the species' and background's (SRD 5.1), or two Standard ones (SRD 5.2.1), and the class's. */
export const languageCount = (c: Character): number => {
  const species = speciesOf(c)?.languages;

  const fromOrigin = species
    ? species.extra + (backgroundOf(c)?.languages ?? 0)
    : EXTRA_LANGUAGES;

  return fromOrigin + (classOf(c)?.languages?.extra ?? 0);
};

/** 1 while something is still to choose, 0 once it's chosen. */
const left = (chosen: boolean) => (chosen ? 0 : 1);

const speciesChoicesLeft = (c: Character): number => {
  const species = speciesOf(c);

  if (!species) {
    return 1;
  }

  return (
    (species.variants ? left(Boolean(variantOf(c))) : 0) +
    (species.sizes.length > 1 ? left(Boolean(c.size)) : 0) +
    (species.castingChoice ? left(Boolean(c.castingAbility)) : 0) +
    Math.max(
      0,
      (species.skillChoice?.count ?? (species.skillChoice ? 1 : 0)) -
        speciesSkillPicks(c).length
    ) +
    Math.max(
      0,
      (species.boostChoice?.count ?? 0) - speciesBoostPicks(c).length
    ) +
    (species.toolChoice ? left(Boolean(c.speciesTool)) : 0) +
    (species.cantripChoice
      ? left(speciesCantrips(c).includes(c.speciesCantrip ?? ""))
      : 0) +
    (species.featChoice ? left(Boolean(c.speciesFeat)) : 0)
  );
};

const backgroundChoicesLeft = (c: Character): number => {
  const background = backgroundOf(c);

  if (!background) {
    return 1;
  }

  return (
    (background.tool === "gaming-set" ? left(Boolean(c.backgroundTool)) : 0) +
    (background.abilities && c.boost.mode === "2-1"
      ? left(Boolean(c.boost.plus2)) + left(Boolean(c.boost.plus1))
      : 0)
  );
};

const classChoicesLeft = (c: Character, info: ClassInfo): number =>
  Math.max(0, info.skills.count - c.classSkills.length) +
  Math.max(0, (info.expertise ?? 0) - c.expertise.length) +
  Math.max(0, (info.toolChoice?.count ?? 0) - c.classTools.length) +
  Math.max(0, (info.weaponMastery ?? 0) - c.weaponMasteries.length) +
  (info.fightingStyle ? left(Boolean(c.fightingStyle)) : 0) +
  (info.invocations ? left(Boolean(c.invocation)) : 0);

/** Spells still to pick; none for a class that casts none at level 1. */
const spellChoicesLeft = (c: Character): number =>
  Math.max(0, cantripCount(c) - c.cantrips.length) +
  Math.max(0, spellCount(c) - c.spells.length) +
  Math.max(0, preparedCount(c) - c.prepared.length);

/** How many choices each step still needs; 0 everywhere means the character is done. */
export const choicesLeft = (c: Character): Record<Step, number> => {
  const info = classOf(c);
  const languages = Math.max(0, languageCount(c) - c.languages.length);

  return {
    abilities: left(scoresReady(c)),
    class:
      left(Boolean(info)) +
      (info ? left(Boolean(subclassOf(c))) : 0) +
      (info?.order ? left(Boolean(orderOf(c))) : 0),
    details: left(c.name.trim().length > 0) + left(Boolean(c.alignment)),
    equipment: 0,
    origin:
      speciesChoicesLeft(c) +
      backgroundChoicesLeft(c) +
      languages +
      originFeats(c).reduce(
        (sum, { feat, source }) => sum + featPicksLeft(c, source, feat),
        0
      ),
    // Skills and spells hang on the class: nothing to tick before one
    proficiencies: info ? classChoicesLeft(c, info) : 1,
    spells: info ? spellChoicesLeft(c) : 1,
  };
};

/** Whether nothing is left to choose. */
export const isComplete = (c: Character): boolean =>
  Object.values(choicesLeft(c)).every((count) => count === 0);
