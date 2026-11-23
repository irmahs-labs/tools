import { useState } from "react";

import { Footer } from "../../../components/footer";
import { ToolHeader } from "../../../components/tool-header";
import { Window } from "../../../components/window";
import { useCopy, useLanguage } from "../../../lib/language";
import { ingredientName } from "../lib/data/ingredients";
import {
  blurbOf,
  cookOf,
  pickDish,
  sceneOf,
  SOURCES,
  sourceOf,
  sourcesOfKind,
} from "../lib/dish";
import type { Dish, SourceId, SourceKind } from "../lib/dish";
import { DISHES } from "../lib/dishes";

const COPY = {
  en: {
    again: "another dish",
    all: "everything",
    animeOnly: "anime only",
    by: (cook: string) => `Cooked by ${cook}`,
    count: (n: number) => `${n} ${n === 1 ? "dish" : "dishes"} to pick from`,
    fan: "A fan-made list of the dishes, written from Irma’s notes. The shows and games belong to their owners, and nothing here is affiliated with them.",
    from: "from",
    gamesOnly: "games only",
    go: "give me a dish",
    ingredients: "ingredients",
    kind: { anime: "anime", game: "game" } satisfies Record<SourceKind, string>,
    kinds: { anime: "Anime", game: "Games" } satisfies Record<
      SourceKind,
      string
    >,
    lead: "One click, one dish from an anime or a game, with what goes in it.",
    none: "Pick at least one anime or game.",
    theme: (ingredient: string) => `Theme: ${ingredient}`,
    title: "What’s cooking?",
  },
  fr: {
    again: "un autre plat",
    all: "tout",
    animeOnly: "animés seulement",
    by: (cook: string) => `Cuisiné par ${cook}`,
    count: (n: number) => `${n} ${n === 1 ? "plat" : "plats"} au choix`,
    fan: "Une liste de fan, écrite à partir des notes d’Irma. Les séries et les jeux appartiennent à leurs ayants droit, et rien ici n’y est affilié.",
    from: "d’où",
    gamesOnly: "jeux seulement",
    go: "donne-moi un plat",
    ingredients: "ingrédients",
    kind: { anime: "animé", game: "jeu" } satisfies Record<SourceKind, string>,
    kinds: { anime: "Animés", game: "Jeux" } satisfies Record<
      SourceKind,
      string
    >,
    lead: "Un clic, un plat tiré d’un animé ou d’un jeu, avec ce qu’il y a dedans.",
    none: "Choisissez au moins un animé ou un jeu.",
    theme: (ingredient: string) => `Thème : ${ingredient}`,
    title: "Qu’est-ce qu’on mange ?",
  },
};

const KINDS: readonly SourceKind[] = ["anime", "game"];

const sameSet = (a: ReadonlySet<SourceId>, b: readonly SourceId[]) =>
  a.size === b.length && b.every((id) => a.has(id));

const DishCard = ({ dish }: { dish: Dish }) => {
  const t = useCopy(COPY);
  const language = useLanguage();
  const source = sourceOf(dish);
  const cook = cookOf(dish, language);

  return (
    <article className="dish" aria-live="polite">
      <p className="dish-from">
        <span className="badge dish-kind">{t.kind[source.kind]}</span>
        <span>{source.name}</span>
      </p>
      <h2 className="dish-name">{dish.name}</h2>
      <p className="dish-blurb">{blurbOf(dish, language)}</p>
      <p className="dish-scene">
        {cook ? `${t.by(cook)} · ` : ""}
        {sceneOf(dish, language)}
        {dish.theme
          ? ` · ${t.theme(ingredientName(dish.theme, language))}`
          : ""}
      </p>
      <h3 className="dish-heading">{t.ingredients}</h3>
      <ul className="dish-ingredients">
        {dish.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredientName(ingredient, language)}</li>
        ))}
      </ul>
    </article>
  );
};

/** The generator: pick where dishes come from, then draw one. */
export const Food = () => {
  const t = useCopy(COPY);

  const [sources, setSources] = useState<ReadonlySet<SourceId>>(
    () => new Set(sourcesOfKind())
  );

  const [dish, setDish] = useState<Dish | null>(null);

  const count = DISHES.filter((d) => sources.has(d.source)).length;

  const draw = () => setDish(pickDish(DISHES, sources, dish));

  const toggle = (id: SourceId) => {
    const next = new Set(sources);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setSources(next);
  };

  const presets: { label: string; ids: SourceId[] }[] = [
    { ids: sourcesOfKind(), label: t.all },
    { ids: sourcesOfKind("anime"), label: t.animeOnly },
    { ids: sourcesOfKind("game"), label: t.gamesOnly },
  ];

  return (
    <div className="page dotted">
      <ToolHeader slug="anime-game-food" />

      <main className="landing food">
        <Window name="dish.txt" className="hero food-hero">
          <div className="hero-copy food-copy">
            <h1>{t.title}</h1>
            <p className="hero-lead">{t.lead}</p>
            {dish ? <DishCard dish={dish} /> : null}
            <button
              type="button"
              className="pill primary big"
              onClick={draw}
              disabled={count === 0}
            >
              {dish ? t.again : t.go}
            </button>
            <p className="muted small">
              {count === 0 ? t.none : t.count(count)}
            </p>
          </div>
        </Window>

        <fieldset className="panel food-sources">
          <legend>{t.from}</legend>
          <div className="food-presets">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="toggle food-preset"
                aria-pressed={sameSet(sources, preset.ids)}
                onClick={() => setSources(new Set(preset.ids))}
              >
                {preset.label}
              </button>
            ))}
          </div>
          {KINDS.map((kind) => (
            <div key={kind} className="food-group">
              <h2 className="food-group-name">{t.kinds[kind]}</h2>
              {SOURCES.filter((s) => s.kind === kind).map((source) => (
                <label key={source.id} className="switch-row food-source">
                  <span>{source.name}</span>
                  <input
                    type="checkbox"
                    checked={sources.has(source.id)}
                    onChange={() => toggle(source.id)}
                  />
                </label>
              ))}
            </div>
          ))}
        </fieldset>

        <p className="muted small food-fan">{t.fan}</p>
      </main>

      <Footer />
    </div>
  );
};
