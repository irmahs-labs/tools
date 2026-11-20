import { w } from "../words";
import type { Words } from "../words";

/** SRD 5.2.1, "Equipment": the weapons, armor and tools a level 1 character can start with or choose. */

export type DamageType = "bludgeoning" | "piercing" | "slashing";

export const DAMAGE_TYPES: Record<DamageType, Words> = {
  bludgeoning: w("Bludgeoning", "contondants"),
  piercing: w("Piercing", "perforants"),
  slashing: w("Slashing", "tranchants"),
};

export type Mastery =
  | "cleave"
  | "graze"
  | "nick"
  | "push"
  | "sap"
  | "slow"
  | "topple"
  | "vex";

export const MASTERIES: Record<Mastery, Words> = {
  cleave: w("Cleave", "Enchaînement"),
  graze: w("Graze", "Écorchure"),
  nick: w("Nick", "Coup double"),
  push: w("Push", "Poussée"),
  sap: w("Sap", "Sape"),
  slow: w("Slow", "Ralentissement"),
  topple: w("Topple", "Renversement"),
  vex: w("Vex", "Ouverture"),
};

export interface Weapon {
  id: string;
  name: Words;
  category: "simple" | "martial";
  kind: "melee" | "ranged";
  /** "1d8", or "1" for the Blowgun. */
  damage: string;
  type: DamageType;
  mastery: Mastery;
  finesse?: true;
  light?: true;
  heavy?: true;
  twoHanded?: true;
  reach?: true;
  loading?: true;
  /** The die when held in two hands. */
  versatile?: string;
  /** Normal and long range in feet, thrown or with ammunition. */
  range?: readonly [number, number];
  thrown?: true;
}

const weapon = (
  id: string,
  name: Words,
  category: Weapon["category"],
  kind: Weapon["kind"],
  damage: string,
  type: DamageType,
  mastery: Mastery,
  more: Partial<Weapon> = {}
): Weapon => ({ category, damage, id, kind, mastery, name, type, ...more });

const thrown = (near: number, far: number) =>
  ({ range: [near, far], thrown: true }) as const;

export const WEAPONS: readonly Weapon[] = [
  weapon(
    "club",
    w("Club", "Gourdin"),
    "simple",
    "melee",
    "1d4",
    "bludgeoning",
    "slow",
    { light: true }
  ),
  weapon(
    "dagger",
    w("Dagger", "Dague"),
    "simple",
    "melee",
    "1d4",
    "piercing",
    "nick",
    { finesse: true, light: true, ...thrown(20, 60) }
  ),
  weapon(
    "greatclub",
    w("Greatclub", "Massue"),
    "simple",
    "melee",
    "1d8",
    "bludgeoning",
    "push",
    { twoHanded: true }
  ),
  weapon(
    "handaxe",
    w("Handaxe", "Hachette"),
    "simple",
    "melee",
    "1d6",
    "slashing",
    "vex",
    { light: true, ...thrown(20, 60) }
  ),
  weapon(
    "javelin",
    w("Javelin", "Javeline"),
    "simple",
    "melee",
    "1d6",
    "piercing",
    "slow",
    thrown(30, 120)
  ),
  weapon(
    "light-hammer",
    w("Light Hammer", "Marteau léger"),
    "simple",
    "melee",
    "1d4",
    "bludgeoning",
    "nick",
    { light: true, ...thrown(20, 60) }
  ),
  weapon(
    "mace",
    w("Mace", "Masse d’armes"),
    "simple",
    "melee",
    "1d6",
    "bludgeoning",
    "sap"
  ),
  weapon(
    "quarterstaff",
    w("Quarterstaff", "Bâton de combat"),
    "simple",
    "melee",
    "1d6",
    "bludgeoning",
    "topple",
    { versatile: "1d8" }
  ),
  weapon(
    "sickle",
    w("Sickle", "Serpe"),
    "simple",
    "melee",
    "1d4",
    "slashing",
    "nick",
    { light: true }
  ),
  weapon(
    "spear",
    w("Spear", "Lance"),
    "simple",
    "melee",
    "1d6",
    "piercing",
    "sap",
    { versatile: "1d8", ...thrown(20, 60) }
  ),
  weapon(
    "dart",
    w("Dart", "Fléchette"),
    "simple",
    "ranged",
    "1d4",
    "piercing",
    "vex",
    { finesse: true, ...thrown(20, 60) }
  ),
  weapon(
    "light-crossbow",
    w("Light Crossbow", "Arbalète légère"),
    "simple",
    "ranged",
    "1d8",
    "piercing",
    "slow",
    { loading: true, range: [80, 320], twoHanded: true }
  ),
  weapon(
    "shortbow",
    w("Shortbow", "Arc court"),
    "simple",
    "ranged",
    "1d6",
    "piercing",
    "vex",
    { range: [80, 320], twoHanded: true }
  ),
  weapon(
    "sling",
    w("Sling", "Fronde"),
    "simple",
    "ranged",
    "1d4",
    "bludgeoning",
    "slow",
    { range: [30, 120] }
  ),
  weapon(
    "battleaxe",
    w("Battleaxe", "Hache d’armes"),
    "martial",
    "melee",
    "1d8",
    "slashing",
    "topple",
    { versatile: "1d10" }
  ),
  weapon(
    "flail",
    w("Flail", "Fléau d’armes"),
    "martial",
    "melee",
    "1d8",
    "bludgeoning",
    "sap"
  ),
  weapon(
    "glaive",
    w("Glaive", "Coutille"),
    "martial",
    "melee",
    "1d10",
    "slashing",
    "graze",
    { heavy: true, reach: true, twoHanded: true }
  ),
  weapon(
    "greataxe",
    w("Greataxe", "Hache à deux mains"),
    "martial",
    "melee",
    "1d12",
    "slashing",
    "cleave",
    { heavy: true, twoHanded: true }
  ),
  weapon(
    "greatsword",
    w("Greatsword", "Épée à deux mains"),
    "martial",
    "melee",
    "2d6",
    "slashing",
    "graze",
    { heavy: true, twoHanded: true }
  ),
  weapon(
    "halberd",
    w("Halberd", "Hallebarde"),
    "martial",
    "melee",
    "1d10",
    "slashing",
    "cleave",
    { heavy: true, reach: true, twoHanded: true }
  ),
  weapon(
    "lance",
    w("Lance", "Lance d’arçon"),
    "martial",
    "melee",
    "1d10",
    "piercing",
    "topple",
    { heavy: true, reach: true, twoHanded: true }
  ),
  weapon(
    "longsword",
    w("Longsword", "Épée longue"),
    "martial",
    "melee",
    "1d8",
    "slashing",
    "sap",
    { versatile: "1d10" }
  ),
  weapon(
    "maul",
    w("Maul", "Maillet d’armes"),
    "martial",
    "melee",
    "2d6",
    "bludgeoning",
    "topple",
    { heavy: true, twoHanded: true }
  ),
  weapon(
    "morningstar",
    w("Morningstar", "Morgenstern"),
    "martial",
    "melee",
    "1d8",
    "piercing",
    "sap"
  ),
  weapon(
    "pike",
    w("Pike", "Pique"),
    "martial",
    "melee",
    "1d10",
    "piercing",
    "push",
    { heavy: true, reach: true, twoHanded: true }
  ),
  weapon(
    "rapier",
    w("Rapier", "Rapière"),
    "martial",
    "melee",
    "1d8",
    "piercing",
    "vex",
    { finesse: true }
  ),
  weapon(
    "scimitar",
    w("Scimitar", "Cimeterre"),
    "martial",
    "melee",
    "1d6",
    "slashing",
    "nick",
    { finesse: true, light: true }
  ),
  weapon(
    "shortsword",
    w("Shortsword", "Épée courte"),
    "martial",
    "melee",
    "1d6",
    "piercing",
    "vex",
    { finesse: true, light: true }
  ),
  weapon(
    "trident",
    w("Trident", "Trident"),
    "martial",
    "melee",
    "1d8",
    "piercing",
    "topple",
    { versatile: "1d10", ...thrown(20, 60) }
  ),
  weapon(
    "warhammer",
    w("Warhammer", "Marteau de guerre"),
    "martial",
    "melee",
    "1d8",
    "bludgeoning",
    "push",
    { versatile: "1d10" }
  ),
  weapon(
    "war-pick",
    w("War Pick", "Pic de guerre"),
    "martial",
    "melee",
    "1d8",
    "piercing",
    "sap",
    { versatile: "1d10" }
  ),
  weapon(
    "whip",
    w("Whip", "Fouet"),
    "martial",
    "melee",
    "1d4",
    "slashing",
    "slow",
    { finesse: true, reach: true }
  ),
  weapon(
    "blowgun",
    w("Blowgun", "Sarbacane"),
    "martial",
    "ranged",
    "1",
    "piercing",
    "vex",
    { loading: true, range: [25, 100] }
  ),
  weapon(
    "hand-crossbow",
    w("Hand Crossbow", "Arbalète de poing"),
    "martial",
    "ranged",
    "1d6",
    "piercing",
    "vex",
    { light: true, loading: true, range: [30, 120] }
  ),
  weapon(
    "heavy-crossbow",
    w("Heavy Crossbow", "Arbalète lourde"),
    "martial",
    "ranged",
    "1d10",
    "piercing",
    "push",
    { heavy: true, loading: true, range: [100, 400], twoHanded: true }
  ),
  weapon(
    "longbow",
    w("Longbow", "Arc long"),
    "martial",
    "ranged",
    "1d8",
    "piercing",
    "slow",
    { heavy: true, range: [150, 600], twoHanded: true }
  ),
  weapon(
    "musket",
    w("Musket", "Mousquet"),
    "martial",
    "ranged",
    "1d12",
    "piercing",
    "slow",
    { loading: true, range: [40, 120], twoHanded: true }
  ),
  weapon(
    "pistol",
    w("Pistol", "Pistolet"),
    "martial",
    "ranged",
    "1d10",
    "piercing",
    "vex",
    { loading: true, range: [30, 90] }
  ),
];

export const weaponById = (id: string): Weapon | undefined =>
  WEAPONS.find((entry) => entry.id === id);

export interface Armor {
  id: string;
  name: Words;
  category: "light" | "medium" | "heavy" | "shield";
  /** The base AC, or +2 for a Shield. */
  ac: number;
  /** The most of the Dexterity modifier it adds: all for light armor, 2 for medium, none for heavy. */
  maxDex: number | null;
  stealthDisadvantage?: true;
  /** The Strength it needs before it slows the wearer by 10 feet. */
  strength?: number;
}

/** The armor in the starting equipment (Scale Mail for SRD 5.1's); the rest of the SRD's isn't sold at level 1 here. */
export const ARMORS: readonly Armor[] = [
  {
    ac: 11,
    category: "light",
    id: "leather",
    maxDex: Infinity,
    name: w("Leather Armor", "Armure de cuir"),
  },
  {
    ac: 12,
    category: "light",
    id: "studded-leather",
    maxDex: Infinity,
    name: w("Studded Leather Armor", "Armure de cuir clouté"),
  },
  {
    ac: 13,
    category: "medium",
    id: "chain-shirt",
    maxDex: 2,
    name: w("Chain Shirt", "Chemise de mailles"),
  },
  {
    ac: 14,
    category: "medium",
    id: "scale-mail",
    maxDex: 2,
    name: w("Scale Mail", "Armure d’écailles"),
    stealthDisadvantage: true,
  },
  {
    ac: 16,
    category: "heavy",
    id: "chain-mail",
    maxDex: 0,
    name: w("Chain Mail", "Cotte de mailles"),
    stealthDisadvantage: true,
    strength: 13,
  },
  {
    ac: 2,
    category: "shield",
    id: "shield",
    maxDex: null,
    name: w("Shield", "Bouclier"),
  },
];

export const armorById = (id: string): Armor | undefined =>
  ARMORS.find((entry) => entry.id === id);

/** Artisan's Tools, one of which a background or the Monk may give. */
export const ARTISAN_TOOLS: readonly { id: string; name: Words }[] = [
  {
    id: "alchemists-supplies",
    name: w("Alchemist’s Supplies", "Matériel d’alchimiste"),
  },
  {
    id: "brewers-supplies",
    name: w("Brewer’s Supplies", "Matériel de brasseur"),
  },
  {
    id: "calligraphers-supplies",
    name: w("Calligrapher’s Supplies", "Matériel de calligraphe"),
  },
  {
    id: "carpenters-tools",
    name: w("Carpenter’s Tools", "Outils de charpentier"),
  },
  {
    id: "cartographers-tools",
    name: w("Cartographer’s Tools", "Outils de cartographe"),
  },
  { id: "cobblers-tools", name: w("Cobbler’s Tools", "Outils de cordonnier") },
  {
    id: "cooks-utensils",
    name: w("Cook’s Utensils", "Ustensiles de cuisinier"),
  },
  {
    id: "glassblowers-tools",
    name: w("Glassblower’s Tools", "Outils de souffleur de verre"),
  },
  { id: "jewelers-tools", name: w("Jeweler’s Tools", "Outils de joaillier") },
  {
    id: "leatherworkers-tools",
    name: w("Leatherworker’s Tools", "Outils de tanneur"),
  },
  { id: "masons-tools", name: w("Mason’s Tools", "Outils de maçon") },
  {
    id: "painters-supplies",
    name: w("Painter’s Supplies", "Matériel de peintre"),
  },
  { id: "potters-tools", name: w("Potter’s Tools", "Outils de potier") },
  { id: "smiths-tools", name: w("Smith’s Tools", "Outils de forgeron") },
  { id: "tinkers-tools", name: w("Tinker’s Tools", "Outils de bricoleur") },
  { id: "weavers-tools", name: w("Weaver’s Tools", "Outils de tisserand") },
  {
    id: "woodcarvers-tools",
    name: w("Woodcarver’s Tools", "Outils de menuisier"),
  },
];

export const INSTRUMENTS: readonly { id: string; name: Words }[] = [
  { id: "bagpipes", name: w("Bagpipes", "Cornemuse") },
  { id: "drum", name: w("Drum", "Tambour") },
  { id: "dulcimer", name: w("Dulcimer", "Tympanon") },
  { id: "flute", name: w("Flute", "Flûte") },
  { id: "horn", name: w("Horn", "Cor") },
  { id: "lute", name: w("Lute", "Luth") },
  { id: "lyre", name: w("Lyre", "Lyre") },
  { id: "pan-flute", name: w("Pan Flute", "Flûte de pan") },
  { id: "shawm", name: w("Shawm", "Chalemie") },
  { id: "viol", name: w("Viol", "Viole") },
];

export const GAMING_SETS: readonly { id: string; name: Words }[] = [
  { id: "dice", name: w("Dice", "Dés") },
  { id: "dragonchess", name: w("Dragonchess", "Échecs draconiques") },
  { id: "playing-cards", name: w("Playing Cards", "Cartes à jouer") },
  { id: "three-dragon-ante", name: w("Three-Dragon Ante", "Jeu des dragons") },
];

/** Every other tool a feature names, by id. */
export const OTHER_TOOLS: readonly { id: string; name: Words }[] = [
  { id: "herbalism-kit", name: w("Herbalism Kit", "Matériel d’herboriste") },
  { id: "thieves-tools", name: w("Thieves’ Tools", "Outils de voleur") },
  { id: "disguise-kit", name: w("Disguise Kit", "Accessoires de déguisement") },
  { id: "forgery-kit", name: w("Forgery Kit", "Matériel de contrefaçon") },
  {
    id: "navigators-tools",
    name: w("Navigator’s Tools", "Instruments de navigateur"),
  },
  { id: "poisoners-kit", name: w("Poisoner’s Kit", "Matériel d’empoisonneur") },
];

const ALL_TOOLS = [
  ...ARTISAN_TOOLS,
  ...INSTRUMENTS.map((tool) => ({
    ...tool,
    name: w(tool.name.en, tool.name.fr),
  })),
  ...GAMING_SETS,
  ...OTHER_TOOLS,
];

export const toolName = (id: string): Words =>
  ALL_TOOLS.find((tool) => tool.id === id)?.name ?? w(id, id);
