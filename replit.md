# Velouria: The Compositional Guide

A browser-based reference guide for composing Velouria-style ambient and chamber-inspired electronic music, with transposable harmony, notation, piano rolls, and sound-design guidance.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- Start the managed `artifacts/velouria-guide: web` workflow to run the React/Vite guide with its registered preview route and assigned port.
- GitHub Pages: `.github/workflows/deploy-pages.yml` builds and deploys the guide on pushes to `main`, with an optional manual trigger. Build only the guide with `PORT=5173 BASE_PATH=/velouria/ pnpm --filter @workspace/velouria-guide run build`.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The guide is client-only and does not require a database or API connection.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Guide: React, Vite, TypeScript
- Original reference implementation: Python 3.11, Streamlit
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/velouria-guide/src/` — active browser interface, music data, and SVG diagram generation
- `app.py` and `velouria/music.py` — original Streamlit reference implementation

## Architecture decisions

- The guide includes playable piano-roll previews, as requested by the user. It does not export audio or MIDI files.
- Piano previews use a local Web Audio felt-style tone model, not a recorded felt-piano sample library. This keeps playback self-contained on GitHub Pages without external sample downloads; describe the sound as modeled or felt-style, not as a recording of a real felt piano.
- Piano rolls and staff examples are SVGs generated from the same pitch data used by the transposition selector.
- The user chose a browser-only rebuild for GitHub Pages because Pages cannot host the Python/Streamlit runtime. Replit preview and Pages now use the same React implementation; retain the Python files as reference.
- Asset URLs must honor `import.meta.env.BASE_URL` so the guide works at both Replit's root preview and GitHub Pages' repository subpath.

## Product

The guide teaches suspended dyads, short melodic fragments, eight compositional variations, sound-design recipes, and environmental depth. Selecting a tonal center transposes the musical examples across all modules.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
