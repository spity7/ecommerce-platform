# Ecommerce Platform — Antigravity / Gemini overrides

Read **[AGENTS.md](AGENTS.md)** first — it is the shared base for all AI tools.

## Antigravity-specific notes

- Prefer **`docs/AI-INDEX.md`** as the table of contents before diving into individual docs.
- When editing the API contract, run **`npm run api:generate`** from repo root and commit both `openapi.json` and `packages/api-client/src/generated/`.
- The storefront (`client/`) is a large **theme demo** (~300 routes). Only wire new API calls where product asks; default to static `data/*` for demo pages.
- Admin (`admin/`) is mostly template UI — catalog list pages are the primary API integration today.

## No extra overrides

If this file has no additional rules beyond AGENTS.md, Antigravity should follow AGENTS.md and `.cursor/rules/*.mdc` exactly.
