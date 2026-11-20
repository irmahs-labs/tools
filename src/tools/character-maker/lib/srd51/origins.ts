import { SKILLS } from "../srd/core";
import type { Background, Species, Trait, Variant } from "../srd/origins";
import { w } from "../words";
import type { Words } from "../words";

/**
 * SRD 5.1, "Races" and "Backgrounds": the nine races, each with the one
 * subrace the SRD 5.1 gives it, and the Acolyte. Traits are short summaries
 * of the English SRD 5.1's and its official French translation's, in their
 * words. A race raises its abilities itself (`boosts`); the background
 * raises none.
 */

const trait = (name: Words, text: Words): Trait => ({ name, text });

const darkvision = trait(
  w("Darkvision", "Vision dans le noir"),
  w(
    "You see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light, in shades of gray.",
    "Dans un rayon de 18 m, vous voyez en lumière faible comme si la lumière était vive, et dans les ténèbres comme sous une lumière faible, en nuances de gris."
  )
);

const feyAncestry = trait(
  w("Fey Ancestry", "Ascendance féerique"),
  w(
    "Advantage on saving throws against being charmed, and magic can’t put you to sleep.",
    "Vous êtes avantagé aux jets de sauvegarde contre l’état charmé et la magie ne peut pas vous endormir."
  )
);

const dragon = (
  id: string,
  en: string,
  fr: string,
  damage: Words,
  breath: Words
): Variant => ({
  id,
  name: w(en, fr),
  text: w(
    `${damage.en} damage; breath weapon: ${breath.en}.`,
    `Dégâts de ${damage.fr} ; souffle : ${breath.fr}.`
  ),
});

const LINE = w(
  "5 by 30 ft. line (Dex. save)",
  "ligne de 1,50 sur 9 m (jet de sauvegarde de Dex.)"
);

const CONE_DEX = w(
  "15 ft. cone (Dex. save)",
  "cône de 4,50 m (jet de sauvegarde de Dex.)"
);

const CONE_CON = w(
  "15 ft. cone (Con. save)",
  "cône de 4,50 m (jet de sauvegarde de Con.)"
);

const ACID = w("Acid", "acide");
const COLD = w("Cold", "froid");
const FIRE = w("Fire", "feu");
const LIGHTNING = w("Lightning", "foudre");
const POISON = w("Poison", "poison");

export const SPECIES_5_1: readonly Species[] = [
  {
    boosts: { con: 2, wis: 1 },
    darkvision: 60,
    hitPointsPerLevel: 1,
    id: "srd-5.1:hill-dwarf",
    languages: { extra: 0, known: ["common", "dwarvish"] },
    name: w("Hill Dwarf", "Nain des collines"),
    sizes: ["medium"],
    speed: 25,
    toolChoice: {
      from: ["smiths-tools", "brewers-supplies", "masons-tools"],
      label: w("Tool Proficiency", "Maîtrise d’outils"),
    },
    traits: [
      trait(
        w("Speed", "Vitesse"),
        w(
          "Your speed isn’t reduced by wearing heavy armor.",
          "Votre vitesse n’est pas réduite par le port d’une armure lourde."
        )
      ),
      darkvision,
      trait(
        w("Dwarven Resilience", "Résistance naine"),
        w(
          "Advantage on saving throws against poison, and resistance to poison damage.",
          "Vous êtes avantagé aux jets de sauvegarde contre le poison et bénéficiez de la résistance aux dégâts de poison."
        )
      ),
      trait(
        w("Dwarven Combat Training", "Entraînement martial nain"),
        w(
          "Proficiency with the battleaxe, handaxe, light hammer and warhammer.",
          "Maîtrise de la hache d’armes, de la hachette, du marteau léger et du marteau de guerre."
        )
      ),
      trait(
        w("Stonecunning", "Connaissance de la pierre"),
        w(
          "On an Intelligence (History) check about the origin of stonework, you’re proficient and add double your proficiency bonus.",
          "Lors d’un test d’Intelligence (Histoire) lié aux origines d’un travail de maçonnerie, vous avez la maîtrise et appliquez le double de votre bonus de maîtrise."
        )
      ),
      trait(
        w("Dwarven Toughness", "Ténacité naine"),
        w(
          "Your hit point maximum increases by 1, and by 1 more every level.",
          "Votre maximum de points de vie augmente de 1, et encore de 1 à chaque niveau."
        )
      ),
    ],
    weapons: ["battleaxe", "handaxe", "light-hammer", "warhammer"],
  },
  {
    boosts: { dex: 2, int: 1 },
    cantripChoice: {
      ability: "int",
      label: w("Cantrip (wizard list)", "Sort mineur (liste du magicien)"),
      list: "srd-5.1:wizard",
    },
    darkvision: 60,
    id: "srd-5.1:high-elf",
    languages: { extra: 1, known: ["common", "elvish"] },
    name: w("High Elf", "Haut-elfe"),
    sizes: ["medium"],
    skills: ["perception"],
    speed: 30,
    traits: [
      darkvision,
      trait(
        w("Keen Senses", "Sens aiguisés"),
        w(
          "Proficiency in the Perception skill.",
          "Maîtrise de la compétence Perception."
        )
      ),
      feyAncestry,
      trait(
        w("Trance", "Transe"),
        w(
          "You don’t sleep: 4 hours of meditation give you what 8 hours of sleep give a human.",
          "Vous ne dormez pas : 4 heures de méditation vous apportent ce que 8 heures de sommeil apportent à un humain."
        )
      ),
      trait(
        w("Elf Weapon Training", "Entraînement martial elfique"),
        w(
          "Proficiency with the longsword, shortsword, shortbow and longbow.",
          "Maîtrise de l’épée longue, de l’épée courte, de l’arc court et de l’arc long."
        )
      ),
      trait(
        w("Cantrip", "Sort mineur"),
        w(
          "One cantrip of your choice from the wizard spell list, cast with Intelligence.",
          "Un sort mineur de votre choix de la liste du magicien, lancé avec l’Intelligence."
        )
      ),
    ],
    weapons: ["longsword", "shortsword", "shortbow", "longbow"],
  },
  {
    boosts: { cha: 1, dex: 2 },
    id: "srd-5.1:lightfoot-halfling",
    languages: { extra: 0, known: ["common", "halfling"] },
    name: w("Lightfoot Halfling", "Halfelin pied-léger"),
    sizes: ["small"],
    speed: 25,
    traits: [
      trait(
        w("Lucky", "Chanceux"),
        w(
          "When you roll a 1 on the d20 for an attack roll, ability check or saving throw, reroll it and use the new roll.",
          "Lorsque vous obtenez un 1 sur le d20 d’un jet d’attaque, d’un test de caractéristique ou d’un jet de sauvegarde, relancez-le et gardez le second résultat."
        )
      ),
      trait(
        w("Brave", "Brave"),
        w(
          "Advantage on saving throws against being frightened.",
          "Vous êtes avantagé aux jets de sauvegarde contre l’état effrayé."
        )
      ),
      trait(
        w("Halfling Nimbleness", "Agilité halfeline"),
        w(
          "You can move through the space of any creature larger than you.",
          "Vous pouvez traverser l’espace de toute créature de taille supérieure à la vôtre."
        )
      ),
      trait(
        w("Naturally Stealthy", "Discrétion naturelle"),
        w(
          "You can try to hide when obscured only by a creature at least one size larger than you.",
          "Vous pouvez tenter de vous cacher derrière une créature d’au moins une taille de plus que vous."
        )
      ),
    ],
  },
  {
    boosts: { cha: 1, con: 1, dex: 1, int: 1, str: 1, wis: 1 },
    id: "srd-5.1:human",
    languages: { extra: 1, known: ["common"] },
    name: w("Human", "Humain"),
    sizes: ["medium"],
    speed: 30,
    traits: [
      trait(
        w("Ability Score Increase", "Augmentation de caractéristique"),
        w(
          "Your ability scores each increase by 1.",
          "Chacune de vos valeurs de caractéristique augmente de 1."
        )
      ),
    ],
  },
  {
    boosts: { cha: 1, str: 2 },
    id: "srd-5.1:dragonborn",
    languages: { extra: 0, known: ["common", "draconic"] },
    name: w("Dragonborn", "Drakéide"),
    sizes: ["medium"],
    speed: 30,
    traits: [
      trait(
        w("Breath Weapon", "Souffle"),
        w(
          "As an action, exhale your ancestry’s energy: 2d6 damage (half on a success), DC 8 + Constitution modifier + proficiency bonus. Once per short or long rest.",
          "Par une action, exhalez l’énergie de votre ascendance : 2d6 dégâts (la moitié en cas de réussite), DD 8 + modificateur de Constitution + bonus de maîtrise. Une fois par repos court ou long."
        )
      ),
      trait(
        w("Damage Resistance", "Résistance aux dégâts"),
        w(
          "Resistance to your draconic ancestry’s damage type.",
          "Résistance au type de dégâts de votre ascendance draconique."
        )
      ),
    ],
    variants: {
      label: w("Draconic Ancestry", "Ascendance draconique"),
      options: [
        dragon("black", "Black", "Noir", ACID, LINE),
        dragon("blue", "Blue", "Bleu", LIGHTNING, LINE),
        dragon("brass", "Brass", "Airain", FIRE, LINE),
        dragon("bronze", "Bronze", "Bronze", LIGHTNING, LINE),
        dragon("copper", "Copper", "Cuivre", ACID, LINE),
        dragon("gold", "Gold", "Or", FIRE, CONE_DEX),
        dragon("green", "Green", "Vert", POISON, CONE_CON),
        dragon("red", "Red", "Rouge", FIRE, CONE_DEX),
        dragon("silver", "Silver", "Argent", COLD, CONE_CON),
        dragon("white", "White", "Blanc", COLD, CONE_CON),
      ],
    },
  },
  {
    boosts: { con: 1, int: 2 },
    darkvision: 60,
    id: "srd-5.1:rock-gnome",
    languages: { extra: 0, known: ["common", "gnomish"] },
    name: w("Rock Gnome", "Gnome des roches"),
    sizes: ["small"],
    speed: 25,
    tools: ["tinkers-tools"],
    traits: [
      darkvision,
      trait(
        w("Gnome Cunning", "Ruse gnome"),
        w(
          "Advantage on all Intelligence, Wisdom and Charisma saving throws against magic.",
          "Vous êtes avantagé à tous les jets de sauvegarde d’Intelligence, de Sagesse et de Charisme contre la magie."
        )
      ),
      trait(
        w("Artificer’s Lore", "Connaissances en ingénierie"),
        w(
          "Twice your proficiency bonus on Intelligence (History) checks about magic items, alchemical objects or technological devices.",
          "Le double de votre bonus de maîtrise aux tests d’Intelligence (Histoire) relatifs aux objets magiques, alchimiques ou technologiques."
        )
      ),
      trait(
        w("Tinker", "Bricoleur"),
        w(
          "Proficiency with tinker’s tools; with 1 hour and 10 gp, build a Tiny clockwork device: a toy, a fire starter or a music box.",
          "Maîtrise des outils de bricoleur ; en 1 heure et pour 10 po, construisez un mécanisme de taille TP : jouet, boutefeu ou boîte à musique."
        )
      ),
    ],
  },
  {
    boostChoice: { count: 2, except: ["cha"] },
    boosts: { cha: 2 },
    darkvision: 60,
    id: "srd-5.1:half-elf",
    languages: { extra: 1, known: ["common", "elvish"] },
    name: w("Half-Elf", "Demi-elfe"),
    sizes: ["medium"],
    skillChoice: {
      count: 2,
      from: SKILLS,
      label: w("Skill Versatility", "Polyvalence"),
    },
    speed: 30,
    traits: [
      darkvision,
      feyAncestry,
      trait(
        w("Skill Versatility", "Polyvalence"),
        w(
          "Proficiency in two skills of your choice.",
          "Maîtrise de deux compétences de votre choix."
        )
      ),
    ],
  },
  {
    boosts: { con: 1, str: 2 },
    darkvision: 60,
    id: "srd-5.1:half-orc",
    languages: { extra: 0, known: ["common", "orc"] },
    name: w("Half-Orc", "Demi-orc"),
    sizes: ["medium"],
    skills: ["intimidation"],
    speed: 30,
    traits: [
      darkvision,
      trait(
        w("Menacing", "Menaçant"),
        w(
          "Proficiency in the Intimidation skill.",
          "Maîtrise de la compétence Intimidation."
        )
      ),
      trait(
        w("Relentless Endurance", "Acharnement"),
        w(
          "When you drop to 0 hit points but aren’t killed, you can drop to 1 instead, once per long rest.",
          "Si vous tombez à 0 point de vie sans être tué, vous pouvez vous retrouver à 1 point de vie, une fois par repos long."
        )
      ),
      trait(
        w("Savage Attacks", "Sauvagerie"),
        w(
          "On a melee weapon critical hit, roll one of the weapon’s damage dice once more and add it.",
          "Sur un coup critique d’arme au corps à corps, lancez un des dés de dégâts de l’arme une fois de plus et ajoutez-le."
        )
      ),
    ],
  },
  {
    boosts: { cha: 2, int: 1 },
    cantrips: ["srd-5.1:thaumaturgy"],
    darkvision: 60,
    id: "srd-5.1:tiefling",
    languages: { extra: 0, known: ["common", "infernal"] },
    name: w("Tiefling", "Tieffelin"),
    sizes: ["medium"],
    speed: 30,
    traits: [
      darkvision,
      trait(
        w("Hellish Resistance", "Résistance infernale"),
        w("Resistance to fire damage.", "Résistance aux dégâts de feu.")
      ),
      trait(
        w("Infernal Legacy", "Ascendance infernale"),
        w(
          "You know the thaumaturgy cantrip; hellish rebuke at level 3 and darkness at level 5, cast with Charisma.",
          "Vous connaissez le sort mineur thaumaturgie ; représailles infernales au niveau 3 et ténèbres au niveau 5, lancés avec le Charisme."
        )
      ),
    ],
  },
];

export const BACKGROUNDS_5_1: readonly Background[] = [
  {
    equipment: w(
      "Holy symbol, prayer book or prayer wheel, 5 sticks of incense, vestments, common clothes, pouch",
      "Symbole sacré, livre de prières ou moulin à prières, 5 bâtons d’encens, habits de cérémonie, habits courants, bourse"
    ),
    gear: [],
    gold: 15,
    id: "srd-5.1:acolyte",
    languages: 2,
    name: w("Acolyte", "Acolyte"),
    skills: ["insight", "religion"],
    trait: trait(
      w("Shelter of the Faithful", "Abri des croyants"),
      w(
        "Those who share your faith respect you; you and your companions get free healing and care at temples of your faith.",
        "Ceux qui partagent votre foi vous respectent ; vous et vos compagnons recevez des soins gratuits dans les temples de votre foi."
      )
    ),
  },
];

/** The languages an SRD 5.1 character picks from: the standard and exotic ones. */
export const LANGUAGES_5_1 = [
  "dwarvish",
  "elvish",
  "giant",
  "gnomish",
  "goblin",
  "halfling",
  "orc",
  "abyssal",
  "celestial",
  "draconic",
  "deep-speech",
  "infernal",
  "primordial",
  "sylvan",
  "undercommon",
] as const;
