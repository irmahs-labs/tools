import type { Trait } from "../srd/origins";
import type { Subclass } from "../srd/subclasses";
import { w } from "../words";
import type { Words } from "../words";

/**
 * SRD 5.1's one subclass per class. The Cleric, Sorcerer and Warlock take
 * theirs at level 1; the others' come later, but here every class picks one
 * at the start (a house rule) and lists its first features as text.
 */

const trait = (name: Words, text: Words): Trait => ({ name, text });

const of = (id: string) => `srd-5.1:${id}`;

export const SUBCLASSES_5_1: readonly Subclass[] = [
  {
    classId: of("barbarian"),
    features: [
      trait(
        w("Frenzy", "Frénésie"),
        w(
          "While raging, you can go into a frenzy: one more melee attack as a bonus action each turn; afterwards, one level of exhaustion.",
          "Pendant votre rage, vous pouvez entrer en frénésie : une attaque au corps à corps de plus par une action bonus à chaque tour ; ensuite, un niveau d’épuisement."
        )
      ),
    ],
    id: of("berserker"),
    name: w("Path of the Berserker", "Voie du berserker"),
  },
  {
    classId: of("bard"),
    features: [
      trait(
        w("Bonus Proficiencies", "Maîtrises supplémentaires"),
        w(
          "Proficiency with three skills of your choice.",
          "Maîtrise de trois compétences de votre choix."
        )
      ),
      trait(
        w("Cutting Words", "Mots cinglants"),
        w(
          "As a reaction, spend a Bardic Inspiration die to subtract it from a creature’s attack roll, ability check or damage roll.",
          "Par une réaction, dépensez un dé d’Inspiration bardique pour le soustraire au jet d’attaque, au test ou au jet de dégâts d’une créature."
        )
      ),
    ],
    id: of("lore"),
    name: w("College of Lore", "Collège du Savoir"),
  },
  {
    classId: of("cleric"),
    features: [
      trait(
        w("Life Domain Spells", "Sorts du domaine de la Vie"),
        w(
          "Always prepared: bless, cure wounds.",
          "Toujours préparés : bénédiction, soins."
        )
      ),
      trait(
        w("Bonus Proficiency", "Maîtrise supplémentaire"),
        w("Proficiency with heavy armor.", "Maîtrise des armures lourdes.")
      ),
      trait(
        w("Disciple of Life", "Disciple de la Vie"),
        w(
          "A healing spell of level 1 or higher restores 2 + the spell’s level more hit points.",
          "Un sort de soins du 1er niveau ou plus rend 2 + le niveau du sort points de vie de plus."
        )
      ),
    ],
    id: of("life"),
    name: w("Life Domain", "Domaine de la Vie"),
  },
  {
    classId: of("druid"),
    features: [
      trait(
        w("Bonus Cantrip", "Sort mineur supplémentaire"),
        w(
          "One more druid cantrip of your choice.",
          "Un sort mineur de druide supplémentaire de votre choix."
        )
      ),
      trait(
        w("Natural Recovery", "Ressourcement"),
        w(
          "Once a day during a short rest, recover spell slots of a combined level up to half your druid level.",
          "Une fois par jour pendant un repos court, récupérez des emplacements dont le total des niveaux vaut au plus la moitié de votre niveau de druide."
        )
      ),
    ],
    id: of("land"),
    name: w("Circle of the Land", "Cercle de la Terre"),
  },
  {
    classId: of("fighter"),
    features: [
      trait(
        w("Improved Critical", "Critique amélioré"),
        w(
          "Your weapon attacks score a critical hit on a roll of 19 or 20.",
          "Vos attaques avec une arme sont des coups critiques sur 19 ou 20."
        )
      ),
    ],
    id: of("champion"),
    name: w("Champion", "Champion"),
  },
  {
    classId: of("monk"),
    features: [
      trait(
        w("Open Hand Technique", "Technique de la Paume"),
        w(
          "When you hit with a Flurry of Blows attack, the target can be knocked prone, pushed 15 feet, or kept from taking reactions.",
          "Quand vous touchez avec une attaque de Déluge de coups, la cible peut être jetée à terre, repoussée de 4,50 m, ou privée de réactions."
        )
      ),
    ],
    id: of("open-hand"),
    name: w("Way of the Open Hand", "Voie de la Paume"),
  },
  {
    classId: of("paladin"),
    features: [
      trait(
        w("Oath Spells", "Sorts de serment"),
        w(
          "Always prepared: protection from evil and good, sanctuary.",
          "Toujours préparés : protection contre le mal et le bien, sanctuaire."
        )
      ),
      trait(
        w("Sacred Weapon", "Arme sacrée"),
        w(
          "Channel Divinity: for 1 minute, add your Charisma modifier to attack rolls with one weapon, which sheds bright light.",
          "Conduit divin : pendant 1 minute, ajoutez votre modificateur de Charisme aux jets d’attaque d’une arme, qui diffuse une lumière vive."
        )
      ),
    ],
    id: of("devotion"),
    name: w("Oath of Devotion", "Serment de Dévotion"),
  },
  {
    classId: of("ranger"),
    features: [
      trait(
        w("Hunter’s Prey", "Proie du chasseur"),
        w(
          "Pick Colossus Slayer (+1d8 once per turn on a wounded creature), Giant Killer (a reaction attack on a Large creature that attacks you) or Horde Breaker (one more attack on a creature next to your target).",
          "Choisissez Tueur de colosses (+1d8 une fois par tour contre une créature blessée), Tueur de géants (une attaque par une réaction contre une créature de taille G qui vous attaque) ou Briseur de hordes (une attaque de plus contre une créature près de votre cible)."
        )
      ),
    ],
    id: of("hunter"),
    name: w("Hunter", "Chasseur"),
  },
  {
    classId: of("rogue"),
    features: [
      trait(
        w("Fast Hands", "Mains lestes"),
        w(
          "Your bonus action can be a Dexterity (Sleight of Hand) check, using thieves’ tools, or the Use an Object action.",
          "Votre action bonus peut servir à un test de Dextérité (Escamotage), à utiliser vos outils de voleur ou à l’action Utiliser un objet."
        )
      ),
      trait(
        w("Second-Story Work", "Monte-en-l’air"),
        w(
          "Climbing costs no extra movement, and your running jumps go farther by your Dexterity modifier in feet.",
          "Grimper ne vous coûte plus de déplacement supplémentaire, et vos sauts avec élan vont plus loin grâce à votre Dextérité."
        )
      ),
    ],
    id: of("thief"),
    name: w("Thief", "Voleur"),
  },
  {
    classId: of("sorcerer"),
    features: [
      trait(
        w("Dragon Ancestor", "Ancêtre draconique"),
        w(
          "Pick a type of dragon. You speak Draconic, and your proficiency bonus is doubled on Charisma checks with dragons.",
          "Choisissez un type de dragon. Vous parlez le draconique, et votre bonus de maîtrise est doublé aux tests de Charisme face aux dragons."
        )
      ),
      trait(
        w("Draconic Resilience", "Résistance draconique"),
        w(
          "Your hit point maximum increases by 1 per sorcerer level, and without armor your AC is 13 + your Dexterity modifier.",
          "Votre maximum de points de vie augmente de 1 par niveau d’ensorceleur, et sans armure votre CA est égale à 13 + votre modificateur de Dextérité."
        )
      ),
    ],
    id: of("draconic"),
    name: w("Draconic Bloodline", "Lignée draconique"),
  },
  {
    classId: of("warlock"),
    features: [
      trait(
        w("Expanded Spell List", "Liste de sorts étendue"),
        w(
          "Burning hands and command join your warlock list.",
          "Mains brûlantes et injonction s’ajoutent à votre liste de sorts d’occultiste."
        )
      ),
      trait(
        w("Dark One’s Blessing", "Bénédiction du ténébreux"),
        w(
          "When you drop a hostile creature to 0 hit points, gain temporary hit points equal to your Charisma modifier + warlock level (at least 1).",
          "Quand vous réduisez une créature hostile à 0 point de vie, gagnez autant de points de vie temporaires que votre modificateur de Charisme + votre niveau d’occultiste (1 au moins)."
        )
      ),
    ],
    id: of("fiend"),
    name: w("The Fiend", "Le Fiélon"),
  },
  {
    classId: of("wizard"),
    features: [
      trait(
        w("Evocation Savant", "Évocateur érudit"),
        w(
          "Copying an evocation spell into your spellbook takes half the gold and time.",
          "Copier un sort d’évocation dans votre grimoire vous coûte deux fois moins d’or et de temps."
        )
      ),
      trait(
        w("Sculpt Spells", "Façonneur de sorts"),
        w(
          "When you cast an evocation spell, up to 1 + its level creatures of your choice succeed on its save and take no damage.",
          "Quand vous lancez un sort d’évocation, jusqu’à 1 + son niveau créatures de votre choix réussissent leur jet et ne subissent aucun dégât."
        )
      ),
    ],
    id: of("evocation"),
    name: w("School of Evocation", "École de l’Évocation"),
  },
];
