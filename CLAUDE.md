# CLAUDE.md

<!-- The sections down to "Checks before pushing" are the same in every
irmahs-labs repo; change them in irmahs-labs/template first. Replace the
examples and the sections after it for this app. -->

## Git branches

Always pull before making changes: run `git fetch origin` and start from the latest `origin/main` before the first edit.

- On a branch whose PR is open, bring it up to date with `origin/main` first
- On `main`, or on a branch whose PR is already merged, create a new branch from `origin/main` instead

Always name the branch after the feature or fix it contains, never a random or generated name.

- Format: `<type>/<feature-name>` in lowercase kebab-case
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`
- Examples: `feat/cover-templates`, `fix/export-blur`, `docs/claude-md`
- If the session assigns a generic branch (for example `claude/<random-words>`), create a feature-named branch instead and push there

## Pull requests

- Never push to `main`. Every change goes in through a pull request.
- Open the PR and stop there: never merge it, not even when CI is green. Irma reviews and clicks merge.
- Deploys run on merge to `main`. Re-run a deploy only when Irma asks.

## Checks before pushing

```sh
npm run check     # Ultracite (oxlint + oxfmt); CI fails on it
npm run typecheck # app and end-to-end tests
npm test          # vitest
npm run build
npm run test:e2e  # Playwright, when a change touches what the browser shows
```

The PostToolUse hook in `.claude/hooks/ultracite.sh` runs Ultracite and the typecheck on every file you edit.

## What this is

Tools by Irma HS, at tools.irmahs.dev: little tools for making things, a static Vite + React site that Caddy serves (`Caddyfile`, `Dockerfile`). There is no server of its own and nothing is uploaded: every tool works in the visitor's browser.

The hub at `/` (`src/components/hub.tsx`) lists every tool in `TOOLS` (`src/tools.ts`), one window-shaped card each, and `src/app.tsx` routes each address to its page (`pageAt`); an address it doesn't know shows the hub. Each tool lives in its own folder, `src/tools/<slug>/`, with its own `components/` and `lib/`, and its pages under `/<slug>`. What every tool shares stays at the top: the header pills, windows and test setup in `src/components/`, language, theme and the sign-in check in `src/lib/`, the router in `src/router.ts`, and the styles in `src/styles.css`.

To add a tool: a folder under `src/tools/<slug>/` with its words in English and French, an entry in `TOOLS` (with a window name for its card, an extension that exists, and its 40-grid logo), and its pages in `pageAt` and `App`. Keep its logic in plain functions with Vitest tests, apart from the React code.

**Character Maker** (`src/tools/character-maker/`, at `/character-maker`, each character at `/character-maker/<id>` and its sheet at `/character-maker/<id>/sheet`, `paths.ts`) makes a level 1 fifth edition character in seven steps and prints its sheet. Its rules are the System Reference Document 5.2.1's and nothing else: never add content from any other book, and never name the game or its publisher's brands in the page's words (the SRD allows only "5E compatible" / "compatible 5E"). Every page carries the SRD's attribution sentence (`credit` in `components/copy.ts`), in English or in the French SRD's own wording, and nothing else crediting Wizards. Game words come from the SRD in each language: the English SRD 5.2.1 and its official French translation (feet in English, metres in French, at 1.5 m to 5 feet). The data is `lib/srd/`; `spells.ts` was generated from both SRDs' text, so fix a spell there by checking both. A character's choices are `lib/character.ts` (a zod schema, as saved), and everything on the sheet is worked out from them in `lib/rules.ts` (plain functions with tests), never stored. Characters stay in the visitor's browser (`lib/storage.ts`, key `tools:character-maker:v1`). The sheet (`components/sheet.tsx`) is paper in both themes, and the print styles at the end of `src/styles.css` keep only it.

**Album Cover Maker** (`src/tools/album-cover-maker/`, at `/album-cover-maker`, the maker at `/album-cover-maker/make`, `paths.ts`) was its own app at album-cover-maker.irmahs.dev (irmahs-labs/album-cover-maker, archived, where its history is); irmahs-labs/proxy redirects that address here, keeping the path under `/album-cover-maker`. It keeps its own brand in its header (its record logo and name, linking to its landing page), and its landing page links back to every tool.

## Languages

The app reads in English or French. The choice is `src/lib/language.ts`: kept in localStorage and in a `lang` cookie on `irmahs.dev` that every irmahs.dev app reads and writes, so one pick carries across the apps; the header's EN/FR pill (`src/components/language-toggle.tsx`) switches it. Every string a visitor sees has both versions, in a `COPY = { en, fr }` object beside the component that shows it (`useCopy(COPY)`), the maker's in `src/tools/album-cover-maker/components/maker-copy.ts`. Window and file names (`cover.png`, `hello.txt`) stay as they are in both.

## Design

Album Cover Maker is the app Cute Matcha's _Apps_ section was drawn from, and the whole of Tools shares its look. It works in both of the system's themes: Light Matcha, and Dark Matcha (a mid-tone matcha page, cards a step lighter, the header, buttons and fields a darker well, near-black outlines and shadows). Colours are its role tokens, named by job (`ground`, `panel`, `header`, `raised`, `text`, `text-muted`, `accent`, `on-accent`, `pop`, `on-pop`, `strong`, `selected`, …), at the top of `src/styles.css`: Light Matcha on `:root`, Dark Matcha on `:root[data-theme="dark"]`. Pick a token by what the thing is, never a hex: the primary pill is `pop`, the yellow accent kept for the one call to action on a screen (48px tall, sinking into its hard shadow when pressed), a chosen option, combo, font or switch is `selected`, legends, title bars and the export button are `strong`. Every surface sets its own text: `text` on `panel` and `raised`, `on-accent` on `accent` (the lime windows), `on-strong` on `strong`, `on-selected` on `selected`. The inline script in `index.html` sets `data-theme` before the first paint, from the visitor's saved choice or else the device's setting; `src/lib/theme.ts` keeps it, and the header's sun/moon pill saves a choice. The cover, the record and the player mock-up are artwork and keep their own colours.

The app's own type is Fredoka (the name, titles, legends, window names) and Nunito Sans (everything else), self-hosted like the cover fonts: they're the `UI` families in `scripts/font-faces.mjs`. The hub's hello window and tool cards, Album Cover Maker's landing page windows and the maker's three previews are **Windows** (`src/components/window.tsx`), a title bar over a lime body. A window is named like a file, in kebab-case with an extension that exists and fits what it holds (`hello.txt`, `how-it-works.md`, `album-cover-maker.exe`, `cover.png`, `player.exe`, `record.jpeg`). A settings **panel**, named on its legend pill, takes a plain lowercase name with no extension (`photo`, `cover text`, `fonts`, `combos`). Corners are concentric: a panel is `--radius-panel` (20px) with 16px of padding on top and 12px elsewhere, fields and toggles inside take `--radius-field` (8px), a window is 9px and the boxes inside it `--radius-xs` (2px). Screen icons are a 24 grid at 2px, and the footer says only 'more apps at irmahs.dev'. App icons draw with only three colours, as the Book of Shadows' does: the lime tile (`#d4dd9c`, with its lighter green `#afc584` for details), the cream `#fff3cf` and the dark green `#2f3b34`; never yellow, gold, red or another lime. The Tools icon (`src/components/tools-logo.tsx`) is a lime toolbox in fixed Light Matcha colours with a `text` rim; `public/favicon.svg` is the same drawing. The header ends with the **account pill** (`src/components/account-button.tsx`): "sign in" with Google's mark, or the person's picture and first name, linking to the IrmaHS Labs account page. It asks `auth.irmahs.dev` who is signed in from the browser (`src/lib/session.ts`); that check is the one request allowed to leave the site, and the end-to-end test allows exactly it.
