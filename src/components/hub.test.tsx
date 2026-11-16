// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App, pageAt } from "../app";
import { TOOLS } from "../tools";
import { setUpDom } from "./dom-test-setup";

setUpDom();

describe("pageAt", () => {
  it("finds each page, with or without a trailing slash", () => {
    expect(pageAt("/")).toBe("hub");
    expect(pageAt("/album-cover-maker")).toBe("album");
    expect(pageAt("/album-cover-maker/")).toBe("album");
    expect(pageAt("/album-cover-maker/make")).toBe("maker");
  });

  it("shows the hub for an address it doesn't know", () => {
    expect(pageAt("/make")).toBe("hub");
    expect(pageAt("/nowhere")).toBe("hub");
  });
});

describe("Tools hub", () => {
  it("lists every tool, each card linking to it", () => {
    render(<App />);

    for (const tool of TOOLS) {
      const card = screen.getByRole("link", {
        name: new RegExp(tool.name.en, "u"),
      });

      expect(card.getAttribute("href")).toBe(tool.href);
      expect(card.textContent).toContain(tool.legend);
    }

    expect(document.title).toBe("Tools by Irma HS");
  });

  it("opens Album Cover Maker in place", async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole("link", { name: /Album Cover Maker/u })
    );
    expect(window.location.pathname).toBe("/album-cover-maker");
    expect(
      screen.getByRole("heading", {
        name: "Make your album cover in your browser.",
      })
    ).toBeTruthy();
  });
});
