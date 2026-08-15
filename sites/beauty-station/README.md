# Beauty Station — site instance

Canonical config: `packages/site-config/src/sites/beauty-station.ts`

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
