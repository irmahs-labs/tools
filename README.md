# Tools by Irma HS

Little tools for making things, at https://tools.irmahs.dev. The hub at `/` lists them; each tool lives at `/<slug>`.

- **Character Maker** (`/character-maker`, each character at `/character-maker/<id>` and its sheet at `/character-maker/<id>/sheet`): a level 1 character for fifth edition, step by step (class, origin, scores, skills, spells, gear, details), with every number on the sheet worked out, and a one-page sheet to print or save as PDF. The subclass is picked at the start, as a house rule. Characters are kept in this browser only, five at most: each exports as PDF (the sheet) or JSON (a character file, which imports back and which Mini Games' one-shot will read). It uses the System Reference Documents 5.2.1 (2024 rules) and 5.1 (2014 rules) only, as rule packs each character picks and can mix (in English, and in their official French translations), under CC-BY-4.0, with the attributions the SRDs ask for; it is "5E compatible" and never names the game it's compatible with.
- **Album Cover Maker** (`/album-cover-maker`, the maker at `/album-cover-maker/make`): drop in a photo, add a title, pick a font and colour combo, and export a 3000 × 3000 cover PNG plus a 1080 × 1440 music player mock-up. No sign-up or login, and photos never leave the browser. It used to be its own app at album-cover-maker.irmahs.dev (irmahs-labs/album-cover-maker, where its history is); that address is gone now. Design: the "Cover maker: edit screen" artboard of the Cute Matcha design canvas.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173  (the hub at /, Character Maker at /character-maker, Album Cover Maker at /album-cover-maker)
npm test           # unit, drawing and screen tests (vitest)
npm run test:e2e   # end-to-end tests in Chromium (Playwright; builds first)
npm run typecheck  # app and end-to-end tests
npm run check      # Ultracite: oxlint + anti-slop, oxfmt (report only)
npm run fix        # the same, fixing and formatting what it can
npm run build      # outputs dist/
```

## Layout

- `src/tools.ts`: `TOOLS`, every tool on the hub; `src/app.tsx` routes each address to its page
- `src/components/`: the hub and what every page shares (header pills, windows)
- `src/lib/`: language, theme and the sign-in check, shared by every tool
- `src/tools/<slug>/`: one folder per tool, with its own `components/` and `lib/`

Character Maker, in `src/tools/character-maker/`:

- `lib/srd/`: the SRD 5.2.1's level 1 content as data, each name in the English and French SRD's words: `core.ts` (abilities, skills, languages, alignments), `classes.ts`, `origins.ts` (backgrounds, species, Origin feats), `equipment.ts`, `spells.ts` (every cantrip and level 1 spell, generated from both SRDs' text)
- `lib/character.ts`: a character's choices and their schema; `lib/rules.ts`: what they add up to on the sheet and what's left to choose; `lib/edits.ts`: changes that clear what no longer applies; `lib/storage.ts`: the browser's copy (five slots); `lib/transfer.ts`: the JSON character file; `lib/packs.ts`: the rule packs a character is made with (only the SRD 5.2.1 for now)
- `components/`: its own page, the editor and its steps, and the sheet (`sheet.tsx`, the live preview and the printable page)

Album Cover Maker, in `src/tools/album-cover-maker/`:

- `components/landing.tsx`: its landing page
- `components/maker.tsx`: the cover maker
- `lib/render.ts`: draws the cover and player on a canvas; the previews and the PNG exports share it, so what you see is what you download
- `lib/combos.ts`, `lib/color.ts`: combo suggestions from the photo's colours
- `lib/fonts.ts`: `PAIRS`, every title + subtitle font pairing; the combos and font menus are built from it
- `src/font-faces.css`: generated `@font-face` rules for those fonts (see below)
- `.claude/hooks/session-start.sh`: installs dependencies when a Claude Code cloud session starts

## Tests

- `src/tools/album-cover-maker/lib/*.test.ts`: colours, combos, fonts, and the cover and player drawing, checked through a fake canvas (`lib/fake-canvas.ts`) that records every draw call
- `src/components/*.test.tsx`, `src/tools/*/components/*.test.tsx`, `src/router.test.ts`: the hub, the landing page, the maker's controls and the router, in jsdom with Testing Library
- `e2e/`: Playwright in a real Chromium against the production build: the hub opening the maker, photo on the cover, the label drawn and hidden, real 3000 × 3000 and 1080 × 1440 PNG exports, fonts loading, no requests to any other site, and no sideways scrolling on a phone

The first time, run `npx playwright install chromium`. CI runs all of them in the required `checks` job.

## Fonts

Fonts are served with the site from the [Fontsource](https://fontsource.org) npm packages, so visitors' browsers never contact Google. All of them are under the SIL Open Font License.

To add a pairing:

1. Add it to `PAIRS` in `src/tools/album-cover-maker/lib/fonts.ts`.
2. Install any new family: `npm install @fontsource/<name-in-kebab-case>` (for example `@fontsource/abril-fatface`).
3. Run `npm run fonts` to regenerate `src/font-faces.css`, and commit both.

A test fails if a family in `PAIRS` has no font face, so a forgotten step 3 shows up in CI.

## Deploy

Pushing to `main` deploys to `/srv/tools` on the irmahs.dev server, served at https://tools.irmahs.dev through [irmahs-labs/proxy](https://github.com/irmahs-labs/proxy). One-time setup (DNS, server folder, proxy route) is in [DEPLOY.md](DEPLOY.md).
