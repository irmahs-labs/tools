// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { App } from "../../../app";
import { setUpDom } from "../../../components/dom-test-setup";
import { FOOD_WARS } from "../lib/food-wars";
import { POKEMON_SLEEP } from "../lib/pokemon-sleep";
import { FOOD_HOME } from "../paths";

setUpDom();

beforeEach(() => {
  window.history.replaceState(null, "", FOOD_HOME);
});

const total = FOOD_WARS.length + POKEMON_SLEEP.length;

/** Draws once and checks the dish came from Pokémon Sleep. */
const drawAGame = async () => {
  await userEvent.click(
    screen.getByRole("button", { name: /give me a dish|another dish/u })
  );
  expect(screen.getAllByText("Pokémon Sleep").length).toBeGreaterThan(1);
};

describe("Anime & Game Food", () => {
  it("draws a dish with its ingredients", async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole("button", { name: "give me a dish" })
    );

    const dish = screen.getByRole("article");
    expect(within(dish).getByRole("heading", { level: 2 })).toBeTruthy();
    expect(within(dish).getByText("ingredients")).toBeTruthy();
    expect(within(dish).getAllByRole("listitem").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "another dish" })).toBeTruthy();
  });

  it("says how many dishes it picks from, by source", async () => {
    render(<App />);
    expect(screen.getByText(`${total} dishes to pick from`)).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "games only" }));
    expect(
      screen.getByText(`${POKEMON_SLEEP.length} dishes to pick from`)
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "games only" })).toHaveProperty(
      "ariaPressed",
      "true"
    );

    await userEvent.click(screen.getByRole("button", { name: "anime only" }));
    expect(
      screen.getByText(`${FOOD_WARS.length} dishes to pick from`)
    ).toBeTruthy();
  });

  it("only draws from the games when only games are picked", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "games only" }));

    await drawAGame();
    await drawAGame();
    await drawAGame();
  });

  it("can't draw when nothing is picked", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Food Wars!" }));
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Pokémon Sleep" })
    );

    expect(screen.getByText("Pick at least one anime or game.")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "give me a dish" })
    ).toHaveProperty("disabled", true);
  });
});
