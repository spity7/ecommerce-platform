# Beauty Station — site instance

Canonical config: `packages/site-config/src/sites/beauty-station.ts`  
Registry entry: [docs/site-registry.json](../../docs/site-registry.json) (features must match config)  
Platform docs: [docs/AI-INDEX.md](../../docs/AI-INDEX.md), [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)

Copy `.env.example` values into each app (`client`, `admin`, `server`) for local development.

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
