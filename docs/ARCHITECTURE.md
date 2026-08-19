# Ecommerce Platform Architecture

Multipurpose ecommerce monorepo: one codebase, many site deployments.

## Layout

```
ecommerce-platform/
├── client/                 # Storefront (Next.js)
├── admin/                  # Admin dashboard (Next.js)
├── server/                 # API (Express + MongoDB)
├── packages/
│   ├── shared/             # Types + Zod schemas (source of truth)
│   ├── api-client/         # Orval-generated typed API client
│   └── site-config/        # Site registry + getSiteConfig()
├── sites/
│   └── beauty-station/     # Site env examples + docs
├── scripts/                # create-site CLI, API contract checks
├── orval.config.ts         # Orval config (OpenAPI → client)
└── docs/                   # Architecture + site registry
```

## Platform vs site

| Layer           | Location                                  | Per new website?        |
| --------------- | ----------------------------------------- | ----------------------- |
| Platform code   | `client`, `admin`, `server`, `packages/*` | No — redeploy same code |
| Site config     | `packages/site-config/src/sites/{id}.ts`  | Yes — add config file   |
| Site assets/env | `sites/{id}/.env.example`                 | Yes                     |
| Data            | MongoDB database per site                 | Yes                     |
| Media           | GCS bucket per site                       | Yes                     |

## Beauty Station (site #1)

- **Home layout:** `cosmetic-beauty-two` (not `home-cosmetic-beauty`)
- **Site ID:** `beauty-station`
- **Database:** `beauty-station`

## Environment variables

Each app reads:

- `SITE_ID` / `NEXT_PUBLIC_SITE_ID` — selects site config
- `MONGODB_URI` — server only, one DB per site
- `API_URL` / `NEXT_PUBLIC_API_URL` — admin + client → server

## Local development

```bash
# From repo root
npm install
npm run build:packages
npm run dev:server   # :5000 — Swagger UI at /api/docs
npm run seed         # seed beauty-station DB
npm run dev:admin    # :3001
npm run dev:client   # :3000
```

## Adding a new site

```bash
npm run create-site sport-shop -- --template sport
```

Then:

1. Add config in `packages/site-config/src/sites/sport-shop.ts`
2. Register in `packages/site-config/src/index.ts`
3. Add entry to `docs/site-registry.json`
4. Create MongoDB + GCS + deploy with new env vars

## API contract (OpenAPI + Orval)

The API is documented with **OpenAPI 3** and consumed by frontends through a generated **Orval** client.

### Source of truth

| Layer            | Location                                      | Role                                          |
| ---------------- | --------------------------------------------- | --------------------------------------------- |
| Zod schemas      | `packages/shared/src/schemas/`                | Request validation + DTO shapes               |
| OpenAPI registry | `server/src/openapi/registry.ts`              | Path/response definitions                     |
| OpenAPI spec     | `packages/api-client/openapi.json`            | Committed contract artifact                   |
| Generated client | `packages/api-client/src/generated/client.ts` | Single Orval output (types + fetch functions) |

### Live docs (dev server)

| URL                                      | Description      |
| ---------------------------------------- | ---------------- |
| `http://localhost:5000/api/docs`         | Swagger UI       |
| `http://localhost:5000/api/openapi.json` | Raw OpenAPI JSON |

### Commands

```bash
# Regenerate spec + client after API changes (Orval + Prettier)
npm run api:generate

# Auto-regenerate when contract inputs change (used by dev:server/admin/client)
npm run api:ensure

# Watch contract inputs and regenerate on save (optional, for API-heavy work)
npm run api:watch

# Format only API contract artifacts
npm run api:format

# Verify committed artifacts match the registry (used in CI)
npm run api:check

# Build shared, site-config, and api-client
npm run build:packages
```

### Changing the API

1. Update Zod schemas in `@platform/shared` (request + DTO schemas).
2. Register or update paths in `server/src/openapi/registry.ts`.
3. Implement route handlers in `server/src/routes/`.
4. Run `npm run api:generate` (or just restart any dev app — `api:ensure` runs automatically).
5. Commit `openapi.json` and `packages/api-client/src/generated/client.ts`.
6. Use the new functions from `@platform/api-client` in `admin` / `client`.

### Orval output

The client is generated as **one file** (`client.ts`) with Orval `mode: single`. That keeps types and fetch helpers together without hundreds of per-schema or per-tag files. `api:generate` runs Orval with `prettier: true`, then formats `openapi.json`, `orval.config.ts`, and `packages/api-client/src` via the root Prettier config (`.prettierrc.json`).

**Safety net:** `dev:server`, `dev:admin`, and `dev:client` call `api:ensure` first. If `packages/shared` or `server/src/openapi` changed since the last generation, it runs `api:generate` automatically. Set `SKIP_API_GENERATE=1` to only warn. Use `api:watch` while actively editing the API.

Import from `@platform/api-client` — the package `index.ts` re-exports the generated client and adds small convenience wrappers (`fetchProducts`, etc.).

```ts
import { fetchProducts, listProduct } from "@platform/api-client";

// Convenience wrapper — returns paginated data directly
const page = await fetchProducts({ status: "published", limit: 20 });

// Raw Orval function — returns { data, status, headers }
const response = await listProduct({ status: "published" });
const items = response.data;
```

Admin and client import API helpers directly from `@platform/api-client`.

### CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and PR:

1. `npm run api:check` — fails if the OpenAPI spec or generated client is stale
2. `npm run typecheck` — full monorepo type check

## API (catalog)

- `GET/POST /api/products`
- `GET/PATCH/DELETE /api/products/:id`
- `GET/POST /api/categories`
- `GET/PATCH/DELETE /api/categories/:id`
- `GET/POST /api/brands`
- `GET/PATCH/DELETE /api/brands/:id`
- `GET/POST /api/attributes`
- `GET/PATCH/DELETE /api/attributes/:id`
- `POST /api/uploads`
- `GET /api/health`

## Feature flags

Site-specific modules are toggled in site config (`features.*`). Admin navigation can be extended to hide sections when disabled.

## Extensibility

- **Extra product fields:** use Attributes (DB-driven) or `product.metadata`
- **New modules:** add optional server routes + admin pages behind `features` flags
- **One-off custom logic:** `sites/{id}/extensions/` (keep minimal)
