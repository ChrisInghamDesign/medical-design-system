<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Design system rules

- The design system's source of truth is `design-system/tokens.json` (library-neutral tokens). Don't hand-edit `app/theme.css`; it's generated from tokens.json by `npm run ds:build` or by the editor at `/editor`.
- Values listed under `locks` in `design-system/tokens.json` are locked. Never change a locked value (e.g. `colors.light.primary`, `radius`), in tokens.json or by overriding it in components or CSS.
- Use the theme's tokens (Tailwind classes like `bg-primary`, `text-muted-foreground`, `rounded-lg`, `shadow-sm`) rather than hard-coded colours, radii or shadows.
- `components/ui/` is replaced whenever the DS Manager sync runs. Put custom components elsewhere.
