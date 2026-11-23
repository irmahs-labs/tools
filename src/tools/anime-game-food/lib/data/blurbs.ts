import type { SourceId } from "../dish";

/**
 * One line on each dish, by its name, in English then French: what the
 * food is, written from its ingredients and Irma's notes, never copied
 * from a wiki or a game. The tests check every dish has one.
 */
export const BLURBS = {
  "food-wars": {
    "A5 beef tail soup don": [
      "A5 beef tail soup with the rice hidden underneath.",
      "Une soupe de queue de bœuf A5, le riz caché dessous.",
    ],
    "African ramen": [
      "Ramen in a chicken, peanut and tomato broth with harissa.",
      "Un ramen dans un bouillon poulet, cacahuète et tomate, à la harissa.",
    ],
    "Anki-monaka": [
      "Monkfish liver between two crisp monaka wafers.",
      "Du foie de lotte entre deux gaufrettes monaka croustillantes.",
    ],
    "Apple dorayaki": [
      "Pancakes sandwiching apple butter, apple jam and white bean paste.",
      "Des pancakes fourrés de beurre de pomme, de confiture de pomme et de pâte de haricots blancs.",
    ],
    "Apple risotto": [
      "An apple and bacon risotto, brightened with lemon.",
      "Un risotto pomme et bacon, relevé de citron.",
    ],
    "Bacon rôti potato": [
      "A whole potato wrapped in bacon and roasted until crisp.",
      "Une pomme de terre entière enroulée de bacon et rôtie jusqu’à être croustillante.",
    ],
    "Beef and chicken duet with demi-glace": [
      "Beef and chicken mousse in pastry with a red wine demi-glace, made from frozen and canned food.",
      "Bœuf et mousse de poulet en croûte, demi-glace au vin rouge, à partir de surgelés et de conserves.",
    ],
    "Beef stew": [
      "Several cuts of beef and oxtail stewed on onion, carrot and celery.",
      "Plusieurs morceaux de bœuf et de la queue de bœuf mijotés sur oignon, carotte et céleri.",
    ],
    "Bewitching roast beef": [
      "Roast beef with a poached egg and a horseradish cream sauce.",
      "Un rôti de bœuf avec un œuf poché et une sauce crème au raifort.",
    ],
    "Breakfast oden": [
      "A light morning oden of quail eggs and baby octopus in dashi.",
      "Un oden léger du matin, œufs de caille et petits poulpes dans un dashi.",
    ],
    "Bœuf bourguignon": [
      "Beef braised with mushrooms and carrots, made tender with honey.",
      "Du bœuf braisé avec champignons et carottes, attendri au miel.",
    ],
    "Calamari ripieni": [
      "Stuffed squid cooked with its own liver, anchovy and white wine.",
      "Des calmars farcis, cuits avec leur foie, des anchois et du vin blanc.",
    ],
    "Canard perfumed rôti with salsa verde": [
      "Fragrant roast duck with a Japanese-style green sauce.",
      "Un canard rôti parfumé, avec une sauce verte à la japonaise.",
    ],
    "Capitone in umido": [
      "An Italian eel stew with tomato, served on polenta.",
      "Un ragoût d’anguille à l’italienne et à la tomate, sur de la polenta.",
    ],
    Causa: [
      "A Peruvian layered potato dish with arapaima and a squid burger.",
      "Un plat péruvien en couches de pomme de terre, avec de l’arapaïma et un burger de calmar.",
    ],
    "Caveman meat pâté de campagne": [
      "A rustic country pâté of beef, bacon and chicken liver in jellied consommé.",
      "Un pâté de campagne rustique au bœuf, au bacon et au foie de volaille, en consommé gélifié.",
    ],
    "Chaliapin steak don": [
      "Onion-tenderised steak over pickled-plum rice with red wine sauce.",
      "Un steak attendri à l’oignon sur un riz à la prune umeboshi, sauce au vin rouge.",
    ],
    "Charcoal-grilled venison with chestnut sauce": [
      "Venison thigh grilled over charcoal with a sweet chestnut sauce.",
      "Une cuisse de chevreuil grillée au charbon, sauce aux châtaignes.",
    ],
    "Cheese fondue minestrone": [
      "Minestrone served with cheese fondue in a tomato bowl.",
      "Un minestrone servi avec une fondue au fromage dans un bol en tomate.",
    ],
    "Cheesy lobster": [
      "Lobster baked with cheese.",
      "Du homard gratiné au fromage.",
    ],
    "Chicken kozhi varutha": [
      "South Indian chicken dry-fried in roasted spices.",
      "Un poulet du sud de l’Inde sauté à sec dans des épices torréfiées.",
    ],
    "Chou farci": [
      "Cabbage stuffed with chicken, morels and asparagus.",
      "Du chou farci au poulet, aux morilles et aux asperges.",
    ],
    "Cluster bomb cake": [
      "A cake hiding chocolate, almonds and mint inside its pastry.",
      "Un gâteau qui cache chocolat, amandes et menthe dans sa pâte.",
    ],
    "Cold taglierini with jalapeño soup": [
      "Cold pasta with a jalapeño soup that turns liquid as you eat it.",
      "Des pâtes froides avec une soupe au jalapeño qui devient liquide en bouche.",
    ],
    "Curry laksa": [
      "A spicy laksa made bold with kusaya and squid ink.",
      "Un laksa épicé, rendu intense par le kusaya et l’encre de seiche.",
    ],
    "Curry tamari fettuccine": [
      "Parmesan-filled fettuccine in a curry and tamari sauce.",
      "Des fettuccine fourrées au parmesan, sauce curry et tamari.",
    ],
    "Dongpo pork curry don": [
      "Braised dongpo pork belly in curry over rice.",
      "De la poitrine de porc dongpo braisée en curry, sur du riz.",
    ],
    "Doner kebab burger": [
      "A kebab-style burger in pita with yogurt sauce and onion pickle.",
      "Un burger façon kebab en pita, sauce yaourt et pickles d’oignon.",
    ],
    "Doppio mezzaluna pizza": [
      "A half-moon pizza: one half beef and yuzu miso, the other four cheeses.",
      "Une pizza demi-lune : une moitié bœuf et miso au yuzu, l’autre quatre fromages.",
    ],
    "Duck Apicius": [
      "Roast duck with honey and spices, after an ancient Roman recipe.",
      "Un canard rôti au miel et aux épices, d’après une recette de la Rome antique.",
    ],
    "Eel matelote": [
      "Eel stewed in red wine, served with brioche.",
      "De l’anguille mijotée au vin rouge, servie avec une brioche.",
    ],
    "Eggs Benedict": [
      "Poached eggs on a muffin with bacon, hollandaise and karasumi.",
      "Des œufs pochés sur un muffin, avec bacon, hollandaise et karasumi.",
    ],
    "Eggs Benedict don fit for a queen": [
      "Eggs Benedict over rice, the poached eggs fried in tempura.",
      "Des œufs Bénédicte sur du riz, les œufs pochés frits en tempura.",
    ],
    "Fake dan dan noodles": [
      "Noodles made from bun dough, topped like dan dan noodles.",
      "Des nouilles faites avec la pâte des pains, garnies comme des dan dan.",
    ],
    "Fish tempura with kaki no tane": [
      "Fish tempura crusted in crushed rice crackers instead of panko.",
      "Un tempura de poisson enrobé de crackers de riz écrasés au lieu de panko.",
    ],
    "Five grand fried pilaf": [
      "Five pilafs from around the world on one plate.",
      "Cinq pilafs du monde dans une seule assiette.",
    ],
    "Five kinds of curry soup": [
      "Five curry soups in one serving.",
      "Cinq soupes au curry en une seule portion.",
    ],
    "Fried bear": [
      "Fried bear meat with a juniper gravy.",
      "De la viande d’ours frite, sauce au genièvre.",
    ],
    "Fried curry rice": [
      "Curry-spiced fried rice with pineapple.",
      "Du riz sauté au curry et à l’ananas.",
    ],
    "Fried rice": [
      "The Yukihira diner’s everyday fried rice.",
      "Le riz sauté de tous les jours du restaurant Yukihira.",
    ],
    "Game curry": [
      "A curry of breaded duck with an orange sauce.",
      "Un curry de canard pané à la sauce à l’orange.",
    ],
    "Goan fish curry": [
      "A tangy Goan curry with swordfish and salmon.",
      "Un curry de Goa acidulé à l’espadon et au saumon.",
    ],
    "Golden eggs lunch set": [
      "A lunch set of eggs, each hiding a different soup.",
      "Un repas d’œufs, chacun cachant une soupe différente.",
    ],
    "Gosetsu udon": [
      "Udon made from potato, with potato mochi.",
      "Des udon faits de pomme de terre, avec des mochi de pomme de terre.",
    ],
    "Green tea and vegetable course": [
      "Vegetables matched with five green teas and a green tea cappuccino sauce.",
      "Des légumes accordés à cinq thés verts, avec une sauce cappuccino au thé vert.",
    ],
    "Grilled dried squid with honey": [
      "Dried squid grilled with honey: a sticky mistake.",
      "Du calmar séché grillé au miel : une erreur collante.",
    ],
    "Grilled dried squid with peanut butter": [
      "Dried squid grilled with peanut butter: don’t try this at home.",
      "Du calmar séché grillé au beurre de cacahuète : à ne pas reproduire.",
    ],
    "Grilled poussin": ["A grilled young chicken.", "Un coquelet grillé."],
    "Hachis Parmentier with anchoyade": [
      "A classic cottage pie of meat sauce and mash, with anchovy sauce.",
      "Un hachis Parmentier classique, sauce à la viande et purée, avec une anchoyade.",
    ],
    "Hachis Parmentier with galette": [
      "A cottage pie with crêpes, a potato galette and steak.",
      "Un hachis Parmentier avec des crêpes, une galette de pommes de terre et une entrecôte.",
    ],
    "Hainanese chicken rice": [
      "Poached chicken over rice cooked in its stock, with chili and ginger sauces.",
      "Du poulet poché sur un riz cuit dans son bouillon, sauces piment et gingembre.",
    ],
    "Insalata frittata": [
      "An Italian omelette with a salad and balsamic dressing.",
      "Une omelette italienne avec une salade et une vinaigrette balsamique.",
    ],
    "Instant canned beef sukiyaki": [
      "Sukiyaki made from canned beef.",
      "Un sukiyaki fait de bœuf en conserve.",
    ],
    Kaisendon: [
      "A seafood rice bowl with salmon meunière and citrus sushi rice.",
      "Un bol de fruits de mer, saumon meunière et riz vinaigré aux agrumes.",
    ],
    "Katsudon with three eggs": [
      "A beef cutlet bowl bound with quail and hen eggs.",
      "Un bol de bœuf pané lié aux œufs de caille et de poule.",
    ],
    "King crab and sea urchin soup": [
      "A soup of red king crab, sea urchin and salmon roe.",
      "Une soupe de crabe royal, d’oursin et d’œufs de saumon.",
    ],
    "Kinokuni-style soba": [
      "Hand-cut soba with crisp sakura shrimp tempura.",
      "Des soba coupées à la main avec un tempura croustillant de crevettes sakura.",
    ],
    "Koji tofu soup": [
      "A hot pot of many kinds of tofu with koji.",
      "Une marmite de nombreux tofus, avec du koji.",
    ],
    "Kozuyu chicken ramen": [
      "A gentle chicken and scallop ramen inspired by Aizu’s kozuyu soup.",
      "Un ramen doux au poulet et aux saint-jacques, inspiré du kozuyu d’Aizu.",
    ],
    "Lamb with harissa": [
      "Lamb spiced with harissa and garam masala.",
      "De l’agneau relevé à la harissa et au garam masala.",
    ],
    "Laziji-style caiman": [
      "Chongqing-style chili-fried alligator meat.",
      "De la viande d’alligator frite au piment, façon Chongqing.",
    ],
    "Le plat véritable": [
      "A chicken and egg rice bowl rebuilt as French haute cuisine.",
      "Un bol de riz poulet et œuf repensé en grande cuisine française.",
    ],
    "Lièvre à la royale": [
      "A grand French rabbit dish with a chocolate and blood sauce.",
      "Un grand plat français de lapin, sauce au chocolat et au sang.",
    ],
    "Lobster cognac curry": [
      "A luxurious lobster curry with cognac.",
      "Un curry de homard luxueux, au cognac.",
    ],
    "Luxurious sobagaki soup": [
      "Buckwheat dumplings in a rich soup.",
      "Des boulettes de sarrasin dans une soupe riche.",
    ],
    "Mackerel steak haché": [
      "A hamburger steak made from mackerel instead of beef.",
      "Un steak haché fait de maquereau plutôt que de bœuf.",
    ],
    "Mackerel with maple syrup": [
      "Mackerel drenched in maple syrup.",
      "Du maquereau noyé dans le sirop d’érable.",
    ],
    "Maple cake": [
      "A cheese mousse cake with apple, walnuts and cranberry sauce.",
      "Un gâteau mousse au fromage, avec pomme, noix et sauce à la canneberge.",
    ],
    "Mapo curry noodles": [
      "Noodles in a mapo-style curry with a curry meatball.",
      "Des nouilles dans un curry façon mapo, avec une boulette au curry.",
    ],
    "Mapo tofu": [
      "Fiery Sichuan tofu with minced pork and numbing pepper.",
      "Un tofu du Sichuan brûlant, porc haché et poivre qui engourdit.",
    ],
    "Medicinal mutton curry": [
      "Mutton curry built on Chinese medicinal roots.",
      "Un curry de mouton à base de racines médicinales chinoises.",
    ],
    "Minced bear meat katsu": [
      "A breaded cutlet of minced bear meat with a honey-balsamic sauce.",
      "Une escalope panée d’ours haché, sauce miel et balsamique.",
    ],
    "Mini omelette soufflée": [
      "A small, airy soufflé omelette with tomato and parsley sauce.",
      "Une petite omelette soufflée et aérienne, sauce tomate et persil.",
    ],
    "Miso kusudama soup": [
      "Meatballs that burst into different miso soups.",
      "Des boulettes qui éclatent en plusieurs soupes miso.",
    ],
    "Monkfish dobujiru curry": [
      "A rich monkfish hot pot turned curry, with local vegetables.",
      "Une marmite de lotte devenue curry, avec des légumes de la région.",
    ],
    "Mozuya karaage": [
      "Fried chicken marinated with grated apple, in several flavours.",
      "Du poulet frit mariné à la pomme râpée, en plusieurs saveurs.",
    ],
    "Mushroom mille-feuille": [
      "A mille-feuille of mushroom duxelles with truffle and ants.",
      "Un mille-feuille de duxelles de champignons, à la truffe et aux fourmis.",
    ],
    "Naan pot pie curry": [
      "A fish curry baked under a naan lid that lets out its aroma.",
      "Un curry de poisson cuit sous un couvercle de naan qui libère ses arômes.",
    ],
    "Natto curry": [
      "A fermented curry of natto and soy sauce koji.",
      "Un curry fermenté au natto et au koji de sauce soja.",
    ],
    "Nine-vegetable terrine": [
      "A terrine of nine vegetables set in neat, jewel-like layers.",
      "Une terrine de neuf légumes, rangés en couches comme des bijoux.",
    ],
    "Omurice risotto curry": [
      "A curry risotto wrapped in an omelette.",
      "Un risotto au curry enveloppé dans une omelette.",
    ],
    "Onigiri chazuke": [
      "Mackerel rice balls with kombu tea poured over.",
      "Des boulettes de riz au maquereau, arrosées de thé au kombu.",
    ],
    "Out-of-season osechi": [
      "A New Year osechi box made in the wrong season.",
      "Une boîte d’osechi du Nouvel An, faite hors saison.",
    ],
    Oyakodon: [
      "A chicken and egg rice bowl reworked with quail and a Madeira sauce.",
      "Un bol de riz poulet et œuf revisité, avec de la caille et une sauce au madère.",
    ],
    "Pepper bun (hujiao bing)": [
      "A crisp baked bun filled with peppery pork.",
      "Un pain croustillant cuit au four, fourré de porc poivré.",
    ],
    "Petit loco moco don": [
      "A small Hawaiian rice bowl: burger patty, soft fried egg and avocado.",
      "Un petit bol hawaïen : steak haché, œuf au plat coulant et avocat.",
    ],
    "Polar Star hitsumabushi": [
      "Grilled eel over cheese risotto, eaten three ways like hitsumabushi.",
      "De l’anguille grillée sur un risotto au fromage, à manger de trois façons comme un hitsumabushi.",
    ],
    "Pork cutlet with chantilly sauce": [
      "A pork cutlet with a light whipped sauce.",
      "Une côtelette de porc panée avec une sauce chantilly légère.",
    ],
    "Pork cutlet with cheese fondue": [
      "A pork cutlet with grilled eggplant and a black cheese sauce.",
      "Une côtelette de porc panée, aubergine grillée et sauce au fromage noir.",
    ],
    "Poussin rôti": [
      "A roast young chicken, French style.",
      "Un coquelet rôti à la française.",
    ],
    "Queen apple tart": [
      "A thin apple tart glazed with damask rose syrup.",
      "Une fine tarte aux pommes nappée de sirop de rose de Damas.",
    ],
    Quiche: [
      "A chicken and mushroom quiche with soy milk and miso.",
      "Une quiche au poulet et aux champignons, au lait de soja et au miso.",
    ],
    "Rainbow terrine": [
      "A colourful vegetable and liver terrine with two bright sauces.",
      "Une terrine colorée de légumes et de foie, avec deux sauces vives.",
    ],
    "Red Riding Hood gibier soup": [
      "A spicy soup of several game meats.",
      "Une soupe épicée de plusieurs gibiers.",
    ],
    "Roll cake castle": [
      "A castle built from rolled sponge cakes in many flavours.",
      "Un château fait de gâteaux roulés aux saveurs variées.",
    ],
    "Rôti-don": [
      "Slices of roast beef over garlic rice.",
      "Des tranches de rôti de bœuf sur un riz à l’ail.",
    ],
    "Salmon confit flambé": [
      "Slow-cooked salmon confit, flambéed, with salmon ice cream.",
      "Un confit de saumon cuit lentement, flambé, avec une glace au saumon.",
    ],
    "Salmon coulibiac": [
      "A Russian salmon pie with buckwheat and buttered rice.",
      "Un pâté russe au saumon, au sarrasin et au riz beurré.",
    ],
    "Sanshō-yaki with cabbage purée": [
      "Grilled mackerel with sanshō pepper on a smooth cabbage purée.",
      "Du maquereau grillé au poivre sanshō sur une purée de chou onctueuse.",
    ],
    "Sardines and strawberry": [
      "Sardines with strawberries. Yes, really.",
      "Des sardines aux fraises. Si, si.",
    ],
    "Satsuma chicken wing gyoza": [
      "Boned chicken wings stuffed with gyoza filling.",
      "Des ailes de poulet désossées et farcies de garniture à gyoza.",
    ],
    "Saury cartoccio": [
      "Saury baked in a parcel with shrimp, mussels and clams.",
      "Du balaou cuit en papillote avec crevettes, moules et palourdes.",
    ],
    "Saury takikomi gohan": [
      "Rice cooked with saury, finished as a soft rice porridge.",
      "Du riz cuit avec du balaou, fini en bouillie de riz moelleuse.",
    ],
    "Scorched saury carpaccio": [
      "Seared raw saury in a soy and vinegar dressing.",
      "Du balaou cru saisi, sauce soja et vinaigre.",
    ],
    "Seared soba yakisoba": [
      "Buckwheat soba stir-fried and seared, with a strong bonito sauce.",
      "Des soba de sarrasin sautées et saisies, sauce forte à la bonite.",
    ],
    "Seaweed bento": [
      "A bento with seaweed and kelp in every dish.",
      "Un bento avec des algues et du varech dans chaque plat.",
    ],
    Semifreddo: [
      "A half-frozen Italian dessert with a praline crust.",
      "Un dessert italien mi-glacé avec une croûte pralinée.",
    ],
    Shippoku: [
      "A Nagasaki banquet mixing Japanese, Chinese and Western food.",
      "Un banquet de Nagasaki mêlant cuisines japonaise, chinoise et occidentale.",
    ],
    "Six-shot roast beef revolver": [
      "Six rounds of roast beef stewed in a salted cabbage sauce.",
      "Six tranches de rôti de bœuf mijotées dans une sauce au chou salé.",
    ],
    "Smoked curry": [
      "A curry where the bacon, egg and potato are all smoked.",
      "Un curry où le bacon, l’œuf et la pomme de terre sont tous fumés.",
    ],
    "Smoked frankfurter": [
      "A smoked frankfurter sausage.",
      "Une saucisse de Francfort fumée.",
    ],
    "Smoked squid": [
      "Simply smoked squid.",
      "Du calmar fumé, tout simplement.",
    ],
    "Snake soup": ["A soup made with snake.", "Une soupe de serpent."],
    "Soufflé léger de grâce": [
      "Fluffy soufflé pancakes with a brown sugar tuile.",
      "Des pancakes soufflés et légers, avec une tuile au sucre roux.",
    ],
    "Soupe de poisson ramen": [
      "Ramen in a French fish soup broth, with rouille.",
      "Un ramen dans un bouillon de soupe de poisson, avec une rouille.",
    ],
    "Spirulina and šaltibarščiai soup": [
      "Lithuania’s cold beetroot soup, with spirulina.",
      "La soupe froide lituanienne à la betterave, avec de la spiruline.",
    ],
    "Squid ink yakisoba": [
      "Noodles fried with squid in its own ink.",
      "Des nouilles sautées au calmar dans sa propre encre.",
    ],
    "Sukiyaki-don": [
      "Sukiyaki beef over rice, topped with a poached egg.",
      "Du bœuf façon sukiyaki sur du riz, coiffé d’un œuf poché.",
    ],
    "Suppon burger": [
      "A soft-shell turtle patty in a steamed bao bun.",
      "Un steak de tortue à carapace molle dans un pain bao vapeur.",
    ],
    "Tapioca cold soup": [
      "A cold soup of black tapioca coloured with natural pigments.",
      "Une soupe froide de tapioca noir, colorée de pigments naturels.",
    ],
    "Tea-smoked pork shoulder": [
      "Pork shoulder smoked with tea, with a matcha and black vinegar sauce.",
      "Une épaule de porc fumée au thé, sauce au matcha et au vinaigre noir.",
    ],
    "Tempeh and yuzu ramen": [
      "A meat-free ramen of tempeh, yuzu and roasted roots in soy milk broth.",
      "Un ramen sans viande : tempeh, yuzu et racines rôties dans un bouillon au lait de soja.",
    ],
    "Temari bento": [
      "A bento of small round sushi balls, each with its own topping.",
      "Un bento de petites boules de sushi, chacune avec sa garniture.",
    ],
    "Tempura chicken egg bowl": [
      "A frozen egg fried in tempura batter, over rice.",
      "Un œuf congelé frit en tempura, sur du riz.",
    ],
    "Ten maguro sushi rubies": [
      "Ten bite-size tuna sushi, from cheek to head.",
      "Dix sushis de thon en bouchées, de la joue à la tête.",
    ],
    "The white armour plate": [
      "Venison roasted inside a salt crust.",
      "Du chevreuil rôti dans une croûte de sel.",
    ],
    "Thermal sense curry": [
      "A frozen-and-hot curry plate that plays with temperature.",
      "Une assiette de curry glacée et chaude qui joue avec les températures.",
    ],
    "Three derivatives of egg": [
      "Egg three ways, with a molecular twist.",
      "L’œuf de trois façons, avec une touche moléculaire.",
    ],
    "Three greatest soups": [
      "Tom yum, borscht and shark fin soup in one.",
      "Tom yum, bortsch et soupe d’aileron de requin en un seul plat.",
    ],
    "Three kinds of onigiri": [
      "Three rice balls: chicken, kombu and cheese, and miso pork.",
      "Trois onigiri : poulet, kombu et fromage, et porc au miso.",
    ],
    "Three kinds of smoked soy milk": [
      "Soy milk smoked over three different woods.",
      "Du lait de soja fumé sur trois bois différents.",
    ],
    "Toasted butter pilaf inari sushi": [
      "Butter pilaf tucked into fried tofu pouches.",
      "Un pilaf au beurre glissé dans des poches de tofu frit.",
    ],
    "Tomato curry calzone": [
      "A folded pizza filled with spiced tomato curry.",
      "Une pizza pliée garnie d’un curry de tomate épicé.",
    ],
    "Transforming furikake gohan": [
      "Rice topped with a jellied furikake that melts into the warm rice.",
      "Du riz garni d’un furikake en gelée qui fond dans le riz chaud.",
    ],
    "Two faces of roast venison": [
      "Roast venison with two sauces: black pepper, and berries.",
      "Du chevreuil rôti à deux sauces : poivre noir, et fruits rouges.",
    ],
    "Vichyssoise curry udon": [
      "Udon in a creamy potato and leek curry soup.",
      "Des udon dans une soupe crémeuse au curry, pomme de terre et poireau.",
    ],
    Wanmono: [
      "A clear Japanese soup with wild rabbit dumplings.",
      "Une soupe claire japonaise aux boulettes de lapin de garenne.",
    ],
    "Yuan-style grilled salmon": [
      "Salmon grilled with a yuzu, sake and soy glaze.",
      "Du saumon grillé, laqué au yuzu, au saké et à la sauce soja.",
    ],
    "Zuppa di pesce": [
      "A Ligurian fish soup made with stockfish.",
      "Une soupe de poisson ligure au stockfisch.",
    ],
  },
  "pokemon-sleep": {
    "Apple Acid Yogurt-Dressed Salad": [
      "Egg, apple and tomato with a yogurt dressing.",
      "Œuf, pomme et tomate avec une sauce au yaourt.",
    ],
    "Bean Ham Salad": [
      "A simple salad with slices of sausage.",
      "Une salade simple aux rondelles de saucisse.",
    ],
    "Beanburger Curry": [
      "Curry topped with a sausage patty.",
      "Un curry garni d’un steak de saucisse.",
    ],
    "Big Malasada": [
      "A big fried doughnut with honey.",
      "Un gros beignet frit au miel.",
    ],
    "Bounce Curry Udon": [
      "Chewy udon in a ginger and mushroom curry.",
      "Des udon moelleux dans un curry au gingembre et aux champignons.",
    ],
    "Bulk Up Bean Curry": [
      "A protein-packed curry of beans, sausage and egg.",
      "Un curry riche en protéines : soja, saucisse et œuf.",
    ],
    "Bulldoze Guacamole and Chips": [
      "Spicy guacamole with corn chips.",
      "Du guacamole épicé avec des chips de maïs.",
    ],
    "Calm Mind Fruit Salad": [
      "A sweet salad of apple, honey and corn.",
      "Une salade sucrée de pomme, de miel et de maïs.",
    ],
    "Clodsire Eclair": [
      "A chocolate and coffee éclair.",
      "Un éclair au chocolat et au café.",
    ],
    "Cloud Nine Soy Cake": [
      "A light, fluffy soy cake.",
      "Un gâteau au soja léger et moelleux.",
    ],
    "Contrary Chocolate Meat Salad": [
      "A surprising salad of meat with chocolate.",
      "Une salade surprenante de viande au chocolat.",
    ],
    "Craft Soda Pop": ["A homemade honey soda.", "Un soda maison au miel."],
    "Cross Chop Salad": [
      "A chopped salad of egg, sausage, corn and tomato.",
      "Une salade hachée : œuf, saucisse, maïs et tomate.",
    ],
    "Cut Sukiyaki Curry": [
      "A sukiyaki-style curry with leek, sausage and egg.",
      "Un curry façon sukiyaki, avec poireau, saucisse et œuf.",
    ],
    "Dazzling Apple Cheese Salad": [
      "Apple and cheese salad with a drizzle of oil.",
      "Une salade de pommes et de fromage, avec un filet d’huile.",
    ],
    "Defiant Coffee-Dressed Salad": [
      "A potato and sausage salad with a coffee dressing.",
      "Une salade de pommes de terre et de saucisse, vinaigrette au café.",
    ],
    "Dizzy Punch Spicy Curry": [
      "A spicy curry with coffee and honey.",
      "Un curry épicé au café et au miel.",
    ],
    "Dream Eater Butter Curry": [
      "A rich butter curry with potato, tomato and cacao.",
      "Un riche curry au beurre, avec pomme de terre, tomate et cacao.",
    ],
    "Drought Katsu Curry": [
      "Curry with a crisp fried cutlet.",
      "Un curry avec une escalope frite croustillante.",
    ],
    "Early Bird Coffee Jelly": [
      "Coffee jelly with milk and honey.",
      "Une gelée de café au lait et au miel.",
    ],
    "Egg Bomb Curry": [
      "A sweet honey and apple curry with eggs.",
      "Un curry sucré au miel et aux pommes, avec des œufs.",
    ],
    "Ember Ginger Tea": [
      "A warming tea of ginger and apple.",
      "Un thé réchauffant au gingembre et à la pomme.",
    ],
    "Explosion Popcorn": ["Buttery popcorn.", "Du pop-corn au beurre."],
    "Fancy Apple Curry": [
      "A sweet, mild curry made with apples.",
      "Un curry doux et sucré aux pommes.",
    ],
    "Fancy Apple Juice": ["Fresh apple juice.", "Du jus de pomme frais."],
    "Fancy Apple Salad": [
      "A simple apple salad.",
      "Une simple salade de pommes.",
    ],
    "Flower Gift Macarons": [
      "Chocolate macarons with honey.",
      "Des macarons au chocolat et au miel.",
    ],
    "Fluffy Sweet Potatoes": [
      "Soft, sweet potato treats made with milk.",
      "Des douceurs moelleuses à la pomme de terre et au lait.",
    ],
    "Fury Attack Corn Salad": [
      "A corn salad dressed with oil.",
      "Une salade de maïs à l’huile.",
    ],
    "Gluttony Potato Salad": [
      "A big potato salad with egg, sausage and apple.",
      "Une grosse salade de pommes de terre, avec œuf, saucisse et pomme.",
    ],
    "Grass Knot Salad Wrap": [
      "A wrap of avocado, tomato, nuts and ginger.",
      "Un wrap à l’avocat, à la tomate, aux fruits à coque et au gingembre.",
    ],
    "Greengrass Curry Bun": [
      "A fried bun filled with spicy curry.",
      "Un pain frit fourré de curry épicé.",
    ],
    "Greengrass Salad": [
      "A garden salad of corn, tomato and potato.",
      "Une salade du jardin : maïs, tomate et pomme de terre.",
    ],
    "Grilled Tail Curry": [
      "A fiery curry with grilled Slowpoke tail.",
      "Un curry brûlant à la queue de Ramoloss grillée.",
    ],
    "Hearty Cheeseburger Curry": [
      "Curry with a sausage patty and melted cheese.",
      "Un curry avec un steak de saucisse et du fromage fondu.",
    ],
    "Heat Wave Tofu Salad": [
      "A spicy tofu salad.",
      "Une salade de tofu épicée.",
    ],
    "Hidden Power Perk-Up Stew": [
      "A stew of soybeans, tomato, mushroom and coffee.",
      "Un ragoût de soja, de tomate, de champignons et de café.",
    ],
    "Honey Gather Chocolate Waffles": [
      "Chocolate waffles drizzled with honey.",
      "Des gaufres au chocolat nappées de miel.",
    ],
    "Huge Power Soy Donuts": [
      "Fried soy doughnuts with chocolate.",
      "Des beignets de soja frits au chocolat.",
    ],
    "Hustle Protein Smoothie": [
      "A soy and cacao protein shake.",
      "Un shake protéiné au soja et au cacao.",
    ],
    "Immunity Leek Salad": [
      "A leek salad with ginger.",
      "Une salade de poireaux au gingembre.",
    ],
    "Inferno Corn Keema Curry": [
      "A very hot minced keema curry with corn.",
      "Un keema au curry très piquant, avec du maïs.",
    ],
    "Jigglypuff's Fruity Flan": [
      "A wobbly custard flan with apple and honey.",
      "Un flan tremblotant à la pomme et au miel.",
    ],
    "Leaf Tornado Smoothie": [
      "A green smoothie of avocado, tomato and milk.",
      "Un smoothie vert : avocat, tomate et lait.",
    ],
    "Limber Corn Stew": [
      "A creamy stew of corn, milk and potato.",
      "Un ragoût crémeux de maïs, de lait et de pommes de terre.",
    ],
    "Lovely Kiss Smoothie": [
      "A sweet smoothie of apple, milk, honey and cacao.",
      "Un smoothie sucré : pomme, lait, miel et cacao.",
    ],
    "Lucky Chant Apple Pie": [
      "A classic apple pie.",
      "Une tarte aux pommes classique.",
    ],
    "Luscious Avocado Salad": [
      "A creamy avocado and soybean salad.",
      "Une salade crémeuse d’avocat et de soja.",
    ],
    "Melty Omelette Curry": [
      "Curry under a soft, melting omelette.",
      "Un curry sous une omelette fondante.",
    ],
    "Mild Honey Curry": [
      "A gentle curry sweetened with honey.",
      "Un curry doux, adouci au miel.",
    ],
    "Mold Breaker Corn Tiramisu": [
      "A tiramisu with coffee and sweet corn.",
      "Un tiramisu au café et au maïs doux.",
    ],
    "Moomoo Caprese Salad": [
      "Tomato and fresh cheese with oil, caprese style.",
      "Tomates et fromage frais à l’huile, façon caprese.",
    ],
    "Neroli's Restorative Tea": [
      "A soothing tea of ginger, apple and mushroom.",
      "Un thé apaisant au gingembre, à la pomme et aux champignons.",
    ],
    "Ninja Curry": [
      "A curry of soybeans, sausage, leek and mushroom.",
      "Un curry de soja, de saucisse, de poireau et de champignons.",
    ],
    "Ninja Salad": [
      "A salad of leek, soybeans, mushroom and ginger.",
      "Une salade de poireau, de soja, de champignons et de gingembre.",
    ],
    "Overgrow Avocado Gratin": [
      "A creamy baked gratin of avocado and potato.",
      "Un gratin crémeux d’avocat et de pommes de terre.",
    ],
    "Overheat Ginger Salad": [
      "A hot salad of chili, ginger and tomato.",
      "Une salade piquante au piment, au gingembre et à la tomate.",
    ],
    "Petal Blizzard Layered Salad": [
      "A layered salad of egg, potato and sausage.",
      "Une salade en couches : œuf, pomme de terre et saucisse.",
    ],
    "Petal Dance Chocolate Tart": [
      "A chocolate and apple tart.",
      "Une tarte au chocolat et à la pomme.",
    ],
    "Role Play Pumpkaboo Stew": [
      "A pumpkin stew with sausage, potato and mushroom.",
      "Un ragoût de citrouille, avec saucisse, pommes de terre et champignons.",
    ],
    "Scald Chunky Salad": [
      "A warm, chunky salad of pumpkin, potato, corn and mushroom.",
      "Une salade tiède en gros morceaux : citrouille, pomme de terre, maïs et champignons.",
    ],
    "Scary Face Pancakes": [
      "Pumpkin pancakes with a spooky face.",
      "Des pancakes à la citrouille avec une tête qui fait peur.",
    ],
    "Seed Bomb Naan and Curry": [
      "Naan with a pumpkin, corn and nut curry.",
      "Du naan avec un curry de citrouille, de maïs et de fruits à coque.",
    ],
    "Simple Chowder": [
      "A plain, comforting milk chowder.",
      "Une chaudrée au lait, simple et réconfortante.",
    ],
    "Slowpoke Tail Pepper Salad": [
      "A peppery salad with Slowpoke tail.",
      "Une salade poivrée à la queue de Ramoloss.",
    ],
    "Slowpoke Tail Roll Cake": [
      "A rolled sponge cake with nuts and Slowpoke tail.",
      "Un gâteau roulé aux fruits à coque et à la queue de Ramoloss.",
    ],
    "Snoozy Tomato Salad": [
      "A simple tomato salad.",
      "Une simple salade de tomates.",
    ],
    "Snow Cloak Caesar Salad": [
      "A creamy Caesar salad with sausage.",
      "Une salade César crémeuse à la saucisse.",
    ],
    "Soft Potato Chowder": [
      "A creamy potato and mushroom chowder.",
      "Une chaudrée crémeuse aux pommes de terre et aux champignons.",
    ],
    "Solar Power Tomato Curry": [
      "A bright, spicy tomato curry.",
      "Un curry à la tomate, vif et épicé.",
    ],
    "Spicy Leek Curry": [
      "A hot curry of leek and ginger.",
      "Un curry relevé au poireau et au gingembre.",
    ],
    "Spore Mushroom Curry": [
      "A hearty mushroom and potato curry.",
      "Un curry copieux aux champignons et aux pommes de terre.",
    ],
    "Spore Mushroom Salad": [
      "A salad of mushroom and tomato in oil.",
      "Une salade de champignons et de tomates à l’huile.",
    ],
    "Stalwart Vegetable Juice": [
      "A tomato and apple juice.",
      "Un jus de tomate et de pomme.",
    ],
    "Steadfast Ginger Cookies": [
      "Honey and ginger cookies with a touch of cacao.",
      "Des biscuits au miel et au gingembre, avec une pointe de cacao.",
    ],
    "Superpower Extreme Salad": [
      "A filling salad of sausage, egg, potato and ginger.",
      "Une salade copieuse : saucisse, œuf, pomme de terre et gingembre.",
    ],
    "Sweet Scent Chocolate Cake": [
      "A chocolate cake sweetened with honey.",
      "Un gâteau au chocolat adouci au miel.",
    ],
    "Teatime Corn Scones": [
      "Corn scones with apple and ginger.",
      "Des scones au maïs, à la pomme et au gingembre.",
    ],
    "Warm Moomoo Milk": ["A cup of warm milk.", "Une tasse de lait chaud."],
    "Water Veil Tofu Salad": [
      "A cool tofu and tomato salad.",
      "Une salade fraîche de tofu et de tomates.",
    ],
    "Zing Zap Spiced Cola": [
      "A homemade cola spiced with ginger.",
      "Un cola maison épicé au gingembre.",
    ],
  },
} satisfies Record<SourceId, Record<string, readonly [string, string]>>;
