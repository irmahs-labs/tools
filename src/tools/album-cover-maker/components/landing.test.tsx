// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { App } from "../../../app";
import { setUpDom } from "../../../components/dom-test-setup";
import { COMBOS } from "../lib/combos";
import { ALBUM_HOME, ALBUM_MAKER } from "../paths";

setUpDom();

beforeEach(() => {
  window.history.replaceState(null, "", ALBUM_HOME);
});

describe("landing page", () => {
  it("has no login: no sign-in links or buttons, no password field", () => {
    const { container } = render(<App />);

    const actions = [
      ...screen.queryAllByRole("link"),
      ...screen.queryAllByRole("button"),
    ];

    for (const el of actions) {
      expect(el.textContent).not.toMatch(
        /log ?in|sign ?in|sign ?up|register/iu
      );
    }

    expect(container.querySelector('input[type="password"]')).toBeNull();
    expect(screen.getByText("no login needed")).toBeTruthy();
  });

  it("answers the account question in the FAQ", () => {
    render(<App />);
    const faq = screen.getByRole("region", { name: "faq" });
    expect(within(faq).getByText("Do I need an account?")).toBeTruthy();
    expect(
      within(faq).getByText(/No\. There's no sign-up and no login/u)
    ).toBeTruthy();
  });

  it("states how many font pairings there are", () => {
    render(<App />);
    expect(
      screen.getByText(
        new RegExp(`pick one of ${COMBOS.length} font pairings`, "u")
      )
    ).toBeTruthy();
  });

  it("links every call to action to the maker", () => {
    render(<App />);

    for (const name of [
      "make a cover",
      "start making",
      "start making your cover",
    ]) {
      expect(screen.getByRole("link", { name }).getAttribute("href")).toBe(
        ALBUM_MAKER
      );
    }
  });

  it("links back to every tool", () => {
    render(<App />);
    expect(
      screen.getByRole("link", { name: "all tools" }).getAttribute("href")
    ).toBe("/");
  });

  it("opens the maker in place when you click start making", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("link", { name: "start making" }));
    expect(window.location.pathname).toBe(ALBUM_MAKER);
    expect(screen.getByRole("form", { name: "Settings" })).toBeTruthy();
    expect(document.title).toMatch(/^Make a cover/u);
  });
});
