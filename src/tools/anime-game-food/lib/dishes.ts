import { FOOD_WARS } from "./data/food-wars";
import { POKEMON_SLEEP } from "./data/pokemon-sleep";
import type { Dish } from "./dish";

/** Every dish, from every source. */
export const DISHES: readonly Dish[] = [...FOOD_WARS, ...POKEMON_SLEEP];
