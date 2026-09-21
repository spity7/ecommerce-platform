# Beauty Station — site instance

Canonical config: `packages/site-config/src/sites/beauty-station.ts`  
Registry entry: [docs/site-registry.json](../../docs/site-registry.json) (features must match config)  
Platform docs: [docs/AI-INDEX.md](../../docs/AI-INDEX.md), [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md)

Copy `.env.example` values into each app (`client`, `admin`, `server`) for local development.

| Target              | Vars from site `.env.example`                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `server/.env`       | `SITE_ID`, Mongo, GCS, JWT, `SMTP_*` (secrets; From = site config `contact.email`)                |
| `admin/.env.local`  | `SITE_ID`, `NEXT_PUBLIC_SITE_ID`, API URLs, cookie max-age                                        |
| `client/.env.local` | `NEXT_PUBLIC_SITE_ID`, API URLs, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FORMSPREE_ENDPOINT`, Google |

**Admin access:** register via `POST /api/auth/register`, then set `role: "admin"` on that user in MongoDB. Run `npm run seed` for catalog demo data (dataset follows `homeLayout`: beauty, sport, or general).

## Google sign-in (optional)

1. Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Web client.
2. Authorized JavaScript origins: `http://localhost:3000` (and production storefront URL).
3. Set the same client ID in `server/.env` as `GOOGLE_CLIENT_ID` and in `client/.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

## Email

| Channel                            | Source                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------- |
| Storefront mailto / legal pages    | `SiteConfig.contact.email` via `getSiteContactInfo()` / `SiteContactLinks` |
| Contact form (`/contact`)          | `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in client env                             |
| Auth mail (verify, password reset) | Server `SMTP_*` on this deploy; From = `contact.email` in site config      |

Password reset and registration verification use `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. Without SMTP, dev logs link tokens to the server console. Public address: **Beautystation961@gmail.com** in site config — set Gmail app password in `server/.env` for that mailbox only on the Beauty Station API instance.

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
