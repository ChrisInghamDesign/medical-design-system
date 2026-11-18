# Medical design system

A Next.js + [shadcn/ui](https://ui.shadcn.com) app themed with the **Medical** design system (Vega style, zinc base, HugeIcons, Inter), forked in [DS Manager](https://manager.shadcndesign.com).

- `app/globals.css`: the design tokens (light and dark)
- `components/ui/`: every shadcn/ui component, styled with this theme
- `app/page.tsx`: a showcase page using the theme
- `components.json`: shadcn CLI config

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Updating from DS Manager

1. Make changes to **Medical (fork)** in DS Manager, then **Get code > Publish**.
2. In this repo, go to **Actions > Sync design system > Run workflow**.

The workflow pulls the latest tokens and components, checks the app still builds, and commits the changes.

To update by hand instead:

```bash
npx shadcn@latest init --preset https://manager.shadcndesign.com/u/mECmLpbfYTpb7nZlCv12D3VMheWaph7V/r/medical-copy/medical-copy.json --force --no-reinstall
```

Note: the sync replaces everything in `components/ui/`, so put your own components elsewhere (e.g. `components/`).
