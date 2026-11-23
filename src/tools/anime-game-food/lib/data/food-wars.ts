import type { Dish } from "../dish";
import type { SceneId } from "./scenes";

/**
 * Food Wars! dishes, from Irma's notes, in story order. Ingredients are
 * simplified to what you'd buy: a sauce, stock or garnish is its main
 * ingredients, and amounts and techniques are left out.
 */
const fw = (
  name: string,
  cook: string,
  scene: SceneId,
  ingredients: string,
  theme?: string
): Dish => {
  const dish: Dish = {
    cook,
    ingredients: ingredients.split(", "),
    name,
    scene,
    source: "food-wars",
  };

  if (theme) {
    dish.theme = theme;
  }

  return dish;
};

const SOMA = "Yukihira Sōma";
const MEGUMI = "Tadokoro Megumi";
const ERINA = "Nakiri Erina";
const ALICE = "Nakiri Alice";
const TAKUMI = "Aldini Takumi";
const ISAMI = "Aldini Isami";
const IKUMI = "Mito Ikumi";
const AKIRA = "Hayama Akira";
const RYO = "Kurokiba Ryō";
const HISAKO = "Arato Hisako";
const SHINOMIYA = "Shinomiya Kojirō";
const ISSHIKI = "Isshiki Satoshi";
const EISHI = "Tsukasa Eishi";
const RINDO = "Kobayashi Rindō";
const MOMO = "Akanegakubo Momo";
const EIZAN = "Eizan Etsuya";
const NENE = "Kinokuni Nene";
const JOICHIRO = "Yukihira Jōichirō";

export const FOOD_WARS: readonly Dish[] = [
  // Season 1
  fw("Fried rice", "Yukihira diner", "s1-diner", "rice"),
  fw("Bacon rôti potato", SOMA, "s1-diner", "bacon, potato"),
  fw(
    "Transforming furikake gohan",
    SOMA,
    "s1-diner",
    "rice, scallion, egg, chicken wings, onion, bonito flakes, sake, mirin, soy sauce, ginger, sugar, salt"
  ),
  fw(
    "Bœuf bourguignon",
    `${SOMA} and ${MEGUMI}`,
    "s1-diner",
    "beef, onion, mushroom, carrot, cauliflower, garlic, butter, honey, bouquet garni, salt, pepper"
  ),
  fw("Mackerel steak haché", SOMA, "s1-diner", "mackerel, egg, onion"),

  fw(
    "Sanshō-yaki with cabbage purée",
    ISSHIKI,
    "s1-polar",
    "mackerel, cabbage, sanshō pepper"
  ),
  fw("Onigiri chazuke", SOMA, "s1-polar", "mackerel, rice, kombu tea"),
  fw(
    "Three kinds of onigiri",
    MEGUMI,
    "s1-polar",
    "rice, chicken, kombu, cheese, pork, miso, sake, honey, garlic"
  ),

  fw(
    "Katsudon with three eggs",
    SOMA,
    "s1-donburi",
    "beef, quail egg, egg, rice"
  ),
  fw("Sukiyaki-don", SOMA, "s1-donburi", "beef, egg, rice"),
  fw(
    "Chaliapin steak don",
    SOMA,
    "s1-donburi",
    "beef, rice, pickled plum, red wine, onion, soy sauce"
  ),
  fw("Rôti-don", IKUMI, "s1-donburi", "beef, garlic, rice"),

  fw(
    "Canard perfumed rôti with salsa verde",
    `${TAKUMI} and ${ISAMI}`,
    "s1-camp",
    "duck, salsa verde"
  ),
  fw(
    "Fish tempura with kaki no tane",
    `${SOMA} and ${MEGUMI}`,
    "s1-camp",
    "fish, kaki no tane, egg, oil, sanshō pepper"
  ),
  fw(
    "Nine-vegetable terrine",
    SHINOMIYA,
    "s1-camp",
    "cabbage, carrot, okra, zucchini, cauliflower, summer squash, asparagus, baby corn"
  ),
  fw(
    "Rainbow terrine",
    `${MEGUMI} and ${SOMA}`,
    "s1-camp",
    "chicken liver, pork, egg, eggplant, potato, cherry tomato, carrot, zucchini, cabbage, daikon, shiitake, allspice, sudachi, perilla, basil, walnut, pine nut, parsley"
  ),
  fw(
    "Chou farci",
    SHINOMIYA,
    "s1-camp",
    "cabbage, chicken, beef fat, morel, asparagus, egg, cream, butter"
  ),

  fw(
    "Insalata frittata",
    TAKUMI,
    "s1-breakfast",
    "egg, salad leaves, balsamic vinegar"
  ),
  fw(
    "Breakfast oden",
    MEGUMI,
    "s1-breakfast",
    "quail egg, octopus, fried tofu, carrot, Brussels sprouts, dashi"
  ),
  fw(
    "Petit loco moco don",
    IKUMI,
    "s1-breakfast",
    "egg, beef, rice, lettuce, cherry tomato, avocado, white wine vinegar"
  ),
  fw(
    "Eggs Benedict",
    ERINA,
    "s1-breakfast",
    "egg, bacon, karasumi, English muffin, butter"
  ),
  fw(
    "Three derivatives of egg",
    ALICE,
    "s1-breakfast",
    "egg, salmon roe, gelatine, sea water, asparagus, milk, caramel"
  ),
  fw(
    "Mini omelette soufflée",
    SOMA,
    "s1-breakfast",
    "egg, flour, cream, salt, black pepper, parsley, tomato, garlic"
  ),

  fw(
    "Lamb with harissa",
    JOICHIRO,
    "s1-joichiro",
    "lamb, parsley, harissa, garam masala"
  ),
  fw("Zuppa di pesce", JOICHIRO, "s1-joichiro", "fish, stockfish"),
  fw(
    "Tempeh and yuzu ramen",
    JOICHIRO,
    "s1-joichiro",
    "noodles, tempeh, yuzu, taro, garlic, lotus root, burdock, carrot, radish, soy milk, chili oil, miso, kombu, shiitake, ginger"
  ),

  fw("Apple risotto", SOMA, "s1-other", "rice, bacon, apple, lemon, onion"),
  fw(
    "Mozuya karaage",
    `${SOMA} and ${IKUMI}`,
    "s1-other",
    "chicken, potato starch, apple, onion, soy sauce, ginger, curry powder, parmesan, corn flour, fish sauce, chili"
  ),
  fw("Chicken kozhi varutha", AKIRA, "s1-other", "chicken, curry spices"),
  fw("Goan fish curry", AKIRA, "s1-other", "swordfish, salmon, curry spices"),

  fw(
    "Curry laksa",
    "Sadatsuka Nao",
    "s1-curry",
    "kusaya, squid ink, curry spices"
  ),
  fw(
    "Medicinal mutton curry",
    HISAKO,
    "s1-curry",
    "mutton, angelica root, lovage root, rehmannia root, peony root, turmeric, star anise, fennel seed"
  ),
  fw(
    "Fried curry rice",
    "Hōjō Miyoko",
    "s1-curry",
    "rice, pineapple, curry spices"
  ),
  fw(
    "Game curry",
    "Yoshino Yūki",
    "s1-curry",
    "duck, orange, garam masala, turmeric"
  ),
  fw(
    "Tomato curry calzone",
    ISAMI,
    "s1-curry",
    "tomato, flour, nutmeg, clove, cinnamon, garam masala"
  ),
  fw(
    "Curry tamari fettuccine",
    TAKUMI,
    "s1-curry",
    "fettuccine, tamari, parmesan, curry spices"
  ),
  fw(
    "Thermal sense curry",
    ALICE,
    "s1-curry",
    "foie gras, turmeric, potato, cheese, pastry, coriander, tomato, thyme, curry spices"
  ),
  fw(
    "Monkfish dobujiru curry",
    MEGUMI,
    "s1-curry",
    "monkfish, Japanese vegetables, curry leaf, cinnamon, clove, coriander, cumin, garam masala"
  ),
  fw("Lobster cognac curry", RYO, "s1-curry", "lobster, cognac, curry spices"),
  fw(
    "Dongpo pork curry don",
    IKUMI,
    "s1-curry",
    "pork, rice, soy sauce, oyster sauce, star anise, ginger, Sichuan pepper"
  ),
  fw(
    "Natto curry",
    "Sakaki Ryōko",
    "s1-curry",
    "natto, soy sauce koji, curry spices"
  ),
  fw(
    "Vichyssoise curry udon",
    "Marui Zenji",
    "s1-curry",
    "udon, potato, leek, egg, cheese, curry spices"
  ),
  fw(
    "Smoked curry",
    "Ibusaki Shun",
    "s1-curry",
    "bacon, egg, potato, seaweed salt, cinnamon, cardamom, clove"
  ),
  fw(
    "Naan pot pie curry",
    AKIRA,
    "s1-curry",
    "flour, fish, yogurt, fennel, lemongrass, holy basil, cinnamon"
  ),
  fw(
    "Omurice risotto curry",
    SOMA,
    "s1-curry",
    "rice, egg, mango chutney, oyster sauce, honey, cumin, cardamom, clove"
  ),

  // Season 2
  fw(
    "Temari bento",
    ALICE,
    "s2-bento",
    "rice, abalone, kelp, sea urchin, salmon roe, bonito flakes, tomato, beef, sea bream"
  ),
  fw(
    "Seaweed bento",
    SOMA,
    "s2-bento",
    "fish cake, beer, burdock, mayonnaise, balsamic vinegar, sesame, cod, bonito flakes, kelp, bacon, onion, seaweed, arrowroot"
  ),
  fw(
    "Soupe de poisson ramen",
    RYO,
    "s2-ramen",
    "noodles, fish, spiny lobster, shrimp, tempura flakes, bread, cheese, garlic, cayenne pepper"
  ),
  fw(
    "Kozuyu chicken ramen",
    MEGUMI,
    "s2-ramen",
    "noodles, chicken, dried scallop, soy sauce, shiitake, burdock, green beans, onion, perilla, pickled plum"
  ),
  fw(
    "Doner kebab burger",
    AKIRA,
    "s2-burger",
    "minced meat, pita, yogurt, onion, garlic, chili, mustard oil, lemon, honey, amchoor, clove, cumin, black pepper, ginger, paprika"
  ),
  fw(
    "Suppon burger",
    HISAKO,
    "s2-burger",
    "soft-shell turtle, pork, bao bun, lily buds, Shaoxing wine, schisandra berry, ginger"
  ),
  fw("Semifreddo", TAKUMI, "s2-dessert", "praline, sponge cake, egg, cream"),
  fw(
    "Beef stew",
    SOMA,
    "s2-semi",
    "beef, oxtail, onion, carrot, celery, clove, black pepper"
  ),
  fw(
    "Duck Apicius",
    AKIRA,
    "s2-semi",
    "duck, fennel, honey, coriander, oregano"
  ),
  fw(
    "Eel matelote",
    RYO,
    "s2-semi",
    "eel, brioche, potato, prune, red wine, cinnamon"
  ),
  fw(
    "Saury takikomi gohan",
    SOMA,
    "s2-final",
    "saury, rice, rice bran, pickled plum, soy milk, parmesan, miso"
  ),
  fw(
    "Scorched saury carpaccio",
    AKIRA,
    "s2-final",
    "saury, olive oil, wine vinegar, soy sauce, mirin, sake, allspice"
  ),
  fw(
    "Saury cartoccio",
    RYO,
    "s2-final",
    "saury, shrimp, mussel, clam, butter, herbs"
  ),
  fw(
    "Quiche",
    SHINOMIYA,
    "s2-after",
    "chicken, egg, pastry, maitake, shimeji, burdock, soy milk, cheese, miso, black pepper"
  ),
  fw(
    "Oyakodon",
    SOMA,
    "s2-after",
    "quail, quail egg, egg, chicken, rice, onion, cabbage, cream, Madeira, honey, soy sauce, sugar"
  ),
  fw(
    "Maple cake",
    MOMO,
    "s2-after",
    "sponge cake, apple, walnut, cheese, blue cheese, caramel, cranberry, maple syrup"
  ),

  // Season 3
  fw(
    "Mapo tofu",
    "Kuga Terunori",
    "s3-moon",
    "tofu, pork, scallion, chili bean paste, Shaoxing wine, soy sauce, Sichuan pepper"
  ),
  fw(
    "Pepper bun (hujiao bing)",
    SOMA,
    "s3-moon",
    "flour, sesame, pork, scallion, sesame oil, black pepper, five-spice, star anise"
  ),
  fw(
    "Fake dan dan noodles",
    SOMA,
    "s3-moon",
    "flour, garlic, scallion, shrimp, bonito flakes, pork"
  ),
  fw(
    "Mapo curry noodles",
    SOMA,
    "s3-moon",
    "noodles, minced meat, curry spices"
  ),
  fw(
    "Satsuma chicken wing gyoza",
    SOMA,
    "s3-eizan",
    "chicken wings, garlic chives, cabbage, shiitake, garlic, ginger, soy sauce, oyster sauce, black pepper, pork, pork fat"
  ),
  fw(
    "Hainanese chicken rice",
    EIZAN,
    "s3-eizan",
    "chicken, rice, egg, chili sauce, ginger"
  ),
  fw(
    "Salmon confit flambé",
    "Kusunoki Rentarō",
    "s3-central",
    "salmon, olive oil, salt, pepper, bacon, berries, coriander"
  ),
  fw(
    "Salmon coulibiac",
    RYO,
    "s3-central",
    "salmon, buckwheat, rice, butter, pastry"
  ),
  fw(
    "Charcoal-grilled venison with chestnut sauce",
    SOMA,
    "s3-central",
    "venison, chestnut"
  ),
  fw(
    "Two faces of roast venison",
    EISHI,
    "s3-central",
    "venison, salt, black pepper, blueberry, red currant, blackberry, crème de cassis, red wine, raspberry jam, watercress"
  ),
  fw(
    "Tempura chicken egg bowl",
    SOMA,
    "s3-central",
    "egg, rice, flour, shiso, soy sauce, mirin, dashi"
  ),
  fw(
    "Yuan-style grilled salmon",
    "",
    "s3-exams",
    "salmon, yuzu, sake, mirin, soy sauce, salt"
  ),
  fw(
    "Gosetsu udon",
    "",
    "s3-exams",
    "potato, flour, potato starch, scallion, shiso"
  ),
  fw(
    "Minced bear meat katsu",
    SOMA,
    "s3-exams",
    "bear meat, garlic, onion, schisandra berry, honey, balsamic vinegar"
  ),
  fw("Fried bear", AKIRA, "s3-exams", "bear meat, starch, juniper berry"),
  fw(
    "Hachis Parmentier with galette",
    `Team ${JOICHIRO}`,
    "s3-training",
    "potato, crêpe, cheese, dried sardine, beef, red wine"
  ),
  fw(
    "Hachis Parmentier with anchoyade",
    "Team Dōjima Gin",
    "s3-training",
    "potato, onion, carrot, celery, minced meat, anchovy, garlic"
  ),
  fw(
    "Capitone in umido",
    "Shiratsu Jurio",
    "s3-team1",
    "eel, polenta, tomato, onion, garlic, olive oil",
    "eel"
  ),
  fw(
    "Polar Star hitsumabushi",
    ISSHIKI,
    "s3-team1",
    "eel, rice, cheese, garlic, bonito flakes",
    "eel"
  ),
  fw(
    "Seared soba yakisoba",
    SOMA,
    "s3-team1",
    "soba, soy sauce, bonito flakes, sanshō pepper, ginger",
    "soba"
  ),
  fw(
    "Kinokuni-style soba",
    NENE,
    "s3-team1",
    "soba, sakura shrimp, sesame oil",
    "soba"
  ),

  // Season 4
  fw(
    "Laziji-style caiman",
    RINDO,
    "s4-team2",
    "alligator, cayenne pepper",
    "cayenne pepper"
  ),
  fw(
    "African ramen",
    "Megishima Tōsuke",
    "s4-team2",
    "noodles, chicken, pork, garlic, peanut, soy sauce, sake, sugar, onion, tomato, lemon, cayenne pepper, paprika, caraway",
    "cayenne pepper"
  ),
  fw(
    "Ten maguro sushi rubies",
    "Mimasaka Subaru and Saitō Sōmei",
    "s4-team2",
    "tuna, rice, mirin, soy sauce, red wine, scallion, egg",
    "tuna"
  ),
  fw(
    "Green tea and vegetable course",
    EISHI,
    "s4-team2",
    "green tea, chickpea, artichoke, porcini, asparagus, mushroom",
    "green tea"
  ),
  fw(
    "Tea-smoked pork shoulder",
    "Kuga Terunori",
    "s4-team2",
    "pork, green tea, matcha, balsamic vinegar, black vinegar, soy sauce, sugar",
    "green tea"
  ),
  fw(
    "Doppio mezzaluna pizza",
    TAKUMI,
    "s4-team3",
    "flour, beef, onion, mozzarella, parmesan, gorgonzola, ricotta, yuzu, miso, mirin, sugar, ginger, black pepper",
    "beef"
  ),
  fw(
    "Bewitching roast beef",
    EIZAN,
    "s4-team3",
    "beef, egg, anchovy, horseradish, cream, yogurt",
    "beef"
  ),
  fw(
    "Toasted butter pilaf inari sushi",
    SOMA,
    "s4-team3",
    "butter, rice, fried tofu, chicken, shrimp, onion, mochi, soy milk, salt, pepper",
    "butter"
  ),
  fw(
    "Kaisendon",
    "Saitō Sōmei",
    "s4-team3",
    "butter, rice, squid, salmon, salmon roe, tonburi, pomegranate, orange, lemon, garlic, soy sauce",
    "butter"
  ),
  fw(
    "Apple dorayaki",
    MEGUMI,
    "s4-team3",
    "apple, tofu, ginger, butter, lemon, sugar, white bean paste, honey",
    "apple"
  ),
  fw(
    "Queen apple tart",
    MOMO,
    "s4-team3",
    "apple, pastry, rose syrup",
    "apple"
  ),
  fw(
    "Lièvre à la royale",
    EISHI,
    "s4-team4",
    "rabbit, egg, chestnut, fig, apple, chocolate, red wine",
    "wild rabbit"
  ),
  fw(
    "Wanmono",
    ISSHIKI,
    "s4-team4",
    "rabbit, kombu, clam, mochi, scallion, miso",
    "wild rabbit"
  ),
  fw(
    "Causa",
    RINDO,
    "s4-team4",
    "squid, arapaima, egg, onion, lemon, mayonnaise, soy sauce, potato, ají amarillo",
    "spear squid"
  ),
  fw(
    "Calamari ripieni",
    TAKUMI,
    "s4-team4",
    "squid, anchovy, red pepper, garlic, olive oil, cream, white wine",
    "spear squid"
  ),
  fw(
    "Roll cake castle",
    MOMO,
    "s4-team4",
    "brown sugar, blueberry, strawberry, cream, matcha, cocoa, soy sauce, black sesame, vanilla",
    "brown sugar"
  ),
  fw(
    "Soufflé léger de grâce",
    ERINA,
    "s4-team4",
    "brown sugar, egg, flour, Greek yogurt, red bean paste",
    "brown sugar"
  ),
  fw(
    "Mushroom mille-feuille",
    `${EISHI} and ${RINDO}`,
    "s4-final",
    "truffle, shiitake, button mushroom, shallot, garlic, nuts, ants, butter, cream"
  ),
  fw(
    "The white armour plate",
    `${EISHI} and ${RINDO}`,
    "s4-final",
    "venison, egg, flour, salt, wood ear mushroom"
  ),
  fw(
    "Caveman meat pâté de campagne",
    `${ERINA} and ${SOMA}`,
    "s4-final",
    "beef, bacon, chicken liver, chicken, onion, green beans, carrot, shimeji, cream, honey, orange"
  ),
  fw(
    "Le plat véritable",
    `${ERINA} and ${SOMA}`,
    "s4-final",
    "chicken, egg, rice, squid, rice cracker, peanut butter, tamarind, salt, pepper"
  ),

  // Season 5
  fw("Squid ink yakisoba", "", "s5-summer", "noodles, squid, egg, shrimp"),
  fw("Smoked squid", "", "s5-summer", "squid"),
  fw("Smoked frankfurter", "", "s5-summer", "sausage"),
  fw("Cheesy lobster", "", "s5-summer", "lobster, cheese"),
  fw(
    "Red Riding Hood gibier soup",
    "Yoshino Yūki",
    "s5-blue-soup",
    "game meat, cayenne pepper"
  ),
  fw("Koji tofu soup", "Sakaki Ryōko", "s5-blue-soup", "tofu, koji"),
  fw(
    "Three greatest soups",
    "Marui Zenji",
    "s5-blue-soup",
    "shrimp, beetroot, shark fin"
  ),
  fw(
    "Three kinds of smoked soy milk",
    "Ibusaki Shun",
    "s5-blue-soup",
    "soy milk"
  ),
  fw("A5 beef tail soup don", IKUMI, "s5-blue-soup", "beef, rice"),
  fw(
    "Spirulina and šaltibarščiai soup",
    HISAKO,
    "s5-blue-soup",
    "spirulina, beetroot"
  ),
  fw("Tapioca cold soup", ALICE, "s5-blue-soup", "tapioca"),
  fw(
    "King crab and sea urchin soup",
    RYO,
    "s5-blue-soup",
    "king crab, sea urchin, salmon roe"
  ),
  fw("Luxurious sobagaki soup", NENE, "s5-blue-soup", "buckwheat flour"),
  fw("Five kinds of curry soup", AKIRA, "s5-blue-soup", "curry spices"),
  fw(
    "Cold taglierini with jalapeño soup",
    ISAMI,
    "s5-blue-soup",
    "pasta, jalapeño"
  ),
  fw(
    "Cheese fondue minestrone",
    TAKUMI,
    "s5-blue-soup",
    "tomato, cheese, olive oil, vegetables"
  ),
  fw("Golden eggs lunch set", SOMA, "s5-blue-soup", "egg"),
  fw("Miso kusudama soup", MEGUMI, "s5-blue-soup", "minced meat, miso"),
  fw("Pork cutlet with cheese fondue", "", "s5-blue", "pork, eggplant, cheese"),
  fw("Pork cutlet with chantilly sauce", "", "s5-blue", "pork, cream"),
  fw("Six-shot roast beef revolver", "", "s5-blue", "beef, cabbage"),
  fw(
    "Anki-monaka",
    SOMA,
    "s5-blue",
    "monkfish liver, monaka wafer, mountain yam, dashi, soy sauce, shichimi"
  ),
  fw("Instant canned beef sukiyaki", "", "s5-blue", "beef"),
  fw(
    "Beef and chicken duet with demi-glace",
    "",
    "s5-blue",
    "beef, chicken, egg, mushroom, cream, pastry, red wine, savory"
  ),
  fw(
    "Out-of-season osechi",
    SOMA,
    "s5-blue",
    "egg, fish cake, sardine, chicken, salmon, potato, taro, rice, yuzu, walnut, seaweed, cream, orange, sesame, prosciutto, daikon, carrot, vinegar, mustard, honey"
  ),
  fw("Cluster bomb cake", "Sarge", "s5-blue", "chocolate, almond, mint"),
  fw("Grilled poussin", "", "s5-blue", "poussin"),
  fw("Poussin rôti", "", "s5-blue", "poussin"),
  fw("Shippoku", "", "s5-blue", "shark fin, pastry, pasta, curry spices"),
  fw(
    "Five grand fried pilaf",
    SOMA,
    "s5-blue",
    "rice, pork, soy sauce, green beans, coconut, chili, mustard seed, onion, carrot, celery, egg, mayonnaise, fish"
  ),
  fw(
    "Eggs Benedict don fit for a queen",
    SOMA,
    "s5-blue",
    "egg, flour, meat, rice"
  ),

  // Disgusting dishes
  fw(
    "Grilled dried squid with peanut butter",
    "",
    "disgusting",
    "squid, peanut butter"
  ),
  fw("Grilled dried squid with honey", "", "disgusting", "squid, honey"),
  fw("Sardines and strawberry", "", "disgusting", "sardine, strawberry"),
  fw("Snake soup", "", "disgusting", "snake"),
  fw("Mackerel with maple syrup", "", "disgusting", "mackerel, maple syrup"),
];
