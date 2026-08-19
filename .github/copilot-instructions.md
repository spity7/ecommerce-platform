# GitHub Copilot instructions

Follow [AGENTS.md](../AGENTS.md) and [docs/AI-INDEX.md](../docs/AI-INDEX.md) for this monorepo.

## Essentials

- npm workspaces monorepo; run root scripts from repo root.
- Node **20.x**. Workspaces: `@platform/storefront` (client/), `@platform/admin`, `@platform/server`, `packages/*`.
- Multi-site via `SITE_ID` / `NEXT_PUBLIC_SITE_ID` and `@platform/site-config`.
- API client is Orval-generated — never edit `packages/api-client/src/generated/**`; run `npm run api:generate`.
- Auth is **not** implemented on API or admin.
- Storefront is mostly theme demos; admin catalog list pages are the main API integration.

When changing contracts, routes, or conventions, update docs per `.cursor/rules/documentation-sync.mdc`.
