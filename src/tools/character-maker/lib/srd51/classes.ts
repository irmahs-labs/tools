import type { ClassInfo, FightingStyle } from "../srd/classes";
import { SKILLS } from "../srd/core";
import type { Trait } from "../srd/origins";
import { w } from "../words";
import type { Words } from "../words";

/**
 * SRD 5.1, "Classes": each class's proficiencies, level 1 features and
 * starting equipment, in the words of the English SRD 5.1 and its official
 * French translation (feature texts are short summaries). Where the SRD 5.1
 * gives a choice of items, package A takes the first ones and package B the
 * others. There is no starting gold: the SRD 5.1 puts a pouch in the gear.
 */

const trait = (name: Words, text: Words): Trait => ({ name, text });

const SPELLCASTING = (en: string, fr: string) =>
  trait(w("Spellcasting", "Sorts"), w(en, fr));

const pack = (gear: readonly string[], en: string, fr: string) => ({
  gear,
  gold: 0,
  text: w(en, fr),
});

const SIMPLE = w("Simple weapons", "Armes courantes");

const SIMPLE_MARTIAL = w(
  "Simple and martial weapons",
  "Armes courantes, armes de guerre"
);

const NONE = w("None", "Aucune");
const LIGHT = w("Light armor", "Armures légères");

const LIGHT_MEDIUM_SHIELD = w(
  "Light and medium armor, shields",
  "Armures légères et intermédiaires, boucliers"
);

const ALL_ARMOR = w("All armor, shields", "Toutes les armures, boucliers");

/** The Rogue's and the Bard's weapons. */
const FINESSE_WEAPONS = [
  "simple",
  "hand-crossbow",
  "longsword",
  "rapier",
  "shortsword",
] as const;

/** The Sorcerer's and the Wizard's weapons. */
const CASTER_WEAPONS = [
  "dagger",
  "dart",
  "sling",
  "quarterstaff",
  "light-crossbow",
] as const;

export const CLASSES_5_1: readonly ClassInfo[] = [
  {
    armor: { light: true, medium: true, shield: true },
    armorText: LIGHT_MEDIUM_SHIELD,
    features: [
      trait(
        w("Rage", "Rage"),
        w(
          "2 rages per long rest, as a bonus action, without heavy armor: advantage on Strength checks and saves, +2 damage on Strength melee attacks, resistance to bludgeoning, piercing and slashing damage. 1 minute; no spells.",
          "2 rages par repos long, par une action bonus, sans armure lourde : avantage aux tests et jets de sauvegarde de Force, +2 aux dégâts des attaques au corps à corps de Force, résistance aux dégâts contondants, perforants et tranchants. 1 minute ; pas de sorts."
        )
      ),
      trait(
        w("Unarmored Defense", "Défense sans armure"),
        w(
          "Without armor, your AC is 10 + Dexterity + Constitution modifiers; a shield still counts.",
          "Sans armure, votre CA est égale à 10 + modificateurs de Dextérité et de Constitution ; un bouclier compte toujours."
        )
      ),
    ],
    hitDie: 12,
    id: "srd-5.1:barbarian",
    martial: "all",
    name: w("Barbarian", "Barbare"),
    packages: [
      pack(
        ["greataxe", "handaxe", "javelin"],
        "Greataxe, two handaxes, explorer’s pack, four javelins",
        "Hache à deux mains, deux hachettes, paquetage d’explorateur, quatre javelines"
      ),
      pack(
        ["battleaxe", "spear", "javelin"],
        "A martial melee weapon (battleaxe), a simple weapon (spear), explorer’s pack, four javelins",
        "Une arme de guerre de corps à corps (hache d’armes), une arme courante (lance), paquetage d’explorateur, quatre javelines"
      ),
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
    weapons: SIMPLE_MARTIAL,
  },
  {
    armor: { light: true },
    armorText: LIGHT,
    features: [
      SPELLCASTING(
        "2 cantrips and 4 spells known from the bard list, cast with Charisma; 2 level 1 slots. An instrument is your focus.",
        "2 sorts mineurs et 4 sorts connus de la liste du barde, lancés avec le Charisme ; 2 emplacements du 1er niveau. Un instrument sert de focaliseur."
      ),
      trait(
        w("Bardic Inspiration", "Inspiration bardique"),
        w(
          "As a bonus action, give a creature within 60 feet a d6 to add to one ability check, attack roll or save in the next 10 minutes. Charisma modifier uses (at least 1) per long rest.",
          "Par une action bonus, donnez à une créature à 18 m ou moins un d6 à ajouter à un test, un jet d’attaque ou de sauvegarde dans les 10 minutes. Autant d’utilisations que votre modificateur de Charisme (1 au moins) par repos long."
        )
      ),
    ],
    hitDie: 8,
    id: "srd-5.1:bard",
    martial: "none",
    name: w("Bard", "Barde"),
    packages: [
      pack(
        ["rapier", "leather", "dagger"],
        "Rapier, diplomat’s pack, lute, leather armor, dagger",
        "Rapière, paquetage de diplomate, luth, armure de cuir, dague"
      ),
      pack(
        ["longsword", "leather", "dagger"],
        "Longsword, entertainer’s pack, a musical instrument of your choice, leather armor, dagger",
        "Épée longue, paquetage d’artiste, un instrument de musique au choix, armure de cuir, dague"
      ),
    ],
    primary: ["cha"],
    saves: ["dex", "cha"],
    skills: { count: 3, from: SKILLS },
    spellcasting: { ability: "cha", cantrips: 2, prepared: 4, slots: 2 },
    toolChoice: { count: 3, from: "instrument" },
    weaponList: FINESSE_WEAPONS,
    weapons: w(
      "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
      "Armes courantes, arbalètes de poing, épées longues, rapières, épées courtes"
    ),
  },
  {
    armor: { light: true, medium: true, shield: true },
    armorText: LIGHT_MEDIUM_SHIELD,
    features: [
      SPELLCASTING(
        "3 cantrips; prepare Wisdom modifier + 1 spells (at least 1) from the cleric list each day, cast with Wisdom; 2 level 1 slots. A holy symbol is your focus.",
        "3 sorts mineurs ; préparez chaque jour modificateur de Sagesse + 1 sorts (1 au moins) de la liste du clerc, lancés avec la Sagesse ; 2 emplacements du 1er niveau. Un symbole sacré sert de focaliseur."
      ),
      trait(
        w("Divine Domain", "Domaine divin"),
        w(
          "Your domain, picked at level 1, gives you its domain spells and features.",
          "Votre domaine, choisi au niveau 1, vous donne ses sorts de domaine et ses aptitudes."
        )
      ),
    ],
    hitDie: 8,
    id: "srd-5.1:cleric",
    martial: "none",
    name: w("Cleric", "Clerc"),
    packages: [
      pack(
        ["mace", "scale-mail", "light-crossbow", "shield"],
        "Mace, scale mail, light crossbow and 20 bolts, priest’s pack, shield, holy symbol",
        "Masse d’armes, armure d’écailles, arbalète légère et 20 carreaux, paquetage d’ecclésiastique, bouclier, symbole sacré"
      ),
      pack(
        ["mace", "leather", "spear", "shield"],
        "Mace, leather armor, a simple weapon (spear), explorer’s pack, shield, holy symbol",
        "Masse d’armes, armure de cuir, une arme courante (lance), paquetage d’explorateur, bouclier, symbole sacré"
      ),
    ],
    primary: ["wis"],
    saves: ["wis", "cha"],
    skills: {
      count: 2,
      from: ["history", "insight", "medicine", "persuasion", "religion"],
    },
    spellcasting: {
      ability: "wis",
      cantrips: 3,
      prepared: 0,
      preparedFromAbility: true,
      slots: 2,
    },
    weapons: SIMPLE,
  },
  {
    armor: { light: true, medium: true, shield: true },
    armorText: w(
      "Light and medium armor, shields (not made of metal)",
      "Armures légères et intermédiaires, boucliers (pas en métal)"
    ),
    features: [
      trait(
        w("Druidic", "Druidique"),
        w(
          "You know Druidic, the secret language of druids.",
          "Vous connaissez le druidique, la langue secrète des druides."
        )
      ),
      SPELLCASTING(
        "2 cantrips; prepare Wisdom modifier + 1 spells (at least 1) from the druid list each day, cast with Wisdom; 2 level 1 slots. A druidic focus is your focus.",
        "2 sorts mineurs ; préparez chaque jour modificateur de Sagesse + 1 sorts (1 au moins) de la liste du druide, lancés avec la Sagesse ; 2 emplacements du 1er niveau. Un focaliseur druidique sert de focaliseur."
      ),
    ],
    hitDie: 8,
    id: "srd-5.1:druid",
    languages: { extra: 0, known: ["druidic"] },
    martial: "none",
    name: w("Druid", "Druide"),
    packages: [
      pack(
        ["shield", "scimitar", "leather"],
        "Wooden shield, scimitar, leather armor, explorer’s pack, druidic focus",
        "Bouclier en bois, cimeterre, armure de cuir, paquetage d’explorateur, focaliseur druidique"
      ),
      pack(
        ["quarterstaff", "spear", "leather"],
        "A simple weapon (quarterstaff), a simple melee weapon (spear), leather armor, explorer’s pack, druidic focus",
        "Une arme courante (bâton), une arme courante de corps à corps (lance), armure de cuir, paquetage d’explorateur, focaliseur druidique"
      ),
    ],
    primary: ["wis"],
    saves: ["int", "wis"],
    skills: {
      count: 2,
      from: [
        "arcana",
        "animal-handling",
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
      cantrips: 2,
      prepared: 0,
      preparedFromAbility: true,
      slots: 2,
    },
    tools: ["herbalism-kit"],
    weaponList: [
      "club",
      "dagger",
      "dart",
      "javelin",
      "mace",
      "quarterstaff",
      "scimitar",
      "sickle",
      "sling",
      "spear",
    ],
    weapons: w(
      "Clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears",
      "Gourdins, dagues, fléchettes, javelines, masses d’armes, bâtons, cimeterres, serpes, frondes, lances"
    ),
  },
  {
    armor: { heavy: true, light: true, medium: true, shield: true },
    armorText: ALL_ARMOR,
    features: [
      trait(
        w("Fighting Style", "Style de combat"),
        w(
          "A style of fighting as your specialty.",
          "Un style de combat comme spécialité."
        )
      ),
      trait(
        w("Second Wind", "Second souffle"),
        w(
          "Once per short or long rest, as a bonus action, regain 1d10 + your fighter level hit points.",
          "Une fois par repos court ou long, par une action bonus, récupérez 1d10 + votre niveau de guerrier en points de vie."
        )
      ),
    ],
    fightingStyle: true,
    hitDie: 10,
    id: "srd-5.1:fighter",
    martial: "all",
    name: w("Fighter", "Guerrier"),
    packages: [
      pack(
        ["chain-mail", "longsword", "shield", "light-crossbow"],
        "Chain mail, a martial weapon (longsword) and a shield, light crossbow and 20 bolts, dungeoneer’s pack",
        "Cotte de mailles, une arme de guerre (épée longue) et un bouclier, arbalète légère et 20 carreaux, paquetage d’exploration souterraine"
      ),
      pack(
        ["leather", "longbow", "greatsword", "battleaxe", "handaxe"],
        "Leather armor, longbow and 20 arrows, two martial weapons (greatsword, battleaxe), two handaxes, explorer’s pack",
        "Armure de cuir, arc long et 20 flèches, deux armes de guerre (épée à deux mains, hache d’armes), deux hachettes, paquetage d’explorateur"
      ),
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
        "perception",
        "survival",
      ],
    },
    weapons: SIMPLE_MARTIAL,
  },
  {
    armor: {},
    armorText: NONE,
    features: [
      trait(
        w("Unarmored Defense", "Défense sans armure"),
        w(
          "Without armor or shield, your AC is 10 + Dexterity + Wisdom modifiers.",
          "Sans armure ni bouclier, votre CA est égale à 10 + modificateurs de Dextérité et de Sagesse."
        )
      ),
      trait(
        w("Martial Arts", "Arts martiaux"),
        w(
          "Unarmed or with monk weapons: Dexterity for attacks and damage, a d4 for damage, and an unarmed strike as a bonus action after the Attack action.",
          "À mains nues ou avec une arme de moine : Dextérité pour l’attaque et les dégâts, un d4 de dégâts, et une attaque à mains nues par une action bonus après l’action Attaquer."
        )
      ),
    ],
    hitDie: 8,
    id: "srd-5.1:monk",
    martial: "none",
    martialArtsDie: "1d4",
    name: w("Monk", "Moine"),
    packages: [
      pack(
        ["shortsword", "dart"],
        "Shortsword, dungeoneer’s pack, 10 darts",
        "Épée courte, paquetage d’exploration souterraine, 10 fléchettes"
      ),
      pack(
        ["spear", "dart"],
        "A simple weapon (spear), explorer’s pack, 10 darts",
        "Une arme courante (lance), paquetage d’explorateur, 10 fléchettes"
      ),
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
    weaponList: ["simple", "shortsword"],
    weapons: w("Simple weapons, shortswords", "Armes courantes, épées courtes"),
  },
  {
    armor: { heavy: true, light: true, medium: true, shield: true },
    armorText: ALL_ARMOR,
    features: [
      trait(
        w("Divine Sense", "Perception divine"),
        w(
          "As an action, sense celestials, fiends and undead within 60 feet until your next turn. 1 + Charisma modifier uses per long rest.",
          "Par une action, percevez les célestes, fiélons et morts-vivants à 18 m ou moins jusqu’à votre prochain tour. 1 + modificateur de Charisme utilisations par repos long."
        )
      ),
      trait(
        w("Lay on Hands", "Imposition des mains"),
        w(
          "A pool of 5 hit points per long rest: touch a creature to restore them, or spend 5 to cure a disease or neutralize a poison.",
          "Une réserve de 5 points de vie par repos long : touchez une créature pour les lui rendre, ou dépensez-en 5 pour guérir une maladie ou neutraliser un poison."
        )
      ),
    ],
    hitDie: 10,
    id: "srd-5.1:paladin",
    martial: "all",
    name: w("Paladin", "Paladin"),
    packages: [
      pack(
        ["longsword", "shield", "javelin", "chain-mail"],
        "A martial weapon (longsword) and a shield, five javelins, priest’s pack, chain mail, holy symbol",
        "Une arme de guerre (épée longue) et un bouclier, cinq javelines, paquetage d’ecclésiastique, cotte de mailles, symbole sacré"
      ),
      pack(
        ["greatsword", "warhammer", "mace", "chain-mail"],
        "Two martial weapons (greatsword, warhammer), a simple melee weapon (mace), explorer’s pack, chain mail, holy symbol",
        "Deux armes de guerre (épée à deux mains, marteau de guerre), une arme courante de corps à corps (masse d’armes), paquetage d’explorateur, cotte de mailles, symbole sacré"
      ),
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
    weapons: SIMPLE_MARTIAL,
  },
  {
    armor: { light: true, medium: true, shield: true },
    armorText: LIGHT_MEDIUM_SHIELD,
    features: [
      trait(
        w("Favored Enemy", "Ennemi juré"),
        w(
          "A type of creature you know well: advantage on Wisdom (Survival) checks to track them and Intelligence checks to recall information about them, and one of their languages.",
          "Un type de créature que vous connaissez bien : avantage aux tests de Sagesse (Survie) pour le pister et d’Intelligence pour vous souvenir d’informations à son sujet, et une de ses langues."
        )
      ),
      trait(
        w("Natural Explorer", "Explorateur-né"),
        w(
          "A favored terrain: double proficiency on Intelligence and Wisdom checks about it, and your group travels it safely and swiftly.",
          "Un environnement de prédilection : maîtrise doublée aux tests d’Intelligence et de Sagesse qui s’y rapportent, et votre groupe s’y déplace en sécurité et rapidement."
        )
      ),
    ],
    hitDie: 10,
    id: "srd-5.1:ranger",
    martial: "all",
    name: w("Ranger", "Rôdeur"),
    packages: [
      pack(
        ["scale-mail", "shortsword", "longbow"],
        "Scale mail, two shortswords, dungeoneer’s pack, longbow and a quiver of 20 arrows",
        "Armure d’écailles, deux épées courtes, paquetage d’exploration souterraine, arc long et carquois de 20 flèches"
      ),
      pack(
        ["leather", "handaxe", "spear", "longbow"],
        "Leather armor, two simple melee weapons (handaxe, spear), explorer’s pack, longbow and a quiver of 20 arrows",
        "Armure de cuir, deux armes courantes de corps à corps (hachette, lance), paquetage d’explorateur, arc long et carquois de 20 flèches"
      ),
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
          "Double proficiency bonus for two of your skill proficiencies (or one and thieves’ tools).",
          "Bonus de maîtrise doublé pour deux de vos compétences maîtrisées (ou une et les outils de voleur)."
        )
      ),
      trait(
        w("Sneak Attack", "Attaque sournoise"),
        w(
          "Once per turn, +1d6 damage on a hit with a finesse or ranged weapon when you have advantage, or an ally is next to the target.",
          "Une fois par tour, +1d6 dégâts quand vous touchez avec une arme de finesse ou à distance si vous êtes avantagé, ou si un allié est au contact de la cible."
        )
      ),
      trait(
        w("Thieves’ Cant", "Argot des voleurs"),
        w(
          "A secret mix of dialect, jargon and code for hidden messages.",
          "Un mélange secret de dialecte, de jargon et de codes pour des messages cachés."
        )
      ),
    ],
    hitDie: 8,
    id: "srd-5.1:rogue",
    languages: { extra: 0, known: ["thieves-cant"] },
    martial: "none",
    name: w("Rogue", "Roublard"),
    packages: [
      pack(
        ["rapier", "shortbow", "leather", "dagger", "dagger"],
        "Rapier, shortbow and a quiver of 20 arrows, burglar’s pack, leather armor, two daggers, thieves’ tools",
        "Rapière, arc court et carquois de 20 flèches, paquetage de cambrioleur, armure de cuir, deux dagues, outils de voleur"
      ),
      pack(
        ["shortsword", "leather", "dagger", "dagger"],
        "Two shortswords, dungeoneer’s pack, leather armor, two daggers, thieves’ tools",
        "Deux épées courtes, paquetage d’exploration souterraine, armure de cuir, deux dagues, outils de voleur"
      ),
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
        "performance",
        "persuasion",
        "sleight-of-hand",
        "stealth",
      ],
    },
    tools: ["thieves-tools"],
    weaponList: FINESSE_WEAPONS,
    weapons: w(
      "Simple weapons, hand crossbows, longswords, rapiers, shortswords",
      "Armes courantes, arbalètes de poing, épées longues, rapières, épées courtes"
    ),
  },
  {
    armor: {},
    armorText: NONE,
    features: [
      SPELLCASTING(
        "4 cantrips and 2 spells known from the sorcerer list, cast with Charisma; 2 level 1 slots. An arcane focus is your focus.",
        "4 sorts mineurs et 2 sorts connus de la liste de l’ensorceleur, lancés avec le Charisme ; 2 emplacements du 1er niveau. Un focaliseur arcanique sert de focaliseur."
      ),
      trait(
        w("Sorcerous Origin", "Origine magique"),
        w(
          "Where your innate magic comes from, picked at level 1.",
          "La source de votre magie innée, choisie au niveau 1."
        )
      ),
    ],
    hitDie: 6,
    id: "srd-5.1:sorcerer",
    martial: "none",
    name: w("Sorcerer", "Ensorceleur"),
    packages: [
      pack(
        ["light-crossbow", "dagger", "dagger"],
        "Light crossbow and 20 bolts, component pouch, dungeoneer’s pack, two daggers",
        "Arbalète légère et 20 carreaux, sacoche à composantes, paquetage d’exploration souterraine, deux dagues"
      ),
      pack(
        ["quarterstaff", "dagger", "dagger"],
        "A simple weapon (quarterstaff), arcane focus, explorer’s pack, two daggers",
        "Une arme courante (bâton), focaliseur arcanique, paquetage d’explorateur, deux dagues"
      ),
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
    weaponList: CASTER_WEAPONS,
    weapons: w(
      "Daggers, darts, slings, quarterstaffs, light crossbows",
      "Dagues, fléchettes, frondes, bâtons, arbalètes légères"
    ),
  },
  {
    armor: { light: true },
    armorText: LIGHT,
    features: [
      trait(
        w("Otherworldly Patron", "Protecteur d’outre-monde"),
        w(
          "The being you made a pact with, picked at level 1.",
          "L’entité avec laquelle vous avez conclu un pacte, choisie au niveau 1."
        )
      ),
      trait(
        w("Pact Magic", "Magie de pacte"),
        w(
          "2 cantrips and 2 spells known from the warlock list, cast with Charisma; 1 level 1 slot, regained on a short or long rest.",
          "2 sorts mineurs et 2 sorts connus de la liste de l’occultiste, lancés avec le Charisme ; 1 emplacement du 1er niveau, récupéré après un repos court ou long."
        )
      ),
    ],
    hitDie: 8,
    id: "srd-5.1:warlock",
    martial: "none",
    name: w("Warlock", "Occultiste"),
    packages: [
      pack(
        ["light-crossbow", "leather", "spear", "dagger", "dagger"],
        "Light crossbow and 20 bolts, component pouch, scholar’s pack, leather armor, a simple weapon (spear), two daggers",
        "Arbalète légère et 20 carreaux, sacoche à composantes, paquetage d’érudit, armure de cuir, une arme courante (lance), deux dagues"
      ),
      pack(
        ["quarterstaff", "leather", "mace", "dagger", "dagger"],
        "A simple weapon (quarterstaff), arcane focus, dungeoneer’s pack, leather armor, a simple weapon (mace), two daggers",
        "Une arme courante (bâton), focaliseur arcanique, paquetage d’exploration souterraine, armure de cuir, une arme courante (masse d’armes), deux dagues"
      ),
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
        "3 cantrips; a spellbook of 6 wizard spells, from which you prepare Intelligence modifier + 1 (at least 1) each day, cast with Intelligence; 2 level 1 slots.",
        "3 sorts mineurs ; un grimoire de 6 sorts de magicien, dont vous préparez chaque jour modificateur d’Intelligence + 1 (1 au moins), lancés avec l’Intelligence ; 2 emplacements du 1er niveau."
      ),
      trait(
        w("Arcane Recovery", "Restauration magique"),
        w(
          "Once a day after a short rest, recover a level 1 spell slot.",
          "Une fois par jour après un repos court, récupérez un emplacement du 1er niveau."
        )
      ),
    ],
    hitDie: 6,
    id: "srd-5.1:wizard",
    martial: "none",
    name: w("Wizard", "Magicien"),
    packages: [
      pack(
        ["quarterstaff"],
        "Quarterstaff, component pouch, scholar’s pack, spellbook",
        "Bâton, sacoche à composantes, paquetage d’érudit, grimoire"
      ),
      pack(
        ["dagger"],
        "Dagger, arcane focus, explorer’s pack, spellbook",
        "Dague, focaliseur arcanique, paquetage d’explorateur, grimoire"
      ),
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
        "religion",
      ],
    },
    spellcasting: {
      ability: "int",
      cantrips: 3,
      prepared: 0,
      preparedFromAbility: true,
      slots: 2,
      spellbook: 6,
    },
    weaponList: CASTER_WEAPONS,
    weapons: w(
      "Daggers, darts, slings, quarterstaffs, light crossbows",
      "Dagues, fléchettes, frondes, bâtons, arbalètes légères"
    ),
  },
];

/** The Fighter's Fighting Styles in the SRD 5.1. */
export const FIGHTING_STYLES_5_1: readonly FightingStyle[] = [
  {
    id: "srd-5.1:archery",
    name: w("Archery", "Archerie"),
    rangedAttack: 2,
    text: w(
      "+2 to attack rolls with ranged weapons.",
      "+2 aux jets d’attaque avec une arme à distance."
    ),
  },
  {
    armoredAc: 1,
    id: "srd-5.1:defense",
    name: w("Defense", "Défense"),
    text: w(
      "+1 to AC while wearing armor.",
      "+1 à la CA tant que vous portez une armure."
    ),
  },
  {
    id: "srd-5.1:dueling",
    name: w("Dueling", "Duel"),
    text: w(
      "+2 damage with a melee weapon held in one hand and no other weapon.",
      "+2 aux dégâts avec une arme de corps à corps tenue d’une main, sans autre arme."
    ),
  },
  {
    id: "srd-5.1:great-weapon-fighting",
    name: w("Great Weapon Fighting", "Armes à deux mains"),
    text: w(
      "Reroll a 1 or 2 on the damage dice of a two-handed or versatile melee weapon held in two hands.",
      "Relancez un 1 ou un 2 aux dés de dégâts d’une arme de corps à corps à deux mains ou polyvalente tenue à deux mains."
    ),
  },
  {
    id: "srd-5.1:protection",
    name: w("Protection", "Protection"),
    text: w(
      "With a shield, as a reaction, impose disadvantage on an attack against a creature within 5 feet of you.",
      "Avec un bouclier, par une réaction, imposez un désavantage à une attaque contre une créature à 1,50 m de vous."
    ),
  },
  {
    id: "srd-5.1:two-weapon-fighting",
    name: w("Two-Weapon Fighting", "Combat à deux armes"),
    text: w(
      "Add your ability modifier to the damage of your second attack when fighting with two weapons.",
      "Ajoutez votre modificateur de caractéristique aux dégâts de la seconde attaque quand vous combattez avec deux armes."
    ),
  },
];
