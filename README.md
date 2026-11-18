# Medical design system

A Next.js + [shadcn/ui](https://ui.shadcn.com) app with its own **design system editor**: edit colours, type, radius, shadows and spacing on a live canvas of the real components, then save straight back to this repo.

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
| `design-system/tokens.json` | Colours (light and dark), fonts, radius, spacing, shadows and locks. Not tied to any library. |
| `lib/ds/` | Token model, colour maths, Google Fonts, GitHub saving, and the library **adapters**. |
| `lib/ds/adapters/shadcn.ts` | Turns tokens into `app/theme.css`, and reads shadcn CSS back into tokens. |
| `app/theme.css` | Generated. Loaded after `globals.css` so the tokens win. Don't edit by hand. |
| `app/editor/` + `components/editor/` | The editor (top bar, sidebar, canvas, inspector). |
| `components/editor/canvas/` | What the canvas shows: overview screen, foundations and component demos per library. |
| `components/ui/` | shadcn/ui components (replaced by the DS Manager sync). |
| `scripts/design-system.ts` | `npm run ds:build` regenerates outputs from tokens.json; `npm run ds:import` reads `app/globals.css` into tokens.json. |

## Using the editor

1. Open the [editor](https://chrisinghamdesign.github.io/medical-design-system/editor/).
2. Pick **Overview**, a foundation (Colors, Typography, Radius, Shadows, Spacing) or a component in the sidebar, and edit in the inspector on the right. Light/dark and desktop/tablet/mobile toggles are in the top bar.
3. Click **Save**. The first time, it walks you through creating a GitHub token (fine-grained, this repo only, Contents: Read and write). The token stays in your browser.
4. Saving commits `tokens.json` and every adapter's output in one commit. The site redeploys in about 2 minutes.

Unsaved edits are kept in your browser if you close the tab. **Export** copies or downloads `theme.css` / `tokens.json`, and **Import CSS** pastes in a shadcn theme from anywhere (DS Manager's Get CSS, tweakcn, ui.shadcn.com/themes).

The lock icon next to any value stops it being edited or imported over, and AI tools are told to leave locked values alone (see `AGENTS.md`).

## Adding another component library (e.g. MUI)

1. Add `lib/ds/adapters/mui.ts` exporting a `LibraryAdapter` whose `outputs` generate the MUI theme file (e.g. `design-system/mui-theme.ts` from `createTheme`), mapping tokens like `primary`, `background`, `radius` and the fonts onto MUI's palette, shape and typography.
2. Register it in `lib/ds/adapters/index.ts`.
3. Add a canvas with MUI component demos under `components/editor/canvas/mui/` and register it in `components/editor/canvas/registry.tsx`.

The editor, the tokens and saving don't change.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (app) or http://localhost:3000/editor/ (editor).

## DS Manager sync (optional)

**Actions › Sync design system › Run workflow** pulls the latest publish of *Medical (fork)* from [DS Manager](https://manager.shadcndesign.com), updates `components/ui/`, and re-imports its colours, radius and shadows into `tokens.json`. That replaces editor changes made since, so only run it when you want DS Manager's version.
