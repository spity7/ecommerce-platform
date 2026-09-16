# Storefront (`@platform/storefront`)

Next.js storefront for the ecommerce platform. Folder name: `client/`. Runs on **port 3000** in development.

Part of the monorepo — run commands from **repo root** unless noted. Platform docs: [AGENTS.md](../AGENTS.md), [docs/AI-INDEX.md](../docs/AI-INDEX.md), [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [docs/CONVENTIONS.md](../docs/CONVENTIONS.md).

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Bootstrap 5 + Sass, Swiper, GSAP, Lightgallery
- Zustand (cart, wishlist, compare — cart/compare persist locally; server wishlist when `features.wishlist`)
- `@platform/site-config` for multi-site theming and home layout

## Prerequisites

- Node.js **20.x**

## Development

From repo root:

```bash
npm run dev:client
```

Webpack instead of Turbopack:

```bash
npm run dev:webpack -w @platform/storefront
```

Open [http://localhost:3000](http://localhost:3000).

### Dev overlay stuck on “Compiling…”

The bottom-left badge is normal while Turbopack/Webpack is building or while a slow server render runs (the home layout fetches live products from the API). If it **never** clears while you are idle:

1. Stop the dev server, clear the Turbopack cache, and restart: `npm run dev:clean -w @platform/storefront`
2. Avoid running `npm run build:packages` in another terminal while the storefront dev server is running — updating `packages/*/dist` forces a full client rebuild.
3. If it still loops, use Webpack dev (narrower file watching in this monorepo): `npm run dev:webpack -w @platform/storefront`

## Environment

Copy `client/.env.example` → `client/.env.local`:

- `NEXT_PUBLIC_SITE_ID` — site config (default `beauty-station`)
- `NEXT_PUBLIC_API_URL` — backend for API-integrated blocks

## Scripts

| Command                                       | Purpose                |
| --------------------------------------------- | ---------------------- |
| `npm run dev -w @platform/storefront`         | Dev server (Turbopack) |
| `npm run dev:webpack -w @platform/storefront` | Dev with Webpack       |
| `npm run build -w @platform/storefront`       | Production build       |
| `npm run lint -w @platform/storefront`        | ESLint                 |
| `npm run analyze -w @platform/storefront`     | Bundle analyzer        |
| `npm run rebrand -w @platform/storefront`     | Rebrand helper script  |

## Project structure

```text
app/              App Router — many theme demo route groups
components/       UI blocks, home sections, modals, site shell
context/          Zustand stores (cart, wishlist, ui)
data/             Static demo catalog (products, blogs, …)
hooks/            Custom React hooks
lib/              Site config, utilities
public/           Images, fonts, SCSS
```

## Production vs demo

- **`/`** renders the site-specific home layout (`HomeLayoutRenderer` → Beauty Station uses `cosmetic-beauty-two`).
- **~300 demo routes** under `(homes)`, `(shop)`, `(product-single)`, etc. — theme showcase, not all production paths.
- **API:** partial integration on Beauty home (`Products1.tsx` tries API, falls back to static `data/*`).
- **Tab filtering:** see `client/.cursor/rules/product-tab-filtering-pattern.mdc`.

## Common tasks

### Add a production page

1. Create a route under `app/`.
2. Reuse components from `components/`.
3. Prefer static data in `data/` for demos; use `@platform/api-client` only when wiring real catalog.

### Add a modal

1. Component under `components/modals/`.
2. Register in `components/common/other-components/LayoutModals.tsx`.
3. Wire open/close in `context/uiStore.ts`.

## Quality

```bash
npm run lint -w @platform/storefront
npm run build -w @platform/storefront
```

## Deployment

Standard Next.js production flow. Client includes a multi-stage `Dockerfile` (note: verify Node version matches repo `engines`).

## Troubleshooting

- Unexpected dev behavior: delete `client/.next/` and restart.
- SCSS not refreshing: restart dev server.
- After dependency changes: `npm install` from repo root.
