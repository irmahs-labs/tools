# CLAUDE.md

<!-- The sections down to "Checks before pushing" (the context graph and
the notes included) are the same in every irmahs-labs repo; change them in
irmahs-labs/template first. Replace the
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

## The context graph and the notes

Irma's notes on every irmahs.dev app are in her Obsidian notes, the repo irmahs/my-obsidian-notes (checked out at `~/Dev/my-obsidian-notes`), under `Self Hosted/`.

- Before starting work, read `Self Hosted/Context Graph.md` from that repo's `origin/main`: how irmahs.dev and every subdomain fit together (the proxy, the account service, which app talks to which, where each keeps its data). Without a checkout, read it with `gh api repos/irmahs/my-obsidian-notes/contents/Self%20Hosted/Context%20Graph.md -H "Accept: application/vnd.github.raw"`.
- When a change alters what the app is or does, update the notes too:
  - `Apps.md`, the app's section;
  - `Technologies.md`, if it adds, removes or changes a technology;
  - `Context Graph.md`, if it changes a subdomain, a redirect, a link between apps, who asks whom (sign-in, admin checks, internal calls), or where data lives. Update both the graph and the table.
- The notes go in through their own pull request, like any other change: a branch from the notes repo's `origin/main`, never their `main`. The local checkout is often left on an old branch, so work in a `git worktree` of `origin/main` rather than touching it. Link the app's PR in the notes PR.

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

Every tool page opens with `ToolHeader` (`src/components/tool-header.tsx`), so the header stays uncluttered and says where you are: the tool's logo, which goes back to every tool (there is no other "all tools" link on a wide screen), and its name ("Tools · by Irma HS" under it), which goes to the tool's own home; the page's own buttons (`actions`, and `end` before the shared pills), kept to the few that belong to the page as a whole (Character Maker's print button); and the shared pills, nothing more. A tool's working controls stay in the page, never in the header: Album Cover Maker's "I'm feeling lucky", "start over", hint and undo/redo are its `.maker-toolbar`, above the previews. Under the header, the tool's pages as tabs, the open one lifted in lime. Its tabs are the tool's `pages` in `TOOLS` unless the page passes its own (Character Maker adds a character's editor and sheet). On a phone (600px and under) the tabs give way to a ☰ button that opens a side drawer (a native `<dialog>`) with every tool and its pages, the open tool's current tabs included. To add a tool: a folder under `src/tools/<slug>/` with its words in English and French, an entry in `TOOLS` (with a window name for its card, an extension that exists, its 40-grid logo, and its pages for the tabs), and its pages in `pageAt` and `App`. Keep its logic in plain functions with Vitest tests, apart from the React code.

**Anime & Game Food** (`src/tools/anime-game-food/`, at `/anime-game-food`, `paths.ts`) gives a random dish from an anime or a game with its ingredients, from the sources the visitor picks (everything, anime only, games only, or each one ticked). Each source is an entry in `SOURCES` (`lib/dish.ts`) with its dishes in a file of its own in `lib/data/` (`food-wars.ts` from Irma's Obsidian note `food-wars-notes.md`, `pokemon-sleep.ts` from serebii.net); `lib/data/` holds the tables and is left out of SonarCloud's duplication check (`.sonarcloud.properties`). Ingredients are simplified to what you'd buy (a game's "Fancy Apple" is apple, Slowpoke tail is protein, a sauce is its main ingredients, no amounts), written in English and translated in `INGREDIENT_FR` (`lib/data/ingredients.ts`). Each dish has a one-liner in both languages (`BLURBS`, `lib/data/blurbs.ts`), written for this site from what the dish is, never copied; dish names stay as the show or game gives them, in both languages. It's a fan-made list: never copy a wiki's or a game's descriptions, and never use their images or logos.

**Character Maker** (`src/tools/character-maker/`, at `/character-maker`, each character at `/character-maker/<id>` and its sheet at `/character-maker/<id>/sheet`, `paths.ts`) makes a level 1 fifth edition character in seven steps and prints its sheet. Its rules come from the System Reference Documents 5.2.1 (2024 rules, `lib/srd/`) and 5.1 (2014 rules, `lib/srd51/`), each a rule pack a character can use, alone or mixed, and nothing else: never add content from any other book, and never name the game or its publisher's brands in the page's words (the SRD allows only "5E compatible" / "compatible 5E"). Every page carries the SRDs' attribution sentences (`credit` and `credit5_1` in `components/copy.ts`; a sheet carries those of its packs), in English or in the French SRD's own wording, and nothing else crediting Wizards. Game words come from the SRD in each language: each SRD in English and its official French translation (the French SRD 5.1 is Wizards' `SRD_CC_v5.1_FR.pdf`) (feet in English, metres in French, at 1.5 m to 5 feet). The data is `lib/srd/`; `spells.ts` was generated from both SRDs' text, so fix a spell there by checking both. A character's choices are `lib/character.ts` (a zod schema, as saved), and everything on the sheet is worked out from them in `lib/rules.ts` (plain functions with tests), never stored. Characters stay in the visitor's browser (`lib/storage.ts`, key `tools:character-maker:v1`), five at most: a new or imported one never goes over another, and deleting offers an export first. A character exports as PDF (the sheet, through the print dialog) or as JSON (`lib/transfer.ts`, format `irmahs-character`, with a `version`: Mini Games' one-shot will read it, so a change to its shape raises the version). Each character keeps the rule packs it was made with (`lib/packs.ts`, `srd-5.2.1` and `srd-5.1`; an SRD 5.1 entry's id starts with `srd-5.1:`), and the rules only offer and read what those packs hold (`optionsFor` in `lib/rules.ts`): never import a pack's data (`lib/srd/`) into the rules or the steps directly. An entry's id is unique across every pack. What a species or class does differently is data on its entry (`skillChoice`, `featChoice`, `hitPointsPerLevel`, `martialArtsDie`, `masteryMeleeOnly`…), never a check on its id; the plan for more packs is the "Character Maker Packs" note in Irma's notes. Players can also make packs of their own (`lib/own-packs.ts`, edited at `/character-maker/packs/<id>` in `components/pack-editor.tsx`): species, backgrounds, spells and subclasses they type in from a book they own or their homebrew. These stay in their browser (key `tools:character-maker:packs:v1`, ten at most), export and import as a pack file (format `irmahs-character-pack`), and go whole into the `homemade` part of a character file that uses them. The maker never ships any of it: a player's own pack is theirs, typed once in their language (`Words` with the same text in both). Their ids start with `own-`, and an entry's id is `<pack id>:<entry id>`; a spell or subclass made for a class fits both its 2024 and 2014 versions (`toPack`). The subclass (`lib/srd/subclasses.ts`, the SRD's one per class) is picked at the start as a house rule, its level 3 features listed as text. The sheet (`components/sheet.tsx`) is paper in both themes, and the print styles at the end of `src/styles.css` keep only it.

**Album Cover Maker** (`src/tools/album-cover-maker/`, at `/album-cover-maker`, the maker at `/album-cover-maker/make`, `paths.ts`) was its own app at album-cover-maker.irmahs.dev (irmahs-labs/album-cover-maker, to be archived, where its history is); that address no longer answers (irmahs-labs/proxy#19). It keeps its own brand in its header (its record logo, linking back to every tool, and its name, linking to its landing page), and its landing page links back to every tool.

## Languages

The app reads in English or French. The choice is `src/lib/language.ts`: kept in localStorage and in a `lang` cookie on `irmahs.dev` that every irmahs.dev app reads and writes, so one pick carries across the apps; the header's EN/FR pill (`src/components/language-toggle.tsx`) switches it. Every string a visitor sees has both versions, in a `COPY = { en, fr }` object beside the component that shows it (`useCopy(COPY)`), the maker's in `src/tools/album-cover-maker/components/maker-copy.ts`. Window and file names (`cover.png`, `hello.txt`) stay as they are in both.

## Design

Album Cover Maker is the app Cute Matcha's _Apps_ section was drawn from, and the whole of Tools shares its look. It works in both of the system's themes: Light Matcha, and Dark Matcha (a mid-tone matcha page, cards a step lighter, the header, buttons and fields a darker well, near-black outlines and shadows). Colours are its role tokens, named by job (`ground`, `panel`, `header`, `raised`, `text`, `text-muted`, `accent`, `on-accent`, `pop`, `on-pop`, `strong`, `selected`, …), at the top of `src/styles.css`: Light Matcha on `:root`, Dark Matcha on `:root[data-theme="dark"]`. Pick a token by what the thing is, never a hex: the primary pill is `pop`, the yellow accent kept for the one call to action on a screen (48px tall, sinking into its hard shadow when pressed), a chosen option, combo, font or switch is `selected`, legends, title bars and the export button are `strong`. Every surface sets its own text: `text` on `panel` and `raised`, `on-accent` on `accent` (the lime windows), `on-strong` on `strong`, `on-selected` on `selected`. The inline script in `index.html` sets `data-theme` before the first paint, from the visitor's saved choice or else the device's setting; `src/lib/theme.ts` keeps it, and the header's sun/moon pill saves a choice. The cover, the record and the player mock-up are artwork and keep their own colours.

The app's own type is Fredoka (the name, titles, legends, window names) and Nunito Sans (everything else), self-hosted like the cover fonts: they're the `UI` families in `scripts/font-faces.mjs`. The hub's hello window and tool cards, Album Cover Maker's landing page windows and the maker's three previews are **Windows** (`src/components/window.tsx`), a title bar over a lime body. A window is named like a file, in kebab-case with an extension that exists and fits what it holds (`hello.txt`, `how-it-works.md`, `album-cover-maker.exe`, `cover.png`, `player.exe`, `record.jpeg`). A settings **panel**, named on its legend pill, takes a plain lowercase name with no extension (`photo`, `cover text`, `fonts`, `combos`). Corners are concentric: a panel is `--radius-panel` (20px) with 16px of padding on top and 12px elsewhere, fields and toggles inside take `--radius-field` (8px), a window is 9px and the boxes inside it `--radius-xs` (2px). Screen icons are a 24 grid at 2px, and the footer says only 'more apps at irmahs.dev'. App icons draw with only three colours, as the Book of Shadows' does: the lime tile (`#d4dd9c`, with its lighter green `#afc584` for details), the cream `#fff3cf` and the dark green `#2f3b34`; never yellow, gold, red or another lime. The Tools icon (`src/components/tools-logo.tsx`) is a lime toolbox in fixed Light Matcha colours with a `text` rim; `public/favicon.svg` is the same drawing. The header ends with the **account pill** (`src/components/account-button.tsx`): "sign in" with Google's mark, or the person's picture and first name, linking to the IrmaHS Labs account page. It asks `auth.irmahs.dev` who is signed in from the browser (`src/lib/session.ts`); that check is the one request allowed to leave the site, and the end-to-end test allows exactly it.

## Footer and privacy

Every page's footer links the legal pages (legal notice, privacy, terms of use, cookies), which live on irmahs.dev (`src/components/footer.tsx`, `src/components/site-links.tsx`). The privacy policy there (`src/lib/legal.ts`) describes what the apps collect by kind, not app by app, with every cookie and outside service named: a change that brings a new kind of personal data, a new cookie, or a new outside service updates it in the same change (a PR in irmahs-labs/landing-page); a new game or setting that keeps the same kinds of data does not. Nothing may need a consent banner: no analytics, ads or tracking cookies.
