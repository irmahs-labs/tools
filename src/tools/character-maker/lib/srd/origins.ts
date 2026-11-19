import { w } from "../words";
import type { Words } from "../words";
import { SKILLS } from "./core";
import type { Ability, Skill } from "./core";

/**
 * SRD 5.2.1, "Character Origins": the four backgrounds, the nine species and
 * the Origin feats. Trait texts are short summaries of the SRD's, in the
 * English and the French SRD's words.
 */

/** A trait or feature as the sheet lists it. */
export interface Trait {
  name: Words;
  text: Words;
}

const trait = (name: Words, text: Words): Trait => ({ name, text });

// ── Origin feats ──

export type OriginFeat =
  | "alert"
  | "magic-initiate"
  | "savage-attacker"
  | "skilled";

export const ORIGIN_FEATS: readonly OriginFeat[] = [
  "alert",
  "magic-initiate",
  "savage-attacker",
  "skilled",
];

export const FEATS: Record<OriginFeat, Trait> = {
  alert: trait(
    w("Alert", "Vigilant"),
    w(
      "Add your Proficiency Bonus to Initiative. Right after rolling Initiative, you can swap it with a willing ally’s.",
      "Ajoutez votre bonus de maîtrise à l’Initiative. Aussitôt après l’avoir jouée, vous pouvez l’échanger avec celle d’un allié volontaire."
    )
  ),
  "magic-initiate": trait(
    w("Magic Initiate", "Initié à la magie"),
    w(
      "Two cantrips and one level 1 spell from one list. You can cast the spell once without a slot per Long Rest.",
      "Deux sorts mineurs et un sort du 1er niveau d’une même liste. Vous pouvez lancer ce sort une fois sans emplacement par Repos long."
    )
  ),
  "savage-attacker": trait(
    w("Savage Attacker", "Sauvagerie martiale"),
    w(
      "Once per turn when you hit with a weapon, roll its damage dice twice and use either roll.",
      "Une fois par tour, quand vous touchez avec une arme, lancez deux fois ses dés de dégâts et gardez l’un ou l’autre résultat."
    )
  ),
  skilled: trait(
    w("Skilled", "Doué"),
    w(
      "Proficiency in any three skills or tools.",
      "Maîtrise de trois compétences ou outils au choix."
    )
  ),
};

/** The spell lists Magic Initiate can draw on. */
export type InitiateList = "cleric" | "druid" | "wizard";

export const INITIATE_LISTS: readonly InitiateList[] = [
  "cleric",
  "druid",
  "wizard",
];

// ── Backgrounds ──

export interface Background {
  id: string;
  name: Words;
  /** The three abilities it can raise: +2 and +1, or +1 to all three. */
  abilities: readonly [Ability, Ability, Ability];
  feat: OriginFeat;
  /** The list for its Magic Initiate, when that is its feat. */
  initiateList?: InitiateList;
  skills: readonly [Skill, Skill];
  /** A tool by id, or "gaming-set" to choose one. */
  tool: string;
  /** Package A; package B is always 50 GP. */
  equipment: Words;
  gold: number;
  /** The weapons and armor in package A, by id, for the sheet's attacks. */
  gear: readonly string[];
}

export const BACKGROUNDS: readonly Background[] = [
  {
    abilities: ["int", "wis", "cha"],
    equipment: w(
      "Calligrapher’s Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe",
      "Matériel de calligraphe, livre (de prières), symbole sacré, parchemin (10 feuilles), robe"
    ),
    feat: "magic-initiate",
    gear: [],
    gold: 8,
    id: "acolyte",
    initiateList: "cleric",
    name: w("Acolyte", "Acolyte"),
    skills: ["insight", "religion"],
    tool: "calligraphers-supplies",
  },
  {
    abilities: ["dex", "con", "int"],
    equipment: w(
      "2 Daggers, Thieves’ Tools, Crowbar, 2 Pouches, Traveler’s Clothes",
      "2 dagues, outils de voleur, 2 bourses, pied-de-biche, tenue de voyage"
    ),
    feat: "alert",
    gear: ["dagger", "dagger"],
    gold: 16,
    id: "criminal",
    name: w("Criminal", "Criminel"),
    skills: ["sleight-of-hand", "stealth"],
    tool: "thieves-tools",
  },
  {
    abilities: ["con", "int", "wis"],
    equipment: w(
      "Quarterstaff, Calligrapher’s Supplies, Book (history), Parchment (8 sheets), Robe",
      "Bâton de combat, matériel de calligraphe, livre (d’histoire), parchemin (8 feuilles), robe"
    ),
    feat: "magic-initiate",
    gear: ["quarterstaff"],
    gold: 8,
    id: "sage",
    initiateList: "wizard",
    name: w("Sage", "Sage"),
    skills: ["arcana", "history"],
    tool: "calligraphers-supplies",
  },
  {
    abilities: ["str", "dex", "con"],
    equipment: w(
      "Spear, Shortbow, 20 Arrows, Gaming Set (same as above), Healer’s Kit, Quiver, Traveler’s Clothes",
      "Lance, arc court, 20 flèches, boîte de jeux (du même type que ci-dessus), trousse de soins, carquois, tenue de voyage"
    ),
    feat: "savage-attacker",
    gear: ["spear", "shortbow"],
    gold: 14,
    id: "soldier",
    name: w("Soldier", "Soldat"),
    skills: ["athletics", "intimidation"],
    tool: "gaming-set",
  },
];

// ── Species ──

/** A choice inside a species: an elf's lineage, a dragonborn's ancestor. */
export interface Variant {
  id: string;
  name: Words;
  /** What it gives at level 1. */
  text: Words;
  /** Cantrips it teaches, by spell id. */
  cantrips?: readonly string[];
  /** It raises the species' Speed to this, in feet. */
  speed?: number;
  /** It raises the species' Darkvision to this, in feet. */
  darkvision?: number;
}

export interface Species {
  id: string;
  name: Words;
  /** Medium, Small, or the player's pick of either. */
  sizes: readonly ("medium" | "small")[];
  speed: number;
  darkvision?: number;
  traits: readonly Trait[];
  /** The choice it asks for at level 1, if any. */
  variants?: { label: Words; options: readonly Variant[] };
  /** Its variant's spells use Intelligence, Wisdom or Charisma, chosen. */
  castingChoice?: true;
  /** Cantrips every member knows, by spell id. */
  cantrips?: readonly string[];
  /** A skill to pick: an Elf's Keen Senses, a Human's Skillful. */
  skillChoice?: { label: Words; from: readonly Skill[] };
  /** An Origin feat to pick: a Human's Versatile. */
  featChoice?: true;
  /** Hit Points added per level: a Dwarf's Dwarven Toughness. */
  hitPointsPerLevel?: number;
}

const PB_LONG = w(
  "Uses equal to your Proficiency Bonus, regained on a Long Rest.",
  "Autant d’utilisations que votre bonus de maîtrise, récupérées après un Repos long."
);

const darkvisionTrait = (feet: number) =>
  trait(
    w("Darkvision", "Vision dans le noir"),
    w(
      `Darkvision with a range of ${feet} feet.`,
      `Vision dans le noir sur ${(feet * 3) / 10} m.`
    )
  );

const dragon = (id: string, en: string, fr: string, type: Words): Variant => ({
  id,
  name: w(en, fr),
  text: type,
});

export const SPECIES: readonly Species[] = [
  {
    darkvision: 60,
    id: "dragonborn",
    name: w("Dragonborn", "Drakéide"),
    sizes: ["medium"],
    speed: 30,
    traits: [
      trait(
        w("Breath Weapon", "Souffle"),
        w(
          `In place of one attack, a 15-foot Cone or 30-foot Line: Dexterity save (DC 8 + Con modifier + Proficiency Bonus), 1d10 damage of your ancestry’s type, half on a success. ${PB_LONG.en}`,
          `À la place d’une attaque, un Cône de 4,50 m ou une Ligne de 9 m : jet de sauvegarde de Dextérité (DD 8 + modificateur de Constitution + bonus de maîtrise), 1d10 dégâts du type de votre ascendance, moitié en cas de réussite. ${PB_LONG.fr}`
        )
      ),
      trait(
        w("Damage Resistance", "Résistance aux dégâts"),
        w(
          "Resistance to your ancestry’s damage type.",
          "Résistance au type de dégâts de votre ascendance."
        )
      ),
      darkvisionTrait(60),
    ],
    variants: {
      label: w("Draconic Ancestry", "Ascendance draconique"),
      options: [
        dragon("black", "Black", "Noir", w("Acid", "Acide")),
        dragon("blue", "Blue", "Bleu", w("Lightning", "Foudre")),
        dragon("brass", "Brass", "Airain", w("Fire", "Feu")),
        dragon("bronze", "Bronze", "Bronze", w("Lightning", "Foudre")),
        dragon("copper", "Copper", "Cuivre", w("Acid", "Acide")),
        dragon("gold", "Gold", "Or", w("Fire", "Feu")),
        dragon("green", "Green", "Vert", w("Poison", "Poison")),
        dragon("red", "Red", "Rouge", w("Fire", "Feu")),
        dragon("silver", "Silver", "Argent", w("Cold", "Froid")),
        dragon("white", "White", "Blanc", w("Cold", "Froid")),
      ],
    },
  },
  {
    darkvision: 120,
    hitPointsPerLevel: 1,
    id: "dwarf",
    name: w("Dwarf", "Nain"),
    sizes: ["medium"],
    speed: 30,
    traits: [
      darkvisionTrait(120),
      trait(
        w("Dwarven Resilience", "Résistance naine"),
        w(
          "Resistance to Poison damage, and Advantage on saves to avoid or end the Poisoned condition.",
          "Résistance aux dégâts de poison, et Avantage aux jets de sauvegarde pour éviter l’état Empoisonné ou y mettre un terme."
        )
      ),
      trait(
        w("Dwarven Toughness", "Ténacité naine"),
        w(
          "Your Hit Point maximum increases by 1 per level.",
          "Votre maximum de points de vie augmente de 1 par niveau."
        )
      ),
      trait(
        w("Stonecunning", "Connaissance de la pierre"),
        w(
          `As a Bonus Action, Tremorsense 60 feet for 10 minutes while on or touching stone. ${PB_LONG.en}`,
          `Par une action Bonus, Perception des vibrations sur 18 m pendant 10 minutes, au contact de la pierre. ${PB_LONG.fr}`
        )
      ),
    ],
  },
  {
    castingChoice: true,
    darkvision: 60,
    id: "elf",
    skillChoice: {
      from: ["insight", "perception", "survival"],
      label: w("Keen Senses skill", "Compétence des Sens aiguisés"),
    },
    name: w("Elf", "Elfe"),
    sizes: ["medium"],
    speed: 30,
    traits: [
      darkvisionTrait(60),
      trait(
        w("Fey Ancestry", "Ascendance féerique"),
        w(
          "Advantage on saves to avoid or end the Charmed condition.",
          "Avantage aux jets de sauvegarde pour éviter l’état Charmé ou y mettre un terme."
        )
      ),
      trait(
        w("Keen Senses", "Sens aiguisés"),
        w(
          "Proficiency in Insight, Perception or Survival.",
          "Maîtrise de la compétence Intuition, Perception ou Survie."
        )
      ),
      trait(
        w("Trance", "Transe"),
        w(
          "You don’t need to sleep, magic can’t put you to sleep, and a Long Rest takes you 4 hours of meditation.",
          "Vous vous passez de sommeil, la magie ne peut pas vous endormir, et un Repos long vous prend 4 heures de transe."
        )
      ),
    ],
    variants: {
      label: w("Elven Lineage", "Lignage elfique"),
      options: [
        {
          cantrips: ["dancing-lights"],
          darkvision: 120,
          id: "drow",
          name: w("Drow", "Drow"),
          text: w(
            "Darkvision 120 feet, and the Dancing Lights cantrip.",
            "Vision dans le noir sur 36 m, et le sort mineur lumières dansantes."
          ),
        },
        {
          cantrips: ["prestidigitation"],
          id: "high-elf",
          name: w("High Elf", "Haut-elfe"),
          text: w(
            "The Prestidigitation cantrip, which you can swap for another Wizard cantrip after a Long Rest.",
            "Le sort mineur prestidigitation, que vous pouvez remplacer par un autre sort mineur du Magicien après un Repos long."
          ),
        },
        {
          cantrips: ["druidcraft"],
          id: "wood-elf",
          name: w("Wood Elf", "Elfe sylvestre"),
          speed: 35,
          text: w(
            "Speed 35 feet, and the Druidcraft cantrip.",
            "Vitesse de 10,50 m, et le sort mineur druidisme."
          ),
        },
      ],
    },
  },
  {
    castingChoice: true,
    darkvision: 60,
    id: "gnome",
    name: w("Gnome", "Gnome"),
    sizes: ["small"],
    speed: 30,
    traits: [
      darkvisionTrait(60),
      trait(
        w("Gnomish Cunning", "Ruse gnome"),
        w(
          "Advantage on Intelligence, Wisdom and Charisma saving throws.",
          "Avantage aux jets de sauvegarde d’Intelligence, de Sagesse et de Charisme."
        )
      ),
    ],
    variants: {
      label: w("Gnomish Lineage", "Lignage gnome"),
      options: [
        {
          cantrips: ["minor-illusion"],
          id: "forest",
          name: w("Forest Gnome", "Gnome des forêts"),
          text: w(
            `The Minor Illusion cantrip, and Speak with Animals always prepared, cast without a slot. ${PB_LONG.en}`,
            `Le sort mineur illusion mineure, et communication avec les animaux toujours préparé, lancé sans emplacement. ${PB_LONG.fr}`
          ),
        },
        {
          cantrips: ["mending", "prestidigitation"],
          id: "rock",
          name: w("Rock Gnome", "Gnome des roches"),
          text: w(
            "The Mending and Prestidigitation cantrips, and tiny clockwork devices made in 10 minutes.",
            "Les sorts mineurs prestidigitation et réparation, et de petits appareils mécaniques créés en 10 minutes."
          ),
        },
      ],
    },
  },
  {
    id: "goliath",
    name: w("Goliath", "Goliath"),
    sizes: ["medium"],
    speed: 35,
    traits: [
      trait(
        w("Powerful Build", "Forte carrure"),
        w(
          "Advantage on checks to end the Grappled condition; you count as one size larger for carrying capacity.",
          "Avantage aux tests pour mettre un terme à l’état Agrippé ; vous comptez comme d’une taille de plus pour la capacité de charge."
        )
      ),
    ],
    variants: {
      label: w("Giant Ancestry", "Ascendance gigante"),
      options: [
        {
          id: "cloud",
          name: w("Cloud’s Jaunt", "Saut des nuées"),
          text: w(
            `As a Bonus Action, teleport up to 30 feet to a space you can see. ${PB_LONG.en}`,
            `Par une action Bonus, téléportez-vous de 9 m au plus dans un espace que vous voyez. ${PB_LONG.fr}`
          ),
        },
        {
          id: "fire",
          name: w("Fire’s Burn", "Brûlure ignée"),
          text: w(
            `When you hit with an attack roll, deal an extra 1d10 Fire damage. ${PB_LONG.en}`,
            `Quand vous touchez avec un jet d’attaque, infligez 1d10 dégâts de feu supplémentaires. ${PB_LONG.fr}`
          ),
        },
        {
          id: "frost",
          name: w("Frost’s Chill", "Froid mordant"),
          text: w(
            `When you hit with an attack roll, deal an extra 1d6 Cold damage and reduce the target’s Speed by 10 feet. ${PB_LONG.en}`,
            `Quand vous touchez avec un jet d’attaque, infligez 1d6 dégâts de froid supplémentaires et réduisez la Vitesse de la cible de 3 m. ${PB_LONG.fr}`
          ),
        },
        {
          id: "hill",
          name: w("Hill’s Tumble", "Renversement des coteaux"),
          text: w(
            `When you hit a Large or smaller creature, you can knock it Prone. ${PB_LONG.en}`,
            `Quand vous touchez une créature de taille G ou inférieure, vous pouvez la mettre À terre. ${PB_LONG.fr}`
          ),
        },
        {
          id: "stone",
          name: w("Stone’s Endurance", "Endurance de la pierre"),
          text: w(
            `When you take damage, use your Reaction to reduce it by 1d12 + your Constitution modifier. ${PB_LONG.en}`,
            `Quand vous subissez des dégâts, jouez votre Réaction pour les réduire de 1d12 + votre modificateur de Constitution. ${PB_LONG.fr}`
          ),
        },
        {
          id: "storm",
          name: w("Storm’s Thunder", "Tonnerre des cieux"),
          text: w(
            `When a creature within 60 feet damages you, use your Reaction to deal it 1d8 Thunder damage. ${PB_LONG.en}`,
            `Quand une créature dans un rayon de 18 m vous inflige des dégâts, jouez votre Réaction pour lui infliger 1d8 dégâts de tonnerre. ${PB_LONG.fr}`
          ),
        },
      ],
    },
  },
  {
    id: "halfling",
    name: w("Halfling", "Halfelin"),
    sizes: ["small"],
    speed: 30,
    traits: [
      trait(
        w("Brave", "Brave"),
        w(
          "Advantage on saves to avoid or end the Frightened condition.",
          "Avantage aux jets de sauvegarde pour éviter l’état Effrayé ou y mettre un terme."
        )
      ),
      trait(
        w("Halfling Nimbleness", "Agilité halfeline"),
        w(
          "You can move through the space of any creature a size larger than you.",
          "Vous pouvez traverser l’espace de toute créature d’une taille supérieure à la vôtre."
        )
      ),
      trait(
        w("Luck", "Chance"),
        w(
          "When you roll a 1 on a D20 Test, reroll it and use the new roll.",
          "Quand vous obtenez un 1 au d20 d’un Test d20, relancez le dé et utilisez le nouveau résultat."
        )
      ),
      trait(
        w("Naturally Stealthy", "Discrétion naturelle"),
        w(
          "You can Hide when obscured only by a creature at least one size larger than you.",
          "Vous pouvez entreprendre l’action Furtivité derrière une créature d’au moins une taille de plus que vous."
        )
      ),
    ],
  },
  {
    featChoice: true,
    id: "human",
    name: w("Human", "Humain"),
    skillChoice: {
      from: SKILLS,
      label: w("Skillful skill", "Compétence de Compétent"),
    },
    sizes: ["medium", "small"],
    speed: 30,
    traits: [
      trait(
        w("Resourceful", "Ingénieux"),
        w(
          "You gain Heroic Inspiration whenever you finish a Long Rest.",
          "Vous recevez l’Inspiration héroïque chaque fois que vous terminez un Repos long."
        )
      ),
      trait(
        w("Skillful", "Compétent"),
        w(
          "Proficiency in one skill of your choice.",
          "Maîtrise d’une compétence de votre choix."
        )
      ),
      trait(
        w("Versatile", "Polyvalent"),
        w("An Origin feat of your choice.", "Un don d’origines de votre choix.")
      ),
    ],
  },
  {
    darkvision: 120,
    id: "orc",
    name: w("Orc", "Orc"),
    sizes: ["medium"],
    speed: 30,
    traits: [
      trait(
        w("Adrenaline Rush", "Poussée d’adrénaline"),
        w(
          "Dash as a Bonus Action and gain Temporary Hit Points equal to your Proficiency Bonus. Uses equal to your Proficiency Bonus, regained on a Short or Long Rest.",
          "Entreprenez l’action Pointe par une action Bonus et recevez des points de vie temporaires égaux à votre bonus de maîtrise. Autant d’utilisations que votre bonus de maîtrise, récupérées après un Repos court ou long."
        )
      ),
      darkvisionTrait(120),
      trait(
        w("Relentless Endurance", "Acharnement"),
        w(
          "When reduced to 0 Hit Points but not killed, drop to 1 instead, once per Long Rest.",
          "Quand vous tombez à 0 point de vie sans être tué, restez à 1, une fois par Repos long."
        )
      ),
    ],
  },
  {
    cantrips: ["thaumaturgy"],
    castingChoice: true,
    darkvision: 60,
    id: "tiefling",
    name: w("Tiefling", "Tieffelin"),
    sizes: ["medium", "small"],
    speed: 30,
    traits: [
      darkvisionTrait(60),
      trait(
        w("Otherworldly Presence", "Présence d’outre-monde"),
        w(
          "You know the Thaumaturgy cantrip.",
          "Vous connaissez le sort mineur thaumaturgie."
        )
      ),
    ],
    variants: {
      label: w("Fiendish Legacy", "Héritage fiélon"),
      options: [
        {
          cantrips: ["poison-spray"],
          id: "abyssal",
          name: w("Abyssal", "Abyssal"),
          text: w(
            "Resistance to Poison damage, and the Poison Spray cantrip.",
            "Résistance aux dégâts de poison, et le sort mineur bouffée de poison."
          ),
        },
        {
          cantrips: ["chill-touch"],
          id: "chthonic",
          name: w("Chthonic", "Chtonien"),
          text: w(
            "Resistance to Necrotic damage, and the Chill Touch cantrip.",
            "Résistance aux dégâts nécrotiques, et le sort mineur contact glacial."
          ),
        },
        {
          cantrips: ["fire-bolt"],
          id: "infernal",
          name: w("Infernal", "Infernal"),
          text: w(
            "Resistance to Fire damage, and the Fire Bolt cantrip.",
            "Résistance aux dégâts de feu, et le sort mineur trait de feu."
          ),
        },
      ],
    },
  },
];

export const SIZE_NAMES: Record<"medium" | "small", Words> = {
  medium: w("Medium", "Moyenne (M)"),
  small: w("Small", "Petite (P)"),
};
