import type { Dish } from "./dish";
import { FOOD_WARS } from "./food-wars";
import { POKEMON_SLEEP } from "./pokemon-sleep";

/** Every dish, from every source. */
export const DISHES: readonly Dish[] = [...FOOD_WARS, ...POKEMON_SLEEP];
