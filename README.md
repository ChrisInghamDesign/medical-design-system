# Medical design system

A Next.js + [shadcn/ui](https://ui.shadcn.com) app with its own **design system editor**: edit colours, type, radius, shadows, spacing, controls, icons, brand and individual components on a live canvas of the real components, then save straight back to this repo.

- **Editor:** https://chrisinghamdesign.github.io/medical-design-system/editor/
- **App / showcase:** https://chrisinghamdesign.github.io/medical-design-system/

## How it fits together

```
design-system/tokens.json   ← source of truth (library-neutral tokens)
        │
        ├─ shadcn adapter ──► app/theme.css   (CSS variables for components/ui)
        └─ (next adapter, e.g. MUI) ──► its own theme file
```

| Path | What it is |
| --- | --- |
| `design-system/tokens.json` | Colours (light, dark and custom), fonts, type scale, weights, letter spacing, radius steps, spacing, shadows, control heights and focus, icon stroke, brand files, menu style, component style changes, lint rules and locks. Not tied to any library. |
| `design-system/component-classes.json` | Generated. The Tailwind classes each component ships with, shown on the editor's Utilities tab. |
| `lib/ds/` | Token model, colour maths, Google Fonts, GitHub saving, and the library **adapters**. |
| `lib/ds/adapters/shadcn.ts` | Turns tokens into `app/theme.css` (variables plus component style changes keyed by `data-slot`/`data-variant`/`data-size`), and reads shadcn CSS back into tokens. |
| `lib/ds/lint-rules.mjs`, `lib/ds/eslint-plugin.mjs` | The design system lint rules, shared by `npm run lint` and the editor's Lint page. |
| `components/brand.tsx` | Generated `<Logo />` and `<Mark />` from the Brand page. |
| `app/theme.css` | Generated. Loaded after `globals.css` so the tokens win. Don't edit by hand. |
| `app/editor/` + `components/editor/` | The editor (top bar, sidebar, canvas, inspector). |
| `components/editor/canvas/` | What the canvas shows: overview screen, foundations and component demos per library. |
| `components/ui/` | shadcn/ui components (replaced by the DS Manager sync). |
| `scripts/design-system.ts` | `npm run ds:build` regenerates outputs from tokens.json; `npm run ds:import` reads `app/globals.css` into tokens.json. |

## Using the editor

1. Open the [editor](https://chrisinghamdesign.github.io/medical-design-system/editor/).
2. Pick a page in the sidebar and edit in the inspector on the right. Light/dark and desktop/tablet/mobile toggles are in the top bar.
   - **Overview**: the showcase screen. Click any part to edit that component in place.
   - **Style**: menu colour and highlight, base style, import a preset.
   - **All components**: a card per component; click one to open it.
   - **Lint**: check the code on GitHub against the design system rules, set how strict they are, and manage locks.
   - **Foundations**: Colors (base colour presets, custom colours, contrast checks), Typography (fonts, sizes, line heights, weights, letter spacing), Radius (base and each step), Shadows, Spacing, Controls (heights and focus), Icons (stroke), Brand (logo, mark, favicon as SVG). Each has Docs and Preview.
   - **Components**: examples of every variant, a Matrix of variant × size for the main ones, and Layers. Use **Select** to click a part, then change its layout, type, colours, border, radius, shadow and more for all variants or one variant, size and state (hover, focus, pressed, disabled, open). **Interact** lets you use the components normally. **Utilities** shows the classes the part ships with and the CSS your change generates.
3. Click **Save**. The first time, it walks you through creating a GitHub token (fine-grained, this repo only, Contents: Read and write). The token stays in your browser.
4. Saving commits `tokens.json`, every adapter's output and any uploaded brand files in one commit. The site redeploys in about 2 minutes.

Unsaved edits (including uploaded files) are kept in your browser if you close the tab. **Export** copies or downloads `theme.css` / `tokens.json`, and **Import CSS** pastes in a shadcn theme from anywhere (DS Manager's Get CSS, tweakcn, ui.shadcn.com/themes).

The lock icon next to any value, or a whole-area lock on the Lint page, stops it being edited or imported over, and AI tools are told to leave locked values alone (see `AGENTS.md`).

## Lint

`npm run lint` runs ESLint with the design system rules (restyling, raw colours, made-up sizes, inline styles, colour typos, dynamic classes) at the levels set on the editor's Lint page. The **Lint** GitHub check runs it on every push and pull request.

## Adding another component library (e.g. MUI)

1. Add `lib/ds/adapters/mui.ts` exporting a `LibraryAdapter` whose `outputs` generate the MUI theme file (e.g. `design-system/mui-theme.ts` from `createTheme`), mapping tokens like `primary`, `background`, `radius` and the fonts onto MUI's palette, shape and typography.
2. Register it in `lib/ds/adapters/index.ts`.
3. Add a canvas with MUI component demos under `components/editor/canvas/mui/` and register it in `components/editor/canvas/registry.tsx`.
4. Map component style changes (`tokens.overrides`: part, variant, size, state, CSS properties) onto MUI's `styleOverrides`.

The editor, the tokens and saving don't change.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (app) or http://localhost:3000/editor/ (editor).

## DS Manager sync (optional)

**Actions › Sync design system › Run workflow** pulls the latest publish of *Medical (fork)* from [DS Manager](https://manager.shadcndesign.com), updates `components/ui/`, and re-imports its colours, radius and shadows into `tokens.json`. That replaces editor changes made since, so only run it when you want DS Manager's version.
