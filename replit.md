# Velouria: The Compositional Guide

A Streamlit reference guide for composing Velouria-style ambient and chamber-inspired electronic music, with transposable harmony, notation, piano rolls, and sound-design guidance.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `streamlit run app.py --server.port 5000 --server.address 0.0.0.0` — run the Velouria guide
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Python 3.11, Streamlit
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `app.py` — Streamlit interface and five instructional modules
- `velouria/music.py` — pitch transposition, progression data, and SVG notation / piano-roll diagrams

## Architecture decisions

- The app is an instructional guide only; it does not generate or export audio or MIDI.
- Piano rolls and staff examples are SVGs generated from the same pitch data used by the transposition selector.

## Product

The guide teaches suspended dyads, short melodic fragments, eight compositional variations, sound-design recipes, and environmental depth. Selecting a tonal center transposes the musical examples across all modules.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
