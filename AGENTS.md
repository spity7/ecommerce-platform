<!-- BEGIN:nextjs-agent-rules -->

# Ecommerce Platform — agent guide

Cross-tool entry point (**Cursor**, **Claude Code**, **Antigravity / Gemini**, **GitHub Copilot**, etc.). Copilot also reads **[.github/copilot-instructions.md](.github/copilot-instructions.md)**.

**Antigravity:** also reads **[GEMINI.md](GEMINI.md)** (Antigravity-only overrides; this file stays the shared base).

## Read first

| Topic                               | Document                                                    |
| ----------------------------------- | ----------------------------------------------------------- |
| **Navigation hub**                  | [docs/AI-INDEX.md](docs/AI-INDEX.md)                        |
| **Monorepo layout, multi-site, CI** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                |
| **API routes + app surfaces**       | [docs/ROUTES.md](docs/ROUTES.md)                            |
| **Code conventions per workspace**  | [docs/CONVENTIONS.md](docs/CONVENTIONS.md)                  |
| **OpenAPI / Orval pipeline**        | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) § API contract |
| **Cursor enforcement**              | `.cursor/rules/*.mdc`                                       |
| **Claude Code commands**            | [CLAUDE.md](CLAUDE.md)                                      |

## Quick facts

- **Monorepo:** npm workspaces — `client` (`@platform/storefront`), `admin` (`@platform/admin`), `server` (`@platform/server`), `packages/*`.
- **Node:** **20.x** (root `engines`). Run commands from repo root unless noted.
- **Multi-site:** `SITE_ID` / `NEXT_PUBLIC_SITE_ID` → `getSiteConfig()` from `@platform/site-config`. First site: **beauty-station**.
- **API client:** Orval from OpenAPI — **do not edit** `packages/api-client/src/generated/**` by hand. Run `npm run api:generate` after contract changes.
- **Auth:** JWT API + admin sign-in (admin role enforced in UI and proxy). Admin and storefront use **httpOnly cookies** via each app’s `/api/auth/*` BFF routes; access tokens are also held in memory for cross-origin API calls. Logout revokes refresh tokens (`refreshTokenVersion`). Storefront: Google sign-in, email verification on register, verified email required to place orders, OAuth users can delete/set password via Google `idToken` confirmation. Customer auth when `features.customerAuth`.
- **Integration maturity:** Server catalog + cart/orders/wishlist API (referential delete guards, rename propagation, attribute usage counts); admin catalog CRUD + product attribute picker + feature-filtered nav; client `/shop`/`/product/[slug]` + customer auth + wishlist sync when `features.wishlist`.

## Common commands

```bash
npm install
npm run build:packages
npm run dev:server    # :5000 — Swagger at /api/docs
npm run seed
npm run dev:admin     # :3001
npm run dev:client    # :3000

npm run api:generate  # After OpenAPI / shared schema changes
npm run typecheck     # Full monorepo
npm run test          # API integration tests (MongoDB required)
npm run format:check  # Prettier across workspaces
```

## When you change code

Follow **[.cursor/rules/documentation-sync.mdc](.cursor/rules/documentation-sync.mdc)** — update the matching doc in the **same task** when behavior, contracts, routes, or conventions change. Set **Last reviewed** dates in `docs/AI-INDEX.md`.

## Cursor rules

### Always apply (`.cursor/rules/`)

| Rule                     | Scope                                 |
| ------------------------ | ------------------------------------- |
| `documentation-sync.mdc` | Keep docs in sync after changes       |
| `api-contract.mdc`       | OpenAPI, Zod, Orval, generated client |
| `multi-site.mdc`         | Site config, env vars, new sites      |

### Scoped by path (`.cursor/rules/`)

| Rule                | Globs         |
| ------------------- | ------------- |
| `storefront-ui.mdc` | `client/**/*` |
| `admin-ui.mdc`      | `admin/**/*`  |

### Client workspace (`.cursor/rules/` under `client/`)

| Rule                                                     | Scope                                             |
| -------------------------------------------------------- | ------------------------------------------------- |
| `client/.cursor/rules/product-tab-filtering-pattern.mdc` | Tab-driven product sections (`alwaysApply: true`) |

<!-- END:nextjs-agent-rules -->
