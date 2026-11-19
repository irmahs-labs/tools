import { w } from "../words";
import type { Words } from "../words";
import type { Trait } from "./origins";

/**
 * SRD 5.2.1's one subclass per class. The rules give a subclass at level 3;
 * here it's picked when the character is made, as a house rule, and its
 * level 3 features are listed on the sheet as text (short summaries, no
 * numbers worked out from them).
 */
export interface Subclass {
  id: string;
  /** The class it belongs to, by id. */
  classId: string;
  name: Words;
  features: readonly Trait[];
}

const trait = (name: Words, text: Words): Trait => ({ name, text });

export const SUBCLASSES: readonly Subclass[] = [
  {
    classId: "barbarian",
    features: [
      trait(
        w("Frenzy", "Frénésie"),
        w(
          "While raging, the first time you hit with a Strength attack on your turn using Reckless Attack, deal extra damage: d6s equal to your Rage Damage bonus.",
          "Pendant votre Rage, la première fois que vous touchez avec une attaque de Force à votre tour en usant de l’Attaque téméraire, infligez des d6 de dégâts en plus, autant que votre bonus de dégâts de Rage."
        )
      ),
    ],
    id: "berserker",
    name: w("Path of the Berserker", "Voie du Berserker"),
  },
  {
    classId: "bard",
    features: [
      trait(
        w("Bonus Proficiencies", "Maîtrises supplémentaires"),
        w(
          "Gain proficiency in three skills of your choice.",
          "Vous gagnez la maîtrise de trois compétences de votre choix."
        )
      ),
      trait(
        w("Cutting Words", "Mots cinglants"),
        w(
          "As a Reaction when a creature you see within 60 feet hits, succeeds on a check or deals damage, spend a Bardic Inspiration die and subtract the roll.",
          "Par une Réaction, quand une créature visible à 18 m ou moins touche, réussit un test ou inflige des dégâts, dépensez un dé d’Inspiration bardique et soustrayez-en le résultat."
        )
      ),
    ],
    id: "lore",
    name: w("College of Lore", "Collège du Savoir"),
  },
  {
    classId: "cleric",
    features: [
      trait(
        w("Disciple of Life", "Disciple de la vie"),
        w(
          "A spell that restores Hit Points restores 2 + the spell slot’s level more.",
          "Un sort qui rend des points de vie en rend 2 + le niveau de l’emplacement de plus."
        )
      ),
      trait(
        w("Life Domain Spells", "Sorts du domaine de la Vie"),
        w(
          "Always prepared: Aid, Bless, Cure Wounds, Lesser Restoration.",
          "Toujours préparés : Aide, Bénédiction, Soins, Restauration partielle."
        )
      ),
      trait(
        w("Preserve Life", "Préservation de la vie"),
        w(
          "Channel Divinity: restore Hit Points equal to five times your Cleric level, shared among Bloodied creatures within 30 feet, up to half their maximum.",
          "Conduit divin : rendez cinq fois votre niveau de Clerc en points de vie, répartis entre les créatures en Péril à 9 m ou moins, jusqu’à la moitié de leur maximum."
        )
      ),
    ],
    id: "life",
    name: w("Life Domain", "Domaine de la Vie"),
  },
  {
    classId: "druid",
    features: [
      trait(
        w("Circle of the Land Spells", "Sorts du Cercle de la Terre"),
        w(
          "Choose a land (arid, polar, temperate or tropical) after each Long Rest; its spells are always prepared.",
          "Choisissez une terre (aride, polaire, tempérée ou tropicale) après chaque Repos long ; ses sorts sont toujours préparés."
        )
      ),
      trait(
        w("Land’s Aid", "Aide de la terre"),
        w(
          "Spend a Wild Shape use to make a 10-foot sphere within 60 feet: creatures of your choice make a Constitution save or take 2d6 Necrotic damage, and one creature regains 2d6 Hit Points.",
          "Dépensez une utilisation de Forme sauvage pour une sphère de 3 m à 18 m ou moins : les créatures de votre choix font un jet de Constitution ou subissent 2d6 dégâts nécrotiques, et une créature récupère 2d6 points de vie."
        )
      ),
    ],
    id: "land",
    name: w("Circle of the Land", "Cercle de la Terre"),
  },
  {
    classId: "fighter",
    features: [
      trait(
        w("Improved Critical", "Critique amélioré"),
        w(
          "Your attacks with weapons and Unarmed Strikes score a Critical Hit on a roll of 19 or 20.",
          "Vos attaques avec une arme ou à mains nues sont des coups critiques sur 19 ou 20."
        )
      ),
      trait(
        w("Remarkable Athlete", "Athlète remarquable"),
        w(
          "Advantage on Initiative rolls and Strength (Athletics) checks; after a Critical Hit, move half your Speed without provoking Opportunity Attacks.",
          "Avantage aux jets d’Initiative et aux tests de Force (Athlétisme) ; après un coup critique, déplacez-vous de la moitié de votre Vitesse sans provoquer d’attaque d’opportunité."
        )
      ),
    ],
    id: "champion",
    name: w("Champion", "Champion"),
  },
  {
    classId: "monk",
    features: [
      trait(
        w("Open Hand Technique", "Technique de la paume"),
        w(
          "When you hit with a Flurry of Blows strike, you can also Addle, Push or Topple the target.",
          "Quand vous touchez avec un coup de Déluge de coups, vous pouvez aussi déstabiliser, repousser ou renverser la cible."
        )
      ),
    ],
    id: "open-hand",
    name: w("Warrior of the Open Hand", "Guerrier de la Paume"),
  },
  {
    classId: "paladin",
    features: [
      trait(
        w("Oath of Devotion Spells", "Sorts du Serment de dévotion"),
        w(
          "Always prepared: Protection from Evil and Good, Shield of Faith.",
          "Toujours préparés : Protection contre le mal et le bien, Bouclier de la foi."
        )
      ),
      trait(
        w("Sacred Weapon", "Arme sacrée"),
        w(
          "Channel Divinity: for 10 minutes, add your Charisma modifier to attack rolls with one weapon, which sheds Bright Light and can deal Radiant damage.",
          "Conduit divin : pendant 10 minutes, ajoutez votre modificateur de Charisme aux jets d’attaque d’une arme, qui diffuse une lumière vive et peut infliger des dégâts radiants."
        )
      ),
    ],
    id: "devotion",
    name: w("Oath of Devotion", "Serment de dévotion"),
  },
  {
    classId: "ranger",
    features: [
      trait(
        w("Hunter’s Lore", "Savoir du chasseur"),
        w(
          "While a creature is marked by your Hunter’s Mark, you know its Immunities, Resistances and Vulnerabilities.",
          "Tant qu’une créature est marquée par votre Marque du chasseur, vous connaissez ses immunités, résistances et vulnérabilités."
        )
      ),
      trait(
        w("Hunter’s Prey", "Proie du chasseur"),
        w(
          "Choose Colossus Slayer (1d8 extra damage once per turn to a creature missing Hit Points) or Horde Breaker (one more attack on a creature next to your target); change it after a rest.",
          "Choisissez Tueur de colosses (1d8 dégâts en plus une fois par tour contre une créature blessée) ou Briseur de hordes (une attaque de plus contre une créature près de votre cible) ; changez après un repos."
        )
      ),
    ],
    id: "hunter",
    name: w("Hunter", "Chasseur"),
  },
  {
    classId: "rogue",
    features: [
      trait(
        w("Fast Hands", "Mains lestes"),
        w(
          "As a Bonus Action: Sleight of Hand, use Thieves’ Tools, or take the Utilize action.",
          "Par une action Bonus : Escamotage, utiliser des outils de voleur, ou l’action Utiliser."
        )
      ),
      trait(
        w("Second-Story Work", "Monte-en-l’air"),
        w(
          "You gain a Climb Speed equal to your Speed, and jump farther using Dexterity.",
          "Vous gagnez une Vitesse d’escalade égale à votre Vitesse, et sautez plus loin grâce à la Dextérité."
        )
      ),
    ],
    id: "thief",
    name: w("Thief", "Voleur"),
  },
  {
    classId: "sorcerer",
    features: [
      trait(
        w("Draconic Resilience", "Résilience draconique"),
        w(
          "Your Hit Point maximum rises by 3, then 1 per Sorcerer level after 3. Unarmored, your Armor Class is 10 + Dexterity + Charisma.",
          "Votre maximum de points de vie augmente de 3, puis de 1 par niveau de Sorcier après le 3e. Sans armure, votre CA est 10 + Dextérité + Charisme."
        )
      ),
      trait(
        w("Draconic Spells", "Sorts draconiques"),
        w(
          "Always prepared: Alter Self, Chromatic Orb, Command, Dragon’s Breath.",
          "Toujours préparés : Modification d’apparence, Orbe chromatique, Injonction, Souffle du dragon."
        )
      ),
    ],
    id: "draconic",
    name: w("Draconic Sorcery", "Sorcellerie draconique"),
  },
  {
    classId: "warlock",
    features: [
      trait(
        w("Dark One’s Blessing", "Bénédiction du Ténébreux"),
        w(
          "When you reduce an enemy to 0 Hit Points, gain Temporary Hit Points equal to your Charisma modifier + your Warlock level (at least 1).",
          "Quand vous faites tomber un ennemi à 0 point de vie, gagnez des points de vie temporaires égaux à votre modificateur de Charisme + votre niveau de Sorcier occulte (1 au moins)."
        )
      ),
      trait(
        w("Fiend Spells", "Sorts du Fiélon"),
        w(
          "Always prepared: Burning Hands, Command, Scorching Ray, Suggestion.",
          "Toujours préparés : Mains brûlantes, Injonction, Rayon ardent, Suggestion."
        )
      ),
    ],
    id: "fiend",
    name: w("Fiend Patron", "Protecteur Fiélon"),
  },
  {
    classId: "wizard",
    features: [
      trait(
        w("Evocation Savant", "Savant de l’évocation"),
        w(
          "Add two Evocation spells of level 2 or lower to your spellbook for free, and one more each time you gain a level of spell slots.",
          "Ajoutez gratuitement deux sorts d’Évocation de niveau 2 au plus à votre grimoire, et un de plus à chaque nouveau niveau d’emplacements."
        )
      ),
      trait(
        w("Potent Cantrip", "Sort mineur puissant"),
        w(
          "When a creature succeeds on a save against your cantrip or you miss with it, it still takes half the damage.",
          "Quand une créature réussit son jet contre votre sort mineur ou que vous la ratez, elle subit quand même la moitié des dégâts."
        )
      ),
    ],
    id: "evoker",
    name: w("Evoker", "Évocateur"),
  },
];
