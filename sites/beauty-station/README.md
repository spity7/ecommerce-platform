# Beauty Station — site instance

Canonical config: `packages/site-config/src/sites/beauty-station.ts`  
Registry entry: [docs/site-registry.json](../../docs/site-registry.json) (features must match config)  
Platform docs: [docs/AI-INDEX.md](../../docs/AI-INDEX.md), [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)

Copy `.env.example` values into each app (`client`, `admin`, `server`) for local development.

| Target              | Vars from site `.env.example`                              |
| ------------------- | ---------------------------------------------------------- |
| `server/.env`       | `SITE_ID`, Mongo, GCS, JWT                                 |
| `admin/.env.local`  | `SITE_ID`, `NEXT_PUBLIC_SITE_ID`, API URLs, cookie max-age |
| `client/.env.local` | `NEXT_PUBLIC_SITE_ID`, API URLs, `NEXT_PUBLIC_SITE_URL`    |

**Admin access:** register via `POST /api/auth/register`, then set `role: "admin"` on that user in MongoDB. Run `npm run seed` for catalog demo data (dataset follows `homeLayout`: beauty, sport, or general).

## Resources (production)

| Resource   | Value                                   |
| ---------- | --------------------------------------- |
| Site ID    | `beauty-station`                        |
| MongoDB    | database name `beauty-station`          |
| GCS bucket | `beauty-station-media` (or your bucket) |
| Storefront | https://beautystation.com               |
| Admin      | https://admin.beautystation.com         |
| API        | https://api.beautystation.com           |

## Home layout

Uses `cosmetic-beauty-two` (not `home-cosmetic-beauty`).
