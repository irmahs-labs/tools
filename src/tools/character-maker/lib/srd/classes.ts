import { w } from "../words";
import type { Words } from "../words";
import type { Ability, Skill } from "./core";
import { SKILLS } from "./core";
import type { Trait } from "./origins";

/**
 * SRD 5.2.1, "Classes": each class's core traits and level 1 features, in
 * the English and the French SRD's words (feature texts are short summaries).
 */

export const CLASS_IDS = [
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
] as const;

export type ClassId = (typeof CLASS_IDS)[number];

/** A starting equipment package: what it says, its gold, and the weapons and armor in it by id. */
export interface Package {
  text: Words;
  gold: number;
  gear: readonly string[];
}

/** A pick among a few roles at level 1: the Cleric's Divine Order, the Druid's Primal Order. */
export interface Order {
  id: string;
  name: Words;
  text: Words;
  /** Proficiency with Martial weapons. */
  martial?: true;
  /** The armor training it adds. */
  armor?: "medium" | "heavy";
  /** One more cantrip from the class's list. */
  extraCantrip?: true;
  /** Wisdom modifier (at least +1) added to these Intelligence checks. */
  checks?: readonly Skill[];
}

export interface Spellcasting {
  ability: Ability;
  cantrips: number;
  prepared: number;
  /** Level 1 spell slots. */
  slots: number;
  /** Spells always prepared, by id, on top of the prepared ones. */
  always?: readonly string[];
  /** The Wizard's spellbook: this many level 1 spells, the prepared ones among them. */
  spellbook?: number;
  /** Pact Magic: slots come back on a Short Rest too. */
  pact?: true;
}

export interface ClassInfo {
  id: ClassId;
  name: Words;
  hitDie: number;
  primary: readonly Ability[];
  saves: readonly [Ability, Ability];
  skills: { count: number; from: readonly Skill[] };
  weapons: Words;
  /** Simple weapons always; Martial ones by these rules. */
  martial: "all" | "light" | "finesse-or-light" | "none";
  armor: { light?: true; medium?: true; heavy?: true; shield?: true };
  armorText: Words;
  /** Tools by id, always given. */
  tools?: readonly string[];
  /** Tools to choose: how many, and from which kind. */
  toolChoice?: { count: number; from: "instrument" | "artisan-or-instrument" };
  packages: readonly Package[];
  features: readonly Trait[];
  /** How many kinds of weapons it masters. */
  weaponMastery?: number;
  /** Unarmored Defense: 10 + Dex + this ability, without armor. */
  unarmored?: { ability: Ability; shield: boolean };
  order?: { label: Words; options: readonly Order[] };
  spellcasting?: Spellcasting;
  /** The Fighter's Fighting Style feat. */
  fightingStyle?: true;
  /** The Rogue's Expertise in two skills. */
  expertise?: number;
  /** The Warlock's Eldritch Invocations. */
  invocations?: number;
  /** Languages the class teaches, and how many more of the standard ones. */
  languages?: { known: readonly ("druidic" | "thieves-cant")[]; extra: number };
}

const trait = (name: Words, text: Words): Trait => ({ name, text });

const WEAPON_MASTERY = (count: number, melee: boolean) =>
  trait(
    w("Weapon Mastery", "Bottes d’arme"),
    w(
      `Use the mastery properties of ${count} kinds of ${melee ? "Simple or Martial Melee" : "Simple or Martial"} weapons; change one after a Long Rest.`,
      `Utilisez les bottes de ${count} types d’armes ${melee ? "courantes ou de guerre de corps à corps" : "courantes ou de guerre"} ; changez-en une après un Repos long.`
    )
  );

const SPELLCASTING = (en: string, fr: string) =>
  trait(w("Spellcasting", "Sorts"), w(en, fr));

const ALL_SKILLS = SKILLS;

const SIMPLE = w("Simple weapons", "Armes courantes");

const SIMPLE_MARTIAL = w(
  "Simple and Martial weapons",
  "Armes courantes et armes de guerre"
);

const NONE = w("None", "Aucune");
const LIGHT = w("Light armor", "Armures légères");

const LIGHT_MEDIUM_SHIELD = w(
  "Light and Medium armor and Shields",
  "Armures légères, intermédiaires et boucliers"
);

const ALL_ARMOR = w(
  "Light, Medium and Heavy armor and Shields",
  "Armures légères, intermédiaires et lourdes, boucliers"
);

export const CLASSES: readonly ClassInfo[] = [
  {
    armor: { light: true, medium: true, shield: true },
    armorText: LIGHT_MEDIUM_SHIELD,
    features: [
      trait(
        w("Rage", "Rage"),
        w(
          "2 uses (one back on a Short Rest, all on a Long Rest). As a Bonus Action without Heavy armor: Resistance to Bludgeoning, Piercing and Slashing damage, +2 damage on Strength attacks, Advantage on Strength checks and saves; no spells or Concentration.",
          "2 utilisations (une récupérée après un Repos court, toutes après un Repos long). Par une action Bonus, sans armure lourde : Résistance aux dégâts contondants, perforants et tranchants, +2 aux dégâts des attaques de Force, Avantage aux tests et jets de sauvegarde de Force ; ni sorts ni Concentration."
        )
      ),
      trait(
        w("Unarmored Defense", "Défense sans armure"),
        w(
          "Without armor, your base AC is 10 + Dexterity + Constitution modifiers; a Shield still counts.",
          "Sans armure, votre CA de base est 10 + modificateurs de Dextérité et de Constitution ; un bouclier compte toujours."
        )
      ),
      WEAPON_MASTERY(2, true),
    ],
    hitDie: 12,
    id: "barbarian",
    martial: "all",
    name: w("Barbarian", "Barbare"),
    packages: [
      {
        gear: ["greataxe", "handaxe"],
        gold: 15,
        text: w(
          "Greataxe, 4 Handaxes, Explorer’s Pack",
          "Hache à deux mains, 4 hachettes, paquetage d’explorateur"
        ),
      },
      { gear: [], gold: 75, text: w("", "") },
    ],
    primary: ["str"],
    saves: ["str", "con"],
    skills: {
      count: 2,
      from: [
        "animal-handling",
        "athletics",
        "intimidation",
        "nature",
        "perception",
        "survival",
      ],
    },
    unarmored: { ability: "con", shield: true },
    weaponMastery: 2,
    weapons: SIMPLE_MARTIAL,
  },
  {
    armor: { light: true },
    armorText: LIGHT,
    features: [
      trait(
        w("Bardic Inspiration", "Inspiration bardique"),
        w(
          "As a Bonus Action, give a creature within 60 feet a d6 to add to a failed D20 Test within the hour. Uses equal to your Charisma modifier (at least 1), regained on a Long Rest.",
          "Par une action Bonus, donnez à une créature dans un rayon de 18 m un d6 à ajouter à un Test d20 raté dans l’heure. Autant d’utilisations que votre modificateur de Charisme (au moins 1), récupérées après un Repos long."
        )
      ),
      SPELLCASTING(
        "Charisma spells from the Bard list, with a Musical Instrument as your focus.",
        "Sorts de la liste du Barde, lancés avec le Charisme, un instrument de musique servant de focaliseur."
      ),
    ],
    hitDie: 8,
    id: "bard",
    martial: "none",
    name: w("Bard", "Barde"),
    packages: [
      {
        gear: ["leather", "dagger", "dagger"],
        gold: 19,
        text: w(
          "Leather Armor, 2 Daggers, Musical Instrument of your choice, Entertainer’s Pack",
          "Armure de cuir, 2 dagues, instrument de musique de votre choix, paquetage d’artiste"
        ),
      },
      { gear: [], gold: 90, text: w("", "") },
    ],
    primary: ["cha"],
    saves: ["dex", "cha"],
    skills: { count: 3, from: ALL_SKILLS },
    spellcasting: { ability: "cha", cantrips: 2, prepared: 4, slots: 2 },
    toolChoice: { count: 3, from: "instrument" },
    weapons: SIMPLE,
  },
  {
    armor: { light: true, medium: true, shield: true },
    armorText: LIGHT_MEDIUM_SHIELD,
    features: [
      SPELLCASTING(
        "Wisdom spells from the Cleric list, with a Holy Symbol as your focus.",
        "Sorts de la liste du Clerc, lancés avec la Sagesse, un symbole sacré servant de focaliseur."
      ),
    ],
    hitDie: 8,
    id: "cleric",
    martial: "none",
    name: w("Cleric", "Clerc"),
    order: {
      label: w("Divine Order", "Ordre divin"),
      options: [
        {
          armor: "heavy",
          id: "protector",
          martial: true,
          name: w("Protector", "Protecteur"),
          text: w(
            "Proficiency with Martial weapons and training with Heavy armor.",
            "Maîtrise des armes de guerre et formation aux armures lourdes."
          ),
        },
        {
          checks: ["arcana", "religion"],
          extraCantrip: true,
          id: "thaumaturge",
          name: w("Thaumaturge", "Thaumaturge"),
          text: w(
            "One more Cleric cantrip, and your Wisdom modifier (at least +1) added to Intelligence (Arcana or Religion) checks.",
            "Un sort mineur de Clerc de plus, et votre modificateur de Sagesse (au moins +1) ajouté aux tests d’Intelligence (Arcanes ou Religion)."
          ),
        },
      ],
    },
    packages: [
      {
        gear: ["chain-shirt", "shield", "mace"],
        gold: 7,
        text: w(
          "Chain Shirt, Shield, Mace, Holy Symbol, Priest’s Pack",
          "Chemise de mailles, bouclier, masse d’armes, symbole sacré, paquetage d’ecclésiastique"
        ),
      },
      { gear: [], gold: 110, text: w("", "") },
    ],
    primary: ["wis"],
    saves: ["wis", "cha"],
    skills: {
      count: 2,
      from: ["history", "insight", "medicine", "persuasion", "religion"],
    },
    spellcasting: { ability: "wis", cantrips: 3, prepared: 4, slots: 2 },
    weapons: SIMPLE,
  },
  {
    armor: { light: true, shield: true },
    armorText: w("Light armor and Shields", "Armures légères et boucliers"),
    features: [
      SPELLCASTING(
        "Wisdom spells from the Druid list, with a Druidic Focus.",
        "Sorts de la liste du Druide, lancés avec la Sagesse et un focaliseur druidique."
      ),
      trait(
        w("Druidic", "Druidique"),
        w(
          "You know Druidic, the Druids’ secret language, and always have Speak with Animals prepared.",
          "Vous connaissez le druidique, la langue secrète des Druides, et communication avec les animaux est toujours préparé."
        )
      ),
    ],
    hitDie: 8,
    id: "druid",
    languages: { extra: 0, known: ["druidic"] },
    martial: "none",
    name: w("Druid", "Druide"),
    order: {
      label: w("Primal Order", "Ordre primitif"),
      options: [
        {
          checks: ["arcana", "nature"],
          extraCantrip: true,
          id: "magician",
          name: w("Magician", "Mage"),
          text: w(
            "One more Druid cantrip, and your Wisdom modifier (at least +1) added to Intelligence (Arcana or Nature) checks.",
            "Un sort mineur de Druide de plus, et votre modificateur de Sagesse (au moins +1) ajouté aux tests d’Intelligence (Arcanes ou Nature)."
          ),
        },
        {
          armor: "medium",
          id: "warden",
          martial: true,
          name: w("Warden", "Gardien"),
          text: w(
            "Proficiency with Martial weapons and training with Medium armor.",
            "Maîtrise des armes de guerre et formation aux armures intermédiaires."
          ),
        },
      ],
    },
    packages: [
      {
        gear: ["leather", "shield", "sickle", "quarterstaff"],
        gold: 9,
        text: w(
          "Leather Armor, Shield, Sickle, Druidic Focus (Quarterstaff), Explorer’s Pack, Herbalism Kit",
          "Armure de cuir, bouclier, serpe, focaliseur druidique (bâton de combat), paquetage d’explorateur, matériel d’herboriste"
        ),
      },
      { gear: [], gold: 50, text: w("", "") },
    ],
    primary: ["wis"],
    saves: ["int", "wis"],
    skills: {
      count: 2,
      from: [
        "animal-handling",
        "arcana",
        "insight",
        "medicine",
        "nature",
        "perception",
        "religion",
        "survival",
      ],
    },
    spellcasting: {
      ability: "wis",
      always: ["speak-with-animals"],
      cantrips: 2,
      prepared: 4,
      slots: 2,
    },
    tools: ["herbalism-kit"],
    weapons: SIMPLE,
  },
  {
    armor: { heavy: true, light: true, medium: true, shield: true },
    armorText: ALL_ARMOR,
    features: [
      trait(
        w("Fighting Style", "Style de combat"),
        w(
          "A Fighting Style feat of your choice; you can swap it whenever you gain a Fighter level.",
          "Un don de Style de combat de votre choix ; vous pouvez en changer à chaque niveau de Guerrier."
        )
      ),
      trait(
        w("Second Wind", "Second souffle"),
        w(
          "As a Bonus Action, regain 1d10 + your Fighter level Hit Points. 2 uses (one back on a Short Rest, all on a Long Rest).",
          "Par une action Bonus, récupérez 1d10 + votre niveau de Guerrier en points de vie. 2 utilisations (une récupérée après un Repos court, toutes après un Repos long)."
        )
      ),
      WEAPON_MASTERY(3, false),
    ],
    fightingStyle: true,
    hitDie: 10,
    id: "fighter",
    martial: "all",
    name: w("Fighter", "Guerrier"),
    packages: [
      {
        gear: ["chain-mail", "greatsword", "flail", "javelin"],
        gold: 4,
        text: w(
          "Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer’s Pack",
          "Cotte de mailles, épée à deux mains, fléau d’armes, 8 javelines, paquetage d’exploration souterraine"
        ),
      },
      {
        gear: ["studded-leather", "scimitar", "shortsword", "longbow"],
        gold: 11,
        text: w(
          "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer’s Pack",
          "Armure de cuir clouté, cimeterre, épée courte, arc long, 20 flèches, carquois, paquetage d’exploration souterraine"
        ),
      },
      { gear: [], gold: 155, text: w("", "") },
    ],
    primary: ["str", "dex"],
    saves: ["str", "con"],
    skills: {
      count: 2,
      from: [
        "acrobatics",
        "animal-handling",
        "athletics",
        "history",
        "insight",
        "intimidation",
        "persuasion",
        "perception",
        "survival",
      ],
    },
    weaponMastery: 3,
    weapons: SIMPLE_MARTIAL,
  },
  {
    armor: {},
    armorText: NONE,
    features: [
      trait(
        w("Martial Arts", "Arts martiaux"),
        w(
          "Unarmed and with only Monk weapons (Simple Melee, and Martial Melee with Light), without armor or Shield: an Unarmed Strike as a Bonus Action, a d6 for their damage, and Dexterity instead of Strength.",
          "À mains nues ou avec des armes de moine (de corps à corps courantes, et de guerre Légères), sans armure ni bouclier : une frappe à mains nues par une action Bonus, un d6 de dégâts, et la Dextérité à la place de la Force."
        )
      ),
      trait(
        w("Unarmored Defense", "Défense sans armure"),
        w(
          "Without armor or a Shield, your base AC is 10 + Dexterity + Wisdom modifiers.",
          "Sans armure ni bouclier, votre CA de base est 10 + modificateurs de Dextérité et de Sagesse."
        )
      ),
    ],
    hitDie: 8,
    id: "monk",
    martial: "light",
    name: w("Monk", "Moine"),
    packages: [
      {
        gear: ["spear", "dagger"],
        gold: 11,
        text: w(
          "Spear, 5 Daggers, the Artisan’s Tools or Musical Instrument chosen above, Explorer’s Pack",
          "Lance, 5 dagues, les outils d’artisan ou l’instrument de musique choisis ci-dessus, paquetage d’explorateur"
        ),
      },
      { gear: [], gold: 50, text: w("", "") },
    ],
    primary: ["dex", "wis"],
    saves: ["str", "dex"],
    skills: {
      count: 2,
      from: [
        "acrobatics",
        "athletics",
        "history",
        "insight",
        "religion",
        "stealth",
      ],
    },
    toolChoice: { count: 1, from: "artisan-or-instrument" },
    unarmored: { ability: "wis", shield: false },
    weapons: w(
      "Simple weapons, and Martial weapons with the Light property",
      "Armes courantes, et armes de guerre dotées de la propriété Légère"
    ),
  },
  {
    armor: { heavy: true, light: true, medium: true, shield: true },
    armorText: ALL_ARMOR,
    features: [
      trait(
        w("Lay On Hands", "Imposition des mains"),
        w(
          "A pool of 5 Hit Points to restore by touch as a Bonus Action, refilled on a Long Rest; 5 points also cure the Poisoned condition.",
          "Une réserve de 5 points de vie à rendre par contact, par une action Bonus, remplie après un Repos long ; 5 points guérissent aussi l’état Empoisonné."
        )
      ),
      SPELLCASTING(
        "Charisma spells from the Paladin list, with a Holy Symbol as your focus.",
        "Sorts de la liste du Paladin, lancés avec le Charisme, un symbole sacré servant de focaliseur."
      ),
      WEAPON_MASTERY(2, false),
    ],
    hitDie: 10,
    id: "paladin",
    martial: "all",
    name: w("Paladin", "Paladin"),
    packages: [
      {
        gear: ["chain-mail", "shield", "longsword", "javelin"],
        gold: 9,
        text: w(
          "Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest’s Pack",
          "Cotte de mailles, bouclier, épée longue, 6 javelines, symbole sacré, paquetage d’ecclésiastique"
        ),
      },
      { gear: [], gold: 150, text: w("", "") },
    ],
    primary: ["str", "cha"],
    saves: ["wis", "cha"],
    skills: {
      count: 2,
      from: [
        "athletics",
        "insight",
        "intimidation",
        "medicine",
        "persuasion",
        "religion",
      ],
    },
    spellcasting: { ability: "cha", cantrips: 0, prepared: 2, slots: 2 },
    weaponMastery: 2,
    weapons: SIMPLE_MARTIAL,
  },
  {
    armor: { light: true, medium: true, shield: true },
    armorText: LIGHT_MEDIUM_SHIELD,
    features: [
      SPELLCASTING(
        "Wisdom spells from the Ranger list, with a Druidic Focus.",
        "Sorts de la liste du Rôdeur, lancés avec la Sagesse et un focaliseur druidique."
      ),
      trait(
        w("Favored Enemy", "Ennemi juré"),
        w(
          "Hunter’s Mark is always prepared; cast it twice without a slot, regained on a Long Rest.",
          "Marque du chasseur est toujours préparé ; lancez-le deux fois sans emplacement, récupéré après un Repos long."
        )
      ),
      WEAPON_MASTERY(2, false),
    ],
    hitDie: 10,
    id: "ranger",
    martial: "all",
    name: w("Ranger", "Rôdeur"),
    packages: [
      {
        gear: ["studded-leather", "scimitar", "shortsword", "longbow"],
        gold: 7,
        text: w(
          "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus (sprig of mistletoe), Explorer’s Pack",
          "Armure de cuir clouté, cimeterre, épée courte, arc long, 20 flèches, carquois, focaliseur druidique (branche de gui), paquetage d’explorateur"
        ),
      },
      { gear: [], gold: 150, text: w("", "") },
    ],
    primary: ["dex", "wis"],
    saves: ["str", "dex"],
    skills: {
      count: 3,
      from: [
        "animal-handling",
        "athletics",
        "insight",
        "investigation",
        "nature",
        "perception",
        "stealth",
        "survival",
      ],
    },
    spellcasting: {
      ability: "wis",
      always: ["hunters-mark"],
      cantrips: 0,
      prepared: 2,
      slots: 2,
    },
    weaponMastery: 2,
    weapons: SIMPLE_MARTIAL,
  },
  {
    armor: { light: true },
    armorText: LIGHT,
    expertise: 2,
    features: [
      trait(
        w("Expertise", "Expertise"),
        w(
          "Double your Proficiency Bonus in two of your skills.",
          "Doublez votre bonus de maîtrise pour deux de vos compétences."
        )
      ),
      trait(
        w("Sneak Attack", "Attaque sournoise"),
        w(
          "Once per turn, +1d6 damage to a creature you hit with a Finesse or Ranged weapon, if you have Advantage or an ally is within 5 feet of it.",
          "Une fois par tour, +1d6 dégâts contre une créature touchée avec une arme de finesse ou à distance, si vous avez l’Avantage ou qu’un allié se trouve à 1,50 m d’elle."
        )
      ),
      trait(
        w("Thieves’ Cant", "Argot des voleurs"),
        w(
          "You know Thieves’ Cant and one more language of your choice.",
          "Vous connaissez l’argot des voleurs et une autre langue de votre choix."
        )
      ),
      WEAPON_MASTERY(2, false),
    ],
    hitDie: 8,
    id: "rogue",
    languages: { extra: 1, known: ["thieves-cant"] },
    martial: "finesse-or-light",
    name: w("Rogue", "Roublard"),
    packages: [
      {
        gear: ["leather", "dagger", "dagger", "shortsword", "shortbow"],
        gold: 8,
        text: w(
          "Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves’ Tools, Burglar’s Pack",
          "Armure de cuir, 2 dagues, épée courte, arc court, 20 flèches, carquois, outils de voleur, paquetage de cambrioleur"
        ),
      },
      { gear: [], gold: 100, text: w("", "") },
    ],
    primary: ["dex"],
    saves: ["dex", "int"],
    skills: {
      count: 4,
      from: [
        "acrobatics",
        "athletics",
        "deception",
        "insight",
        "intimidation",
        "investigation",
        "perception",
        "persuasion",
        "sleight-of-hand",
        "stealth",
      ],
    },
    tools: ["thieves-tools"],
    weaponMastery: 2,
    weapons: w(
      "Simple weapons, and Martial weapons with the Finesse or Light property",
      "Armes courantes, et armes de guerre dotées de la propriété Finesse ou Légère"
    ),
  },
  {
    armor: {},
    armorText: NONE,
    features: [
      SPELLCASTING(
        "Charisma spells from the Sorcerer list, with an Arcane Focus.",
        "Sorts de la liste de l’Ensorceleur, lancés avec le Charisme et un focaliseur arcanique."
      ),
      trait(
        w("Innate Sorcery", "Sorcellerie innée"),
        w(
          "As a Bonus Action, for 1 minute: +1 to your Sorcerer spell save DC and Advantage on their attack rolls. 2 uses, regained on a Long Rest.",
          "Par une action Bonus, pendant 1 minute : +1 au DD de sauvegarde de vos sorts d’Ensorceleur et l’Avantage à leurs jets d’attaque. 2 utilisations, récupérées après un Repos long."
        )
      ),
    ],
    hitDie: 6,
    id: "sorcerer",
    martial: "none",
    name: w("Sorcerer", "Ensorceleur"),
    packages: [
      {
        gear: ["spear", "dagger", "dagger"],
        gold: 28,
        text: w(
          "Spear, 2 Daggers, Arcane Focus (crystal), Dungeoneer’s Pack",
          "Lance, 2 dagues, focaliseur arcanique (cristal), paquetage d’exploration souterraine"
        ),
      },
      { gear: [], gold: 50, text: w("", "") },
    ],
    primary: ["cha"],
    saves: ["con", "cha"],
    skills: {
      count: 2,
      from: [
        "arcana",
        "deception",
        "insight",
        "intimidation",
        "persuasion",
        "religion",
      ],
    },
    spellcasting: { ability: "cha", cantrips: 4, prepared: 2, slots: 2 },
    weapons: SIMPLE,
  },
  {
    armor: { light: true },
    armorText: LIGHT,
    features: [
      trait(
        w("Eldritch Invocations", "Manifestations occultes"),
        w(
          "One invocation of your choice; you can swap it whenever you gain a Warlock level.",
          "Une manifestation de votre choix ; vous pouvez en changer à chaque niveau d’Occultiste."
        )
      ),
      trait(
        w("Pact Magic", "Magie de pacte"),
        w(
          "Charisma spells from the Warlock list, with an Arcane Focus; your spell slot comes back on a Short or Long Rest.",
          "Sorts de la liste de l’Occultiste, lancés avec le Charisme et un focaliseur arcanique ; votre emplacement revient après un Repos court ou long."
        )
      ),
    ],
    hitDie: 8,
    id: "warlock",
    invocations: 1,
    martial: "none",
    name: w("Warlock", "Occultiste"),
    packages: [
      {
        gear: ["leather", "sickle", "dagger", "dagger"],
        gold: 15,
        text: w(
          "Leather Armor, Sickle, 2 Daggers, Arcane Focus (orb), Book (occult lore), Scholar’s Pack",
          "Armure de cuir, serpe, 2 dagues, focaliseur arcanique (orbe), livre (savoir occulte), paquetage d’érudit"
        ),
      },
      { gear: [], gold: 100, text: w("", "") },
    ],
    primary: ["cha"],
    saves: ["wis", "cha"],
    skills: {
      count: 2,
      from: [
        "arcana",
        "deception",
        "history",
        "intimidation",
        "investigation",
        "nature",
        "religion",
      ],
    },
    spellcasting: {
      ability: "cha",
      cantrips: 2,
      pact: true,
      prepared: 2,
      slots: 1,
    },
    weapons: SIMPLE,
  },
  {
    armor: {},
    armorText: NONE,
    features: [
      SPELLCASTING(
        "Intelligence spells from your spellbook, with an Arcane Focus; prepare yours from the book after a Long Rest.",
        "Sorts de votre grimoire, lancés avec l’Intelligence et un focaliseur arcanique ; préparez-les dans le grimoire après un Repos long."
      ),
      trait(
        w("Ritual Adept", "Savoir rituel"),
        w(
          "Cast any Ritual spell in your spellbook as a Ritual, prepared or not.",
          "Lancez comme rituel tout sort rituel de votre grimoire, préparé ou non."
        )
      ),
      trait(
        w("Arcane Recovery", "Restauration magique"),
        w(
          "Once a day after a Short Rest, regain a level 1 spell slot.",
          "Une fois par jour, après un Repos court, récupérez un emplacement de sort du 1er niveau."
        )
      ),
    ],
    hitDie: 6,
    id: "wizard",
    martial: "none",
    name: w("Wizard", "Magicien"),
    packages: [
      {
        gear: ["dagger", "dagger", "quarterstaff"],
        gold: 5,
        text: w(
          "2 Daggers, Arcane Focus (Quarterstaff), Robe, Spellbook, Scholar’s Pack",
          "2 dagues, focaliseur arcanique (bâton de combat), robe, grimoire, paquetage d’érudit"
        ),
      },
      { gear: [], gold: 55, text: w("", "") },
    ],
    primary: ["int"],
    saves: ["int", "wis"],
    skills: {
      count: 2,
      from: [
        "arcana",
        "history",
        "insight",
        "investigation",
        "medicine",
        "nature",
        "religion",
      ],
    },
    spellcasting: {
      ability: "int",
      cantrips: 3,
      prepared: 4,
      slots: 2,
      spellbook: 6,
    },
    weapons: SIMPLE,
  },
];

export const classById = (id: ClassId): ClassInfo => {
  const found = CLASSES.find((entry) => entry.id === id);

  if (!found) {
    throw new Error(`There is no class called ${id}`);
  }

  return found;
};

/** The Standard Array by Class table: where the SRD suggests each score goes. */
export const SUGGESTED_ARRAY: Record<ClassId, Record<Ability, number>> = {
  barbarian: { cha: 8, con: 14, dex: 13, int: 10, str: 15, wis: 12 },
  bard: { cha: 15, con: 12, dex: 14, int: 13, str: 8, wis: 10 },
  cleric: { cha: 12, con: 13, dex: 8, int: 10, str: 14, wis: 15 },
  druid: { cha: 10, con: 14, dex: 12, int: 13, str: 8, wis: 15 },
  fighter: { cha: 12, con: 13, dex: 14, int: 8, str: 15, wis: 10 },
  monk: { cha: 8, con: 13, dex: 15, int: 10, str: 12, wis: 14 },
  paladin: { cha: 14, con: 13, dex: 10, int: 8, str: 15, wis: 12 },
  ranger: { cha: 10, con: 13, dex: 15, int: 8, str: 12, wis: 14 },
  rogue: { cha: 8, con: 13, dex: 15, int: 14, str: 12, wis: 10 },
  sorcerer: { cha: 15, con: 14, dex: 13, int: 8, str: 10, wis: 12 },
  warlock: { cha: 15, con: 13, dex: 14, int: 12, str: 8, wis: 10 },
  wizard: { cha: 10, con: 13, dex: 12, int: 15, str: 8, wis: 14 },
};

/** The Fighter's Fighting Style feats. */
export const FIGHTING_STYLES: readonly (Trait & { id: string })[] = [
  {
    id: "archery",
    name: w("Archery", "Archerie"),
    text: w(
      "+2 to attack rolls with Ranged weapons.",
      "+2 aux jets d’attaque avec des armes à distance."
    ),
  },
  {
    id: "defense",
    name: w("Defense", "Défense"),
    text: w(
      "+1 to Armor Class while wearing Light, Medium or Heavy armor.",
      "+1 à la Classe d’armure tant que vous portez une armure légère, intermédiaire ou lourde."
    ),
  },
  {
    id: "great-weapon-fighting",
    name: w("Great Weapon Fighting", "Armes à deux mains"),
    text: w(
      "Treat a 1 or 2 on a damage die as a 3 with a Two-Handed or Versatile melee weapon held in two hands.",
      "Considérez les 1 et 2 aux dés de dégâts comme des 3 avec une arme de corps à corps Deux mains ou Polyvalente tenue à deux mains."
    ),
  },
  {
    id: "two-weapon-fighting",
    name: w("Two-Weapon Fighting", "Combat à deux armes"),
    text: w(
      "Add your ability modifier to the damage of the extra attack from a Light weapon.",
      "Ajoutez votre modificateur de caractéristique aux dégâts de l’attaque supplémentaire d’une arme Légère."
    ),
  },
];

/** The Eldritch Invocations a level 1 Warlock can take: those without a level prerequisite. */
export const INVOCATIONS: readonly (Trait & { id: string })[] = [
  {
    id: "armor-of-shadows",
    name: w("Armor of Shadows", "Armure d’ombres"),
    text: w(
      "Cast Mage Armor on yourself without a spell slot.",
      "Lancez armure du mage sur vous-même sans emplacement de sort."
    ),
  },
  {
    id: "eldritch-mind",
    name: w("Eldritch Mind", "Esprit occulte"),
    text: w(
      "Advantage on Constitution saves to keep Concentration.",
      "Avantage aux jets de sauvegarde de Constitution pour maintenir la Concentration."
    ),
  },
  {
    id: "pact-of-the-blade",
    name: w("Pact of the Blade", "Pacte de la lame"),
    text: w(
      "As a Bonus Action, conjure a melee pact weapon you are proficient with and can use as your focus, attacking with Charisma.",
      "Par une action Bonus, faites apparaître une arme de pacte de corps à corps que vous maîtrisez, utilisable comme focaliseur, et attaquez avec le Charisme."
    ),
  },
  {
    id: "pact-of-the-chain",
    name: w("Pact of the Chain", "Pacte de la chaîne"),
    text: w(
      "Learn Find Familiar and cast it without a spell slot, with special forms to choose from.",
      "Apprenez appel de familier et lancez-le sans emplacement de sort, avec des formes spéciales au choix."
    ),
  },
  {
    id: "pact-of-the-tome",
    name: w("Pact of the Tome", "Pacte du grimoire"),
    text: w(
      "Conjure a Book of Shadows after a rest, with three more cantrips and two level 1 Ritual spells of your choice.",
      "Faites apparaître un Livre des ombres après un repos, avec trois sorts mineurs et deux sorts rituels du 1er niveau de plus, au choix."
    ),
  },
];
