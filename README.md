# Ecommerce Platform

Multipurpose ecommerce monorepo. **Beauty Station** is the first site instance.

## Structure

- `client/` — storefront
- `admin/` — admin dashboard
- `server/` — Express API
- `packages/shared` — shared types & validation
- `packages/site-config` — per-site configuration registry
- `sites/beauty-station/` — Beauty Station env template

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full picture.

## Quick start

```bash
npm install
npm run build:shared
npm run dev:server
npm run seed
npm run dev:admin
npm run dev:client
```

| App        | URL                   |
| ---------- | --------------------- |
| Storefront | http://localhost:3000 |
| Admin      | http://localhost:3001 |
| API        | http://localhost:5000 |

Copy `.env.example` from each app (and `sites/beauty-station/.env.example`) into `.env.local` / `.env` as needed.

## New site

```bash
npm run create-site sport-shop -- --template sport
```
