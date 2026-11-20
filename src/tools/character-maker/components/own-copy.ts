import type { OwnKind } from "../lib/own-packs";

/** Every word the pages for players' own packs say, in English and French. */
const en = {
  abilities: "The three abilities it raises (2024 rules)",
  abilitiesHint:
    "Leave them out for the 2014 rules, where the species gives the increases.",
  add: {
    backgrounds: "add a background",
    species: "add a species",
    spells: "add a spell",
    subclasses: "add a subclass",
  } satisfies Record<OwnKind, string>,
  addFeature: "add a feature",
  addTrait: "add a trait",
  anyGamingSet: "A gaming set of their choice",
  boostChoice: "+1 to abilities of their choice",
  boosts: "Ability increases (2014 rules)",
  boostsHint:
    "Leave them at 0 for the 2024 rules, where the background gives the increases.",
  cancel: "cancel",
  cantrip: "A cantrip it grants",
  cantripLevel: "Cantrip",
  class: "Class",
  classes: "On the spell lists of",
  count: {
    backgrounds: (n: number) => (n === 1 ? "1 background" : `${n} backgrounds`),
    species: (n: number) => `${n} species`,
    spells: (n: number) => (n === 1 ? "1 spell" : `${n} spells`),
    subclasses: (n: number) => (n === 1 ? "1 subclass" : `${n} subclasses`),
  } satisfies Record<OwnKind, (n: number) => string>,
  darkvision: "Darkvision in feet (0 for none)",
  delete: "delete",
  deleteLead:
    "It can't be undone. Export it first to import it again later, or to share it.",
  deleteTitle: (name: string) => `Delete ${name}?`,
  deleteUsedBy: (n: number) =>
    n === 1
      ? "One of your characters uses it: it keeps its choices, and finds them again if you import the pack."
      : `${n} of your characters use it: they keep their choices, and find them again if you import the pack.`,
  edit: "edit",
  empty: "Nothing yet.",
  equipment: "Equipment",
  extraLanguages: "Languages of their choice",
  feat: "Origin feat",
  feature: "Feature (2014 rules)",
  features: "Features",
  full: (max: number) =>
    `You have ${max} packs, the most this browser keeps. Delete one to make or import another.`,
  gold: "Gold pieces",
  hitPoints: "Extra Hit Points per level",
  imported: (name: string) => `The pack “${name}” is imported.`,
  importFailed: {
    damaged: "This pack file is damaged: it can't be imported.",
    exists:
      "This browser already has this pack. Delete it first to import it again.",
    newer:
      "This file comes from a newer Character Maker: reload the page and try again.",
    notPack: "That isn't a Character Maker pack file (.json).",
  },
  importPack: "import a pack",
  initiateList: "Magic Initiate's spell list",
  kinds: {
    backgrounds: "Backgrounds",
    species: "Species",
    spells: "Spells",
    subclasses: "Subclasses",
  } satisfies Record<OwnKind, string>,
  languages: "Languages they know",
  lead: "Species, backgrounds, spells and subclasses from a book you own or your own homebrew, for you and your table. They stay in this browser: export a pack to share it.",
  level: "Level",
  level1: "Level 1",
  myPacks: "Your own content",
  name: "Name",
  newPack: "new pack",
  newPackName: "My pack",
  none: "None",
  notFound: "This pack isn't in this browser.",
  packName: "Pack name",
  packSlots: (used: number, max: number) => `${used} of ${max} packs used.`,
  packTab: "Pack",
  remove: "remove",
  ritual: "Ritual",
  save: "save",
  saveHint: "Give it a name to save it.",
  size: "Size",
  sizeEither: "Medium or Small, their choice",
  sizes: { medium: "Medium", small: "Small" },
  skillChoice: "Skills of their choice",
  skills: "Skills",
  speed: "Speed in feet",
  text: "What it does",
  tool: "Tool proficiency",
  traits: "Traits",
  typedOnce:
    "Type it in your own language: the sheet shows it as you wrote it. Turn the pack on in a character's Rules, at the top of the Class step.",
  usedWith: (packs: string) => `Its pack ${packs} came with it.`,
};

export const OWN_COPY = {
  en,
  fr: {
    abilities: "Les trois caractéristiques qu’il augmente (règles 2024)",
    abilitiesHint:
      "Laissez-les vides pour les règles 2014, où l’espèce donne les augmentations.",
    add: {
      backgrounds: "ajouter un historique",
      species: "ajouter une espèce",
      spells: "ajouter un sort",
      subclasses: "ajouter une sous-classe",
    },
    addFeature: "ajouter un privilège",
    addTrait: "ajouter un trait",
    anyGamingSet: "Un jeu de son choix",
    boostChoice: "+1 à des caractéristiques de son choix",
    boosts: "Augmentations de caractéristique (règles 2014)",
    boostsHint:
      "Laissez-les à 0 pour les règles 2024, où l’historique donne les augmentations.",
    cancel: "annuler",
    cantrip: "Un sort mineur qu’elle donne",
    cantripLevel: "Sort mineur",
    class: "Classe",
    classes: "Sur les listes de sorts de",
    count: {
      backgrounds: (n: number) =>
        n === 1 ? "1 historique" : `${n} historiques`,
      species: (n: number) => (n === 1 ? "1 espèce" : `${n} espèces`),
      spells: (n: number) => (n === 1 ? "1 sort" : `${n} sorts`),
      subclasses: (n: number) =>
        n === 1 ? "1 sous-classe" : `${n} sous-classes`,
    },
    darkvision: "Vision dans le noir en pieds (0 si aucune)",
    delete: "supprimer",
    deleteLead:
      "C’est définitif. Exportez-le d’abord pour l’importer plus tard, ou le partager.",
    deleteTitle: (name: string) => `Supprimer ${name} ?`,
    deleteUsedBy: (n: number) =>
      n === 1
        ? "Un de vos personnages l’utilise : il garde ses choix, et les retrouve si vous importez le pack."
        : `${n} de vos personnages l’utilisent : ils gardent leurs choix, et les retrouvent si vous importez le pack.`,
    edit: "modifier",
    empty: "Rien pour l’instant.",
    equipment: "Équipement",
    extraLanguages: "Langues de son choix",
    feat: "Don d’origines",
    feature: "Privilège (règles 2014)",
    features: "Aptitudes",
    full: (max: number) =>
      `Vous avez ${max} packs, le maximum que ce navigateur garde. Supprimez-en un pour en créer ou en importer un autre.`,
    gold: "Pièces d’or",
    hitPoints: "Points de vie en plus par niveau",
    imported: (name: string) => `Le pack « ${name} » est importé.`,
    importFailed: {
      damaged: "Ce fichier de pack est abîmé : il ne peut pas être importé.",
      exists:
        "Ce navigateur a déjà ce pack. Supprimez-le d’abord pour l’importer de nouveau.",
      newer:
        "Ce fichier vient d’un Character Maker plus récent : rechargez la page et réessayez.",
      notPack: "Ce n’est pas un fichier de pack de Character Maker (.json).",
    },
    importPack: "importer un pack",
    initiateList: "Liste de sorts de l’Initié à la magie",
    kinds: {
      backgrounds: "Historiques",
      species: "Espèces",
      spells: "Sorts",
      subclasses: "Sous-classes",
    },
    languages: "Langues qu’il connaît",
    lead: "Des espèces, historiques, sorts et sous-classes d’un livre que vous avez ou de votre création, pour vous et votre table. Ils restent dans ce navigateur : exportez un pack pour le partager.",
    level: "Niveau",
    level1: "Niveau 1",
    myPacks: "Votre contenu",
    name: "Nom",
    newPack: "nouveau pack",
    newPackName: "Mon pack",
    none: "Aucun",
    notFound: "Ce pack n’est pas dans ce navigateur.",
    packName: "Nom du pack",
    packSlots: (used: number, max: number) =>
      `${used} pack${used > 1 ? "s" : ""} sur ${max}.`,
    packTab: "Pack",
    remove: "retirer",
    ritual: "Rituel",
    save: "enregistrer",
    saveHint: "Donnez-lui un nom pour l’enregistrer.",
    size: "Taille",
    sizeEither: "Moyenne ou Petite, au choix",
    sizes: { medium: "Moyenne (M)", small: "Petite (P)" },
    skillChoice: "Compétences de son choix",
    skills: "Compétences",
    speed: "Vitesse en pieds",
    text: "Ce qu’il fait",
    tool: "Maîtrise d’outil",
    traits: "Traits",
    typedOnce:
      "Écrivez-le dans votre langue : la fiche l’affiche tel quel. Activez le pack dans les Règles d’un personnage, en haut de l’étape Classe.",
    usedWith: (packs: string) => `Son pack ${packs} est venu avec lui.`,
  } satisfies typeof en,
};
