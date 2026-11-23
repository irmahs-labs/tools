import type { Dish, SceneId } from "./dish";

/**
 * Pokémon Sleep's recipes, from serebii.net/pokemonsleep/dishes.shtml
 * (checked 2026-11-23), without the "Mixed" dishes, which have no recipe.
 * Ingredients are the real food behind each game name ("Fancy Apple" is
 * apple), and the amounts are left out; Slowpoke tail has no real one.
 */
const GAME_NAMES = {
  "Bean Sausage": "sausage",
  "Fancy Apple": "apple",
  "Fancy Egg": "egg",
  "Fiery Herb": "chili",
  "Glossy Avocado": "avocado",
  "Greengrass Corn": "corn",
  "Greengrass Soybeans": "soybeans",
  Honey: "honey",
  "Large Leek": "leek",
  "Moomoo Milk": "milk",
  "Plump Pumpkin": "pumpkin",
  "Pure Oil": "oil",
  "Rousing Coffee": "coffee",
  "Slowpoke Tail": "Slowpoke tail",
  "Snackable Nuts": "nuts",
  "Snoozy Tomato": "tomato",
  "Soft Potato": "potato",
  "Soothing Cacao": "cacao",
  "Tasty Mushroom": "mushroom",
  "Warming Ginger": "ginger",
} satisfies Record<string, string>;

const isGameName = (name: string): name is keyof typeof GAME_NAMES =>
  Object.hasOwn(GAME_NAMES, name);

/** The real food behind a game ingredient's name. */
export const realIngredient = (gameName: string): string => {
  if (!isGameName(gameName)) {
    throw new Error(`No real ingredient for ${gameName}`);
  }

  return GAME_NAMES[gameName];
};

const ps =
  (scene: SceneId) =>
  (name: string, ingredients: string): Dish => ({
    cook: "",
    ingredients: ingredients.split(", ").map(realIngredient),
    name,
    scene,
    source: "pokemon-sleep",
  });

const curry = ps("ps-curry");
const salad = ps("ps-salad");
const dessert = ps("ps-dessert");

export const POKEMON_SLEEP: readonly Dish[] = [
  curry("Fancy Apple Curry", "Fancy Apple"),
  curry("Grilled Tail Curry", "Slowpoke Tail, Fiery Herb"),
  curry("Solar Power Tomato Curry", "Snoozy Tomato, Fiery Herb"),
  curry(
    "Dream Eater Butter Curry",
    "Soft Potato, Snoozy Tomato, Soothing Cacao, Moomoo Milk"
  ),
  curry("Spicy Leek Curry", "Large Leek, Warming Ginger, Fiery Herb"),
  curry("Spore Mushroom Curry", "Tasty Mushroom, Soft Potato"),
  curry("Egg Bomb Curry", "Honey, Fancy Apple, Fancy Egg, Soft Potato"),
  curry("Hearty Cheeseburger Curry", "Moomoo Milk, Bean Sausage"),
  curry("Soft Potato Chowder", "Moomoo Milk, Soft Potato, Tasty Mushroom"),
  curry("Simple Chowder", "Moomoo Milk"),
  curry("Beanburger Curry", "Bean Sausage"),
  curry("Mild Honey Curry", "Honey"),
  curry(
    "Ninja Curry",
    "Greengrass Soybeans, Bean Sausage, Large Leek, Tasty Mushroom"
  ),
  curry("Drought Katsu Curry", "Bean Sausage, Pure Oil"),
  curry("Melty Omelette Curry", "Fancy Egg, Snoozy Tomato"),
  curry(
    "Bulk Up Bean Curry",
    "Greengrass Soybeans, Bean Sausage, Fiery Herb, Fancy Egg"
  ),
  curry("Limber Corn Stew", "Greengrass Corn, Moomoo Milk, Soft Potato"),
  curry(
    "Inferno Corn Keema Curry",
    "Fiery Herb, Bean Sausage, Greengrass Corn, Warming Ginger"
  ),
  curry("Dizzy Punch Spicy Curry", "Rousing Coffee, Fiery Herb, Honey"),
  curry(
    "Hidden Power Perk-Up Stew",
    "Greengrass Soybeans, Snoozy Tomato, Tasty Mushroom, Rousing Coffee"
  ),
  curry("Cut Sukiyaki Curry", "Large Leek, Bean Sausage, Honey, Fancy Egg"),
  curry(
    "Role Play Pumpkaboo Stew",
    "Plump Pumpkin, Bean Sausage, Soft Potato, Tasty Mushroom"
  ),
  curry(
    "Overgrow Avocado Gratin",
    "Glossy Avocado, Soft Potato, Moomoo Milk, Pure Oil"
  ),
  curry(
    "Greengrass Curry Bun",
    "Warming Ginger, Fiery Herb, Greengrass Soybeans, Pure Oil"
  ),
  curry("Bounce Curry Udon", "Warming Ginger, Tasty Mushroom, Bean Sausage"),
  curry(
    "Seed Bomb Naan and Curry",
    "Snackable Nuts, Plump Pumpkin, Greengrass Corn"
  ),

  salad("Slowpoke Tail Pepper Salad", "Slowpoke Tail, Fiery Herb, Pure Oil"),
  salad("Spore Mushroom Salad", "Tasty Mushroom, Snoozy Tomato, Pure Oil"),
  salad("Snow Cloak Caesar Salad", "Moomoo Milk, Bean Sausage"),
  salad(
    "Gluttony Potato Salad",
    "Soft Potato, Fancy Egg, Bean Sausage, Fancy Apple"
  ),
  salad("Water Veil Tofu Salad", "Greengrass Soybeans, Snoozy Tomato"),
  salad(
    "Superpower Extreme Salad",
    "Bean Sausage, Warming Ginger, Fancy Egg, Soft Potato"
  ),
  salad("Bean Ham Salad", "Bean Sausage"),
  salad("Snoozy Tomato Salad", "Snoozy Tomato"),
  salad("Moomoo Caprese Salad", "Moomoo Milk, Snoozy Tomato, Pure Oil"),
  salad("Contrary Chocolate Meat Salad", "Soothing Cacao, Bean Sausage"),
  salad("Overheat Ginger Salad", "Fiery Herb, Warming Ginger, Snoozy Tomato"),
  salad("Fancy Apple Salad", "Fancy Apple"),
  salad("Immunity Leek Salad", "Large Leek, Warming Ginger"),
  salad("Dazzling Apple Cheese Salad", "Fancy Apple, Moomoo Milk, Pure Oil"),
  salad(
    "Ninja Salad",
    "Large Leek, Greengrass Soybeans, Tasty Mushroom, Warming Ginger"
  ),
  salad("Heat Wave Tofu Salad", "Greengrass Soybeans, Fiery Herb"),
  salad(
    "Greengrass Salad",
    "Pure Oil, Greengrass Corn, Snoozy Tomato, Soft Potato"
  ),
  salad("Calm Mind Fruit Salad", "Fancy Apple, Honey, Greengrass Corn"),
  salad("Fury Attack Corn Salad", "Greengrass Corn, Pure Oil"),
  salad(
    "Cross Chop Salad",
    "Fancy Egg, Bean Sausage, Greengrass Corn, Snoozy Tomato"
  ),
  salad(
    "Defiant Coffee-Dressed Salad",
    "Rousing Coffee, Bean Sausage, Pure Oil, Soft Potato"
  ),
  salad(
    "Petal Blizzard Layered Salad",
    "Fancy Egg, Pure Oil, Soft Potato, Bean Sausage"
  ),
  salad(
    "Apple Acid Yogurt-Dressed Salad",
    "Fancy Egg, Fancy Apple, Snoozy Tomato, Moomoo Milk"
  ),
  salad(
    "Luscious Avocado Salad",
    "Glossy Avocado, Greengrass Soybeans, Pure Oil"
  ),
  salad(
    "Bulldoze Guacamole and Chips",
    "Glossy Avocado, Greengrass Corn, Fiery Herb, Greengrass Soybeans"
  ),
  salad(
    "Scald Chunky Salad",
    "Plump Pumpkin, Soft Potato, Greengrass Corn, Tasty Mushroom"
  ),
  salad(
    "Grass Knot Salad Wrap",
    "Snackable Nuts, Glossy Avocado, Warming Ginger, Snoozy Tomato"
  ),

  dessert("Fluffy Sweet Potatoes", "Soft Potato, Moomoo Milk"),
  dessert(
    "Steadfast Ginger Cookies",
    "Honey, Warming Ginger, Soothing Cacao, Fancy Egg"
  ),
  dessert("Fancy Apple Juice", "Fancy Apple"),
  dessert("Craft Soda Pop", "Honey"),
  dessert("Ember Ginger Tea", "Warming Ginger, Fancy Apple"),
  dessert(
    "Jigglypuff's Fruity Flan",
    "Honey, Fancy Egg, Moomoo Milk, Fancy Apple"
  ),
  dessert(
    "Lovely Kiss Smoothie",
    "Fancy Apple, Moomoo Milk, Honey, Soothing Cacao"
  ),
  dessert("Lucky Chant Apple Pie", "Fancy Apple, Moomoo Milk"),
  dessert(
    "Neroli's Restorative Tea",
    "Warming Ginger, Fancy Apple, Tasty Mushroom"
  ),
  dessert("Sweet Scent Chocolate Cake", "Honey, Soothing Cacao, Moomoo Milk"),
  dessert("Warm Moomoo Milk", "Moomoo Milk"),
  dessert("Cloud Nine Soy Cake", "Fancy Egg, Greengrass Soybeans"),
  dessert("Hustle Protein Smoothie", "Greengrass Soybeans, Soothing Cacao"),
  dessert("Stalwart Vegetable Juice", "Snoozy Tomato, Fancy Apple"),
  dessert("Big Malasada", "Pure Oil, Moomoo Milk, Honey"),
  dessert(
    "Huge Power Soy Donuts",
    "Pure Oil, Greengrass Soybeans, Soothing Cacao"
  ),
  dessert("Explosion Popcorn", "Greengrass Corn, Pure Oil, Moomoo Milk"),
  dessert(
    "Teatime Corn Scones",
    "Fancy Apple, Warming Ginger, Greengrass Corn, Moomoo Milk"
  ),
  dessert("Petal Dance Chocolate Tart", "Fancy Apple, Soothing Cacao"),
  dessert(
    "Flower Gift Macarons",
    "Soothing Cacao, Fancy Egg, Honey, Moomoo Milk"
  ),
  dessert("Early Bird Coffee Jelly", "Rousing Coffee, Moomoo Milk, Honey"),
  dessert(
    "Zing Zap Spiced Cola",
    "Fancy Apple, Warming Ginger, Large Leek, Rousing Coffee"
  ),
  dessert(
    "Mold Breaker Corn Tiramisu",
    "Rousing Coffee, Greengrass Corn, Moomoo Milk"
  ),
  dessert(
    "Clodsire Eclair",
    "Soothing Cacao, Moomoo Milk, Rousing Coffee, Honey"
  ),
  dessert(
    "Scary Face Pancakes",
    "Plump Pumpkin, Fancy Egg, Honey, Snoozy Tomato"
  ),
  dessert(
    "Leaf Tornado Smoothie",
    "Glossy Avocado, Snoozy Tomato, Moomoo Milk"
  ),
  dessert(
    "Honey Gather Chocolate Waffles",
    "Honey, Greengrass Corn, Pure Oil, Soothing Cacao"
  ),
  dessert(
    "Slowpoke Tail Roll Cake",
    "Snackable Nuts, Slowpoke Tail, Greengrass Soybeans, Fancy Egg"
  ),
];
