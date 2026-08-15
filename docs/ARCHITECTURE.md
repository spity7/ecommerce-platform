# Ecommerce Platform Architecture

Multipurpose ecommerce monorepo: one codebase, many site deployments.

## Layout

```
ecommerce-platform/
├── client/                 # Storefront (Next.js)
├── admin/                  # Admin dashboard (Next.js)
├── server/                 # API (Express + MongoDB)
├── packages/
│   ├── shared/             # Types + Zod schemas
│   └── site-config/        # Site registry + getSiteConfig()
├── sites/
│   └── beauty-station/     # Site env examples + docs
├── scripts/                # create-site CLI
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
npm run build:shared
npm run dev:server   # :5000
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

## API (catalog)

- `GET/POST /api/products`
- `GET/PATCH/DELETE /api/products/:id`
- `GET/POST /api/categories`
- `GET/POST /api/brands`
- `GET/POST /api/attributes`
- `GET /api/health`

## Feature flags

Site-specific modules are toggled in site config (`features.*`). Admin navigation can be extended to hide sections when disabled.

## Extensibility

- **Extra product fields:** use Attributes (DB-driven) or `product.metadata`
- **New modules:** add optional server routes + admin pages behind `features` flags
- **One-off custom logic:** `sites/{id}/extensions/` (keep minimal)
